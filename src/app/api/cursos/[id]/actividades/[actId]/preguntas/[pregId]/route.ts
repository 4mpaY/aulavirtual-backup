export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * PATCH /api/cursos/[id]/actividades/[actId]/preguntas/[pregId]
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string; actId: string; pregId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { actId, pregId } = params
    const pregunta = await prisma.preguntaActividad.findUnique({ where: { id: pregId } })

    if (!pregunta || pregunta.actividad_id !== actId) {
      return ApiResponse.error(request, 'Pregunta no encontrada', 404)
    }

    const body = await request.json()
    const { texto, puntos, opciones } = body

    // Delete old options and recreate
    await prisma.opcionPreguntaActividad.deleteMany({ where: { pregunta_id: pregId } })

    const updated = await prisma.preguntaActividad.update({
      where: { id: pregId },
      data: {
        ...(texto !== undefined && { texto }),
        ...(puntos !== undefined && { puntos: Number(puntos) }),
        opciones: opciones
          ? {
              create: opciones.map((o: any, i: number) => ({
                texto: o.texto,
                es_correcta: o.es_correcta ?? false,
                orden: i
              }))
            }
          : undefined
      },
      include: { opciones: { orderBy: { orden: 'asc' } } }
    })

    return ApiResponse.success(request, { pregunta: updated })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/cursos/[id]/actividades/[actId]/preguntas/[pregId]
 */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string; actId: string; pregId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { actId, pregId } = params
    const pregunta = await prisma.preguntaActividad.findUnique({ where: { id: pregId } })

    if (!pregunta || pregunta.actividad_id !== actId) {
      return ApiResponse.error(request, 'Pregunta no encontrada', 404)
    }

    await prisma.preguntaActividad.delete({ where: { id: pregId } })

    return ApiResponse.success(request, { message: 'Pregunta eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
