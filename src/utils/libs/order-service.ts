import prisma from '@/utils/libs/prisma'
import { sendOrderConfirmationEmail } from './order-notifications'

interface OrderCompletionData {
  metodo_pago: 'PAYPAL' | 'IZIPAY'
  transaccion_id?: string
  respuesta_pago?: any
}

/**
 * Servicio centralizado para completar un pedido.
 * Maneja transacciones, inscripciones, cupones, notificaciones administrativas
 * y el envío automático del correo de confirmación al usuario.
 */
export async function completeOrder(pedidoId: string, data: OrderCompletionData) {
  try {
    // 1. Verificar si el pedido ya fue completado (para evitar duplicados por webhooks concurrentes)
    const pedidoInit = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { detalles: true, usuario: true }
    })

    if (!pedidoInit) throw new Error(`Pedido ${pedidoId} no encontrado.`)

    if (pedidoInit.estado === 'COMPLETADO') {
      console.log(`[Order-Service] El pedido ${pedidoId} ya está completado.`)

      const inscripciones = await prisma.inscripcion.findMany({
        where: { pedido_id: pedidoId }
      })

      return { pedido: pedidoInit, inscripciones, yaCompletado: true }
    }

    // 2. Transacción de Base de Datos
    const result = await prisma.$transaction(async tx => {
      // a) Actualizar pedido
      const pedidoActualizado = await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          estado: 'COMPLETADO',
          pagado_en: new Date(),
          metodo_pago: data.metodo_pago,
          transaccion_id: data.transaccion_id || null,
          respuesta_izipay: data.respuesta_pago || null // Se usa este campo para el log de respuesta
        }
      })

      // b) Incrementar uso de cupón si aplica
      if (pedidoInit.cupon_id) {
        await tx.cupon.update({
          where: { id: pedidoInit.cupon_id },
          data: { usos_actuales: { increment: 1 } }
        })
      }

      // c) Crear inscripciones activas
      const inscripciones = []

      for (const detalle of pedidoInit.detalles) {
        const ins = await tx.inscripcion.upsert({
          where: {
            usuario_id_curso_id: {
              usuario_id: pedidoInit.usuario_id,
              curso_id: detalle.curso_id
            }
          },
          update: {
            estado: 'ACTIVO',
            pedido_id: pedidoId
          },
          create: {
            usuario_id: pedidoInit.usuario_id,
            curso_id: detalle.curso_id,
            pedido_id: pedidoId,
            estado: 'ACTIVO'
          }
        })

        inscripciones.push(ins)
      }

      // d) Notificar a Admins
      const admins = await tx.usuario.findMany({
        where: { rol: 'ADMIN' },
        select: { id: true }
      })

      for (const admin of admins) {
        await tx.notificacion.create({
          data: {
            titulo: `Nuevo Pedido (${data.metodo_pago})`,
            mensaje: `El usuario ${pedidoInit.usuario.nombre} ha realizado un pedido exitoso por ${pedidoInit.moneda} ${pedidoInit.total}.`,
            tipo: 'PEDIDO_NUEVO',
            usuario_id: admin.id,
            enlace: `/admin/pedidos`
          }
        })
      }

      return { pedido: pedidoActualizado, inscripciones }
    })

    // 3. Envío de Correo Asíncrono (No bloquea la respuesta del API)
    // Se dispara después de que la transacción haya sido confirmada exitosamente.
    sendOrderConfirmationEmail(pedidoId).catch(err => {
      console.error(`[Order-Service] Error enviando mail después de completar pedido ${pedidoId}:`, err)
    })

    return { ...result, yaCompletado: false }
  } catch (error) {
    console.error(`[Order-Service] Error crítico completando pedido ${pedidoId}:`, error)
    throw error
  }
}
