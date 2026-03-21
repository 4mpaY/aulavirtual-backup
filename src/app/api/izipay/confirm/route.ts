import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { completeOrder } from '@/utils/libs/order-service'

/**
 * POST /api/izipay/confirm
 * Recibe la respuesta del pago desde el frontend (callbackResponse de Izipay Web Core)
 * y actualiza el pedido + crea la inscripción si fue exitoso.
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { pedidoId, response: izipayResponse } = await request.json()

    if (!pedidoId || !izipayResponse) {
      return ApiResponse.error(request, 'Datos de confirmación incompletos', 400)
    }

    // 1. Buscar el pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    if (pedido.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes acceso a este pedido', 403)
    }

    if (pedido.estado === 'COMPLETADO') {
      return ApiResponse.error(request, 'Este pedido ya fue completado', 400)
    }

    // 2. Verificar si el pago fue exitoso (code === '00' en Izipay Web Core)
    const isPaymentSuccessful = izipayResponse.code === '00'

    if (!isPaymentSuccessful) {
      // Actualizar pedido como cancelado
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          estado: 'CANCELADO',
          cancelado_en: new Date(),
          respuesta_izipay: izipayResponse
        }
      })

      return ApiResponse.error(request, izipayResponse.messageUser || 'El pago no fue exitoso', 400)
    }

    // 3. Pago exitoso - Completar Pedido usando el servicio centralizado
    const { pedido: pedidoActualizado, inscripciones } = await completeOrder(pedidoId, {
      metodo_pago: 'IZIPAY',
      respuesta_pago: izipayResponse,
      transaccion_id: izipayResponse.transactionId || null
    })

    return ApiResponse.success(
      request,
      {
        message: '¡Pago completado! Ya tienes acceso al curso.',
        pedido: pedidoActualizado,
        inscripciones: inscripciones
      },
      200
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
