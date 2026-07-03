export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/cursos/[id]/actividades/[actId]/preguntas
 */
export async function POST(request: Request, { params }: { params: { id: string; actId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const actividad = await prisma.actividad.findUnique({ where: { id: actId } })

    if (!actividad || actividad.curso_id !== cursoId) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    const body = await request.json()
    const { texto, tipo = 'OPCION_MULTIPLE', puntos = 1, opciones = [] } = body

    if (!texto?.trim()) return ApiResponse.error(request, 'El enunciado es requerido', 400)

    const maxOrden = await prisma.preguntaActividad.aggregate({
      where: { actividad_id: actId },
      _max: { orden: true }
    })

    const orden = (maxOrden._max.orden ?? -1) + 1

    const pregunta = await prisma.preguntaActividad.create({
      data: {
        texto,
        tipo,
        puntos: Number(puntos),
        orden,
        actividad_id: actId,
        opciones: {
          create: opciones.map((o: any, i: number) => ({
            texto: o.texto,
            es_correcta: o.es_correcta ?? false,
            orden: i
          }))
        }
      },
      include: { opciones: { orderBy: { orden: 'asc' } } }
    })

    return ApiResponse.success(request, { pregunta }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
