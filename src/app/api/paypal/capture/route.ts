import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { capturePaypalOrder } from '@/utils/libs/paypal-api'

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

    // 3. Completar en DB (Transacción)
    const result = await prisma.$transaction(async tx => {
      // Actualizar pedido
      const pedidoActualizado = await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          estado: 'COMPLETADO',
          pagado_en: new Date(),
          metodo_pago: 'PAYPAL',
          respuesta_izipay: captureData // Reutilizamos el campo para guardar la respuesta de PayPal
        }
      })

      // Incrementar cupón
      if (pedido.cupon_id) {
        await tx.cupon.update({
          where: { id: pedido.cupon_id },
          data: { usos_actuales: { increment: 1 } }
        })
      }

      // Crear inscripciones
      const inscripciones = []

      for (const detalle of pedido.detalles) {
        const ins = await tx.inscripcion.upsert({
          where: {
            usuario_id_curso_id: {
              usuario_id: pedido.usuario_id,
              curso_id: detalle.curso_id
            }
          },
          update: { estado: 'ACTIVO', pedido_id: pedido.id },
          create: {
            usuario_id: pedido.usuario_id,
            curso_id: detalle.curso_id,
            pedido_id: pedido.id,
            estado: 'ACTIVO'
          }
        })

        inscripciones.push(ins)
      }

      // Notificar admins
      const admins = await tx.usuario.findMany({
        where: { rol: 'ADMIN' },
        select: { id: true }
      })

      for (const admin of admins) {
        await tx.notificacion.create({
          data: {
            titulo: 'Nuevo Pedido PayPal',
            mensaje: `El usuario ${auth.user.name} ha realizado un pedido con PayPal por $${pedido.total}.`,
            tipo: 'PEDIDO_NUEVO',
            usuario_id: admin.id,
            enlace: `/admin/pedidos`
          }
        })
      }

      return { pedido: pedidoActualizado, inscripciones }
    })

    return ApiResponse.success(request, {
      message: '¡Pago con PayPal exitoso!',
      pedido: result.pedido
    })
  } catch (error) {
    console.error('[PAYPAL_CAPTURE_ERROR]', error)

    return handleApiError(error, request)
  }
}
