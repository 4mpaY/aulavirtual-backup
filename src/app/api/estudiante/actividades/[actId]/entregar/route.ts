import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { puedeAccederCurso } from '@/utils/libs/subscription-access'

/**
 * POST /api/estudiante/actividades/[actId]/entregar
 * Permite a un estudiante entregar una actividad (archivo o formulario)
 */
export async function POST(
  request: Request,
  { params }: { params: { actId: string } }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { actId } = params

    const actividad = await prisma.actividad.findUnique({
      where: { id: actId },
      include: {
        curso: { select: { id: true, profesor_id: true } },
        preguntas: {
          include: { opciones: true }
        }
      }
    })

    if (!actividad) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    if (!actividad.esta_publicado) {
      return ApiResponse.error(request, 'Esta actividad no está disponible', 403)
    }

    const { acceso } = await puedeAccederCurso(user.id, actividad.curso.id, user.rol, actividad.curso.profesor_id)

    if (!acceso) {
      return ApiResponse.error(request, 'No tienes acceso a esta actividad', 403)
    }

    const ahora = new Date()

    if (actividad.fecha_inicio && ahora < actividad.fecha_inicio) {
      return ApiResponse.error(
        request,
        `Esta actividad aún no está disponible. Estará activa desde el ${actividad.fecha_inicio.toLocaleString('es-PE')}`,
        400
      )
    }

    if (actividad.fecha_fin && ahora > actividad.fecha_fin) {
      return ApiResponse.error(
        request,
        `El plazo para entregar esta actividad venció el ${actividad.fecha_fin.toLocaleString('es-PE')}`,
        400
      )
    }

    const body = await request.json()
    const { archivo_url, archivo_nombre, comentario_estudiante, respuestas } = body

    const entregaExistente = await prisma.entregaActividad.findUnique({
      where: {
        actividad_id_usuario_id: {
          actividad_id: actId,
          usuario_id: user.id
        }
      }
    })

    if (entregaExistente && entregaExistente.nota !== null) {
      return ApiResponse.error(request, 'No puedes modificar una entrega que ya ha sido calificada', 400)
    }

    if (actividad.tipo === 'ARCHIVO') {
      if (!archivo_url || !archivo_nombre) {
        return ApiResponse.error(request, 'El archivo y su nombre son requeridos', 400)
      }
    } else if (actividad.tipo === 'FORMULARIO') {
      if (!Array.isArray(respuestas) || respuestas.length === 0) {
        return ApiResponse.error(request, 'Debes responder al menos una pregunta', 400)
      }

      if (respuestas.length < actividad.preguntas.length) {
        return ApiResponse.error(request, 'Debes responder todas las preguntas', 400)
      }

      for (const r of respuestas) {
        if (!r.pregunta_id || !r.opcion_id) {
          return ApiResponse.error(request, 'Respuesta inválida', 400)
        }

        const pregunta = actividad.preguntas.find(p => p.id === r.pregunta_id)

        if (!pregunta) {
          return ApiResponse.error(request, 'Pregunta no válida', 400)
        }

        const opcion = pregunta.opciones.find(o => o.id === r.opcion_id)

        if (!opcion) {
          return ApiResponse.error(request, 'Opción no válida', 400)
        }
      }
    }

    const respuestasFormateadas =
      actividad.tipo === 'FORMULARIO'
        ? respuestas.map((r: any) => {
            const pregunta = actividad.preguntas.find(p => p.id === r.pregunta_id)!
            const opcion = pregunta.opciones.find(o => o.id === r.opcion_id)!

            return {
              pregunta_id: r.pregunta_id,
              opcion_id: r.opcion_id,
              opcion_texto: opcion.texto
            }
          })
        : null

    const entrega = await prisma.entregaActividad.upsert({
      where: {
        actividad_id_usuario_id: {
          actividad_id: actId,
          usuario_id: user.id
        }
      },
      create: {
        actividad_id: actId,
        usuario_id: user.id,
        archivo_url: actividad.tipo === 'ARCHIVO' ? archivo_url : null,
        archivo_nombre: actividad.tipo === 'ARCHIVO' ? archivo_nombre : null,
        comentario_estudiante: comentario_estudiante || null,
        respuestas: respuestasFormateadas
      },
      update: {
        archivo_url: actividad.tipo === 'ARCHIVO' ? archivo_url : null,
        archivo_nombre: actividad.tipo === 'ARCHIVO' ? archivo_nombre : null,
        comentario_estudiante: comentario_estudiante || null,
        respuestas: respuestasFormateadas,
        actualizado_en: ahora
      }
    })

    return ApiResponse.success(request, { entrega }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
