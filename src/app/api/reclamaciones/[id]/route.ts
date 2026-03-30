export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { updateReclamacionSchema } from '@/schemas/reclamacion.schema'

/**
 * PATCH /api/reclamaciones/[id]
 * Actualizar respuesta y estado de la reclamación (solo ADMIN)
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params
    const payload = await request.json().catch(() => ({}))

    const validation = validateRequest(updateReclamacionSchema, payload, request)

    if (!validation.success) {
      return validation.error
    }

    const { estado, respuesta_proveedor } = validation.data

    const reclamacionExistente = await prisma.reclamacion.findUnique({
      where: { id }
    })

    if (!reclamacionExistente) {
      return ApiResponse.error(request, 'Reclamación no encontrada', 404)
    }

    const fecha_respuesta =
      estado === 'ATENDIDO' && !reclamacionExistente.fecha_respuesta ? new Date() : reclamacionExistente.fecha_respuesta

    const reclamacionActualizada = await prisma.reclamacion.update({
      where: { id },
      data: {
        estado,
        respuesta_proveedor,
        fecha_respuesta: estado === 'ATENDIDO' ? fecha_respuesta : null
      }
    })

    return ApiResponse.success(request, {
      message: 'Reclamación actualizada correctamente',
      data: reclamacionActualizada
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
