import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { capturePaypalOrder } from '@/utils/libs/paypal-api'
import { completeOrder } from '@/utils/libs/order-service'

/**
 * POST /api/paypal/capture
 * Captura la orden de PayPal y completa el pedido
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { orderId, pedidoId } = await request.json()

    if (!orderId || !pedidoId) {
      return ApiResponse.error(request, 'Datos incompletos', 400)
    }

    // 1. Verificar pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { detalles: true }
    })

    if (!pedido || pedido.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'Pedido no encontrado o acceso denegado', 404)
    }

    if (pedido.estado === 'COMPLETADO') {
      return ApiResponse.success(request, { message: 'El pedido ya fue completado previously.' })
    }

    // 2. Capturar en PayPal
    const captureData = await capturePaypalOrder(orderId)

    if (captureData.status !== 'COMPLETED') {
      return ApiResponse.error(request, 'El pago no se pudo completar en PayPal', 400)
    }

    // 3. Completar Pedido usando el servicio centralizado
    const { pedido: pedidoActualizado, yaCompletado } = await completeOrder(pedidoId, {
      metodo_pago: 'PAYPAL',
      respuesta_pago: captureData,
      transaccion_id: captureData.id
    })

    return ApiResponse.success(request, {
      message: yaCompletado ? 'El pago ya fue procesado.' : '¡Pago con PayPal exitoso!',
      pedido: pedidoActualizado
    })
  } catch (error) {
    console.error('[PAYPAL_CAPTURE_ERROR]', error)

    return handleApiError(error, request)
  }
}
