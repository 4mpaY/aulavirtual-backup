import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/estudiante/examen/[examenId]/enviar
 * Envía las respuestas del examen y califica automáticamente
 * Body: { respuestas: [{ preguntaId: string, opcionId: string }] }
 */
export async function POST(
  request: Request,
  { params }: { params: { examenId: string } }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { examenId } = params
    const { respuestas } = await request.json()

    if (!respuestas || !Array.isArray(respuestas)) {
      return ApiResponse.error(request, 'Las respuestas son requeridas', 400)
    }

    // 1. Obtener el examen con preguntas y opciones correctas
    const examen = await prisma.examen.findUnique({
      where: { id: examenId },
      include: {
        curso: { select: { id: true } },
        preguntas: {
          include: {
            opciones: true
          }
        }
      }
    })

    if (!examen) {
      return ApiResponse.error(request, 'Examen no encontrado', 404)
    }

    // 2. Verificar inscripción y progreso
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: examen.curso.id
        }
      }
    })

    if (!inscripcion || inscripcion.estado !== 'ACTIVO') {
      return ApiResponse.error(request, 'No estás inscrito en este curso', 403)
    }

    const progresoCurso = await prisma.progresoCurso.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: examen.curso.id
        }
      }
    })

    if (!progresoCurso || progresoCurso.porcentaje_progreso < 100) {
      return ApiResponse.error(request, 'Debes completar todas las lecciones primero', 403)
    }

    // 3. Verificar intentos restantes
    const intentosRealizados = await prisma.intentoExamen.count({
      where: {
        usuario_id: auth.user.id,
        examen_id: examenId,
        enviado_en: { not: null }
      }
    })

    if (intentosRealizados >= examen.intentos_maximos) {
      return ApiResponse.error(request, 'Has agotado todos tus intentos', 403)
    }

    // 4. Verificar si ya aprobó
    const yaAprobado = await prisma.intentoExamen.findFirst({
      where: {
        usuario_id: auth.user.id,
        examen_id: examenId,
        esta_aprobado: true
      }
    })

    if (yaAprobado) {
      return ApiResponse.error(request, 'Ya has aprobado este examen', 400)
    }

    // 5. Calificar respuestas
    let puntajeTotal = 0
    let puntajeObtenido = 0

    const respuestasCalificadas = respuestas.map((resp: { preguntaId: string; opcionId: string }) => {
      const pregunta = examen.preguntas.find(p => p.id === resp.preguntaId)

      if (!pregunta) return null

      puntajeTotal += pregunta.puntos

      const opcionCorrecta = pregunta.opciones.find(o => o.es_correcta)
      const esCorrecta = opcionCorrecta?.id === resp.opcionId
      const puntos = esCorrecta ? pregunta.puntos : 0

      puntajeObtenido += puntos

      return {
        pregunta_id: resp.preguntaId,
        opcion_seleccionada_id: resp.opcionId,
        es_correcta: esCorrecta,
        puntos_obtenidos: puntos
      }
    }).filter(Boolean)

    // Calcular porcentaje
    const porcentaje = puntajeTotal > 0 ? Math.round((puntajeObtenido / puntajeTotal) * 100) : 0
    const aprobado = porcentaje >= examen.puntaje_aprobacion

    // 6. Guardar intento y respuestas en transacción
    const intento = await prisma.$transaction(async (tx) => {
      const nuevoIntento = await tx.intentoExamen.create({
        data: {
          usuario_id: auth.user.id,
          examen_id: examenId,
          puntaje: porcentaje,
          esta_aprobado: aprobado,
          enviado_en: new Date(),
          respuestas: {
            create: respuestasCalificadas as any[]
          }
        }
      })

      return nuevoIntento
    })

    return ApiResponse.success(request, {
      intentoId: intento.id,
      puntaje: porcentaje,
      aprobado,
      puntajeAprobacion: examen.puntaje_aprobacion,
      respuestasCorrectas: respuestasCalificadas.filter((r: any) => r.es_correcta).length,
      totalPreguntas: examen.preguntas.length,
      intentosRestantes: examen.intentos_maximos - intentosRealizados - 1
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
