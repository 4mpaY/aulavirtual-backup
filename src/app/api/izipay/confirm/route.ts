import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

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

    // 3. Pago exitoso - Crear inscripciones en una transacción
    const result = await prisma.$transaction(async tx => {
      // Actualizar pedido
      const pedidoActualizado = await tx.pedido.update({
        where: { id: pedido.id },
        data: {
          estado: 'COMPLETADO',
          pagado_en: new Date(),
          transaccion_id: izipayResponse.transactionId || null,
          respuesta_izipay: izipayResponse,
          metodo_pago: 'TARJETA_CREDITO'
        }
      })

      // Obtener los cursos del pedido
      const detalles = await tx.detallePedido.findMany({
        where: { pedido_id: pedido.id }
      })

      // Crear inscripciones para cada curso
      const inscripciones = []

      for (const detalle of detalles) {
        const inscripcion = await tx.inscripcion.upsert({
          where: {
            usuario_id_curso_id: {
              usuario_id: pedido.usuario_id,
              curso_id: detalle.curso_id
            }
          },
          update: {
            estado: 'ACTIVO',
            pedido_id: pedido.id
          },
          create: {
            usuario_id: pedido.usuario_id,
            curso_id: detalle.curso_id,
            pedido_id: pedido.id,
            estado: 'ACTIVO'
          }
        })

        inscripciones.push(inscripcion)
      }

      return { pedido: pedidoActualizado, inscripciones }
    })

    return ApiResponse.success(
      request,
      {
        message: '¡Pago completado! Ya tienes acceso al curso.',
        pedido: result.pedido,
        inscripciones: result.inscripciones
      },
      200
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
