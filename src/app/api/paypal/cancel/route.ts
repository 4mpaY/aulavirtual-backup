import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/paypal/cancel
 * Actualiza el pedido como CANCELADO cuando el usuario cierra el popup de PayPal
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { pedidoId } = await request.json()

    if (!pedidoId) {
      return ApiResponse.error(request, 'ID de pedido no proporcionado', 400)
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    if (pedido.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes acceso a este pedido', 403)
    }

    // Solo actualizar si estaba pendiente
    if (pedido.estado === 'PENDIENTE') {
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          estado: 'CANCELADO',
          cancelado_en: new Date()
        }
      })
    }

    return ApiResponse.success(request, { message: 'Pedido marcado como cancelado' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
