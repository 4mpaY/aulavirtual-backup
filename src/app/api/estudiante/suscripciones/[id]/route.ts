export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { culqiSuscripcion } from '@/utils/libs/culqi-suscripcion'

/**
 * DELETE /api/estudiante/suscripciones/[id]
 * Cancela una suscripción del usuario
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const suscripcion = await prisma.suscripcion.findUnique({
      where: { id: params.id }
    })

    if (!suscripcion) return ApiResponse.error(request, 'Suscripción no encontrada', 404)

    if (suscripcion.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para cancelar esta suscripción', 403)
    }

    if (suscripcion.estado === 'CANCELADA') {
      return ApiResponse.error(request, 'La suscripción ya está cancelada', 409)
    }

    // Cancelar en Culqi
    if (suscripcion.culqi_suscripcion_id) {
      try {
        await culqiSuscripcion.cancelarSuscripcion(suscripcion.culqi_suscripcion_id)
      } catch (culqiError: any) {
        console.error('Error cancelando suscripción en Culqi:', culqiError?.message)
      }
    }

    await prisma.suscripcion.update({
      where: { id: params.id },
      data: {
        estado: 'CANCELADA',
        fecha_cancelacion: new Date(),
        cancelado_por_usuario: true
      }
    })

    return ApiResponse.success(request, { message: 'Suscripción cancelada correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
