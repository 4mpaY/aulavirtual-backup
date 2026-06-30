export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * PATCH /api/cursos/[id]/actividades/[actId]/entregas/[entId]
 * Calificar una entrega
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; actId: string; entId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { actId, entId } = params
    const body = await request.json()
    const { nota, comentario_docente } = body

    const entrega = await prisma.entregaActividad.findUnique({ where: { id: entId } })

    if (!entrega || entrega.actividad_id !== actId) {
      return ApiResponse.error(request, 'Entrega no encontrada', 404)
    }

    const updated = await prisma.entregaActividad.update({
      where: { id: entId },
      data: {
        ...(nota !== undefined && { nota: nota !== null ? Number(nota) : null }),
        ...(comentario_docente !== undefined && { comentario_docente })
      },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, avatar: true } }
      }
    })

    return ApiResponse.success(request, { entrega: updated })
  } catch (error) {
    return handleApiError(error, request)
  }
}
