export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/estudiante/examen/[examenId]
 * Obtiene las preguntas de un examen (sin revelar respuestas correctas)
 * Valida que el estudiante esté inscrito y tenga 100% de progreso
 */
export async function GET(
  request: Request,
  { params }: { params: { examenId: string } }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { examenId } = params

    // 1. Obtener el examen con su curso
    const examen = await prisma.examen.findUnique({
      where: { id: examenId },
      include: {
        curso: {
          select: { id: true, titulo: true }
        },
        preguntas: {
          orderBy: { orden: 'asc' },
          include: {
            opciones: {
              orderBy: { orden: 'asc' },
              select: {
                id: true,
                texto: true,
                orden: true,
                es_correcta: true // Lo necesitamos para el resultado anterior, pero no lo expondremos
              }
            }
          }
        }
      }
    })

    if (!examen) {
      return ApiResponse.error(request, 'Examen no encontrado', 404)
    }

    if (!examen.esta_publicado) {
      console.log(`[EXAMEN DEBUG] Examen ${examenId} no está publicado`)

      return ApiResponse.error(request, 'Este examen no está disponible', 403)
    }

    // 2. Verificar inscripción
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: examen.curso.id
        }
      }
    })

    if (!inscripcion || inscripcion.estado !== 'ACTIVO') {
      console.log(`[EXAMEN DEBUG] Usuario ${auth.user.id} no está inscrito o activo en curso ${examen.curso.id}. Estado: ${inscripcion?.estado}`)

      return ApiResponse.error(request, 'No estás inscrito en este curso', 403)
    }

    // 3. Verificar progreso mínimo requerido
    const progresoCurso = await prisma.progresoCurso.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: examen.curso.id
        }
      }
    })

    if (!progresoCurso || progresoCurso.porcentaje_progreso < examen.progreso_minimo) {
      console.log(`[EXAMEN DEBUG] Usuario ${auth.user.id} tiene progreso insuficiente: ${progresoCurso?.porcentaje_progreso ?? 0}% (requerido: ${examen.progreso_minimo}%)`)

      return ApiResponse.error(
        request,
        `Debes alcanzar ${examen.progreso_minimo}% de progreso antes de acceder a este examen`,
        403
      )
    }

    // 4. Verificar intentos restantes
    const intentosRealizados = await prisma.intentoExamen.count({
      where: {
        usuario_id: auth.user.id,
        examen_id: examenId,
        enviado_en: { not: null }
      }
    })

    const intentosRestantes = examen.intentos_maximos - intentosRealizados

    // 5. Verificar si ya aprobó
    const intentoAprobado = await prisma.intentoExamen.findFirst({
      where: {
        usuario_id: auth.user.id,
        examen_id: examenId,
        esta_aprobado: true
      }
    })

    const ultimoIntento = await prisma.intentoExamen.findFirst({
      where: {
        usuario_id: auth.user.id,
        examen_id: examenId,
        enviado_en: { not: null }
      },
      include: {
        respuestas: true
      },
      orderBy: { enviado_en: 'desc' }
    })

    const yaAprobado = !!intentoAprobado

    let resultadoAnterior = null
    if (ultimoIntento && (yaAprobado || intentosRestantes <= 0)) {
      resultadoAnterior = {
        intentoId: ultimoIntento.id,
        puntaje: ultimoIntento.puntaje,
        aprobado: ultimoIntento.esta_aprobado,
        puntajeAprobacion: examen.puntaje_aprobacion,
        respuestasCorrectas: ultimoIntento.respuestas.filter((r: any) => r.es_correcta).length,
        totalPreguntas: examen.preguntas.length,
        intentosRestantes,
        detallesRespuestas: ultimoIntento.respuestas.map((r: any) => {
          const preg = examen.preguntas.find(p => p.id === r.pregunta_id)
          const correcta = preg?.opciones.find(o => o.es_correcta)
          
          return {
            preguntaId: r.pregunta_id,
            opcionSeleccionadaId: r.opcion_seleccionada_id,
            opcionCorrectaId: correcta?.id,
            esCorrecta: r.es_correcta
          }
        })
      }
    }

    return ApiResponse.success(request, {
      examen: {
        id: examen.id,
        titulo: examen.titulo,
        descripcion: examen.descripcion,
        limite_tiempo: examen.limite_tiempo,
        puntaje_aprobacion: examen.puntaje_aprobacion,
        mezclar_preguntas: examen.mezclar_preguntas,
        preguntas: examen.preguntas.map(p => ({
          id: p.id,
          texto: p.texto,
          tipo: p.tipo,
          puntos: p.puntos,
          opciones: p.opciones.map(o => ({
            id: o.id,
            texto: o.texto,
            orden: o.orden
          }))
        }))
      },
      cursoTitulo: examen.curso.titulo,
      intentosRestantes,
      yaAprobado,
      puntajeAprobado: intentoAprobado?.puntaje || null,
      resultadoAnterior
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
