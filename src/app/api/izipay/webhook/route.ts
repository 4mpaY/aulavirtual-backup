import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'

/**
 * POST /api/izipay/webhook
 * Endpoint de respaldo para recibir notificaciones IPN de Izipay (server-to-server).
 * En el flujo principal de Web Core, la confirmación se hace vía /api/izipay/confirm.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { orderStatus, orderId, transactions } = body

    if (!orderId) {
      return NextResponse.json({ message: 'OrderId no proporcionado' }, { status: 400 })
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id: orderId }
    })

    if (!pedido) {
      console.error(`[WEBHOOK IZIPAY] Pedido no encontrado: ${orderId}`)

      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 })
    }

    if (orderStatus === 'PAID') {
      const transaccion = transactions?.[0]
      const transaccionId = transaccion?.uuid

      await prisma.$transaction(async tx => {
        await tx.pedido.update({
          where: { id: pedido.id },
          data: {
            estado: 'COMPLETADO',
            pagado_en: new Date(),
            transaccion_id: transaccionId,
            respuesta_izipay: body
          }
        })

        const detalles = await tx.detallePedido.findMany({
          where: { pedido_id: pedido.id }
        })

        for (const detalle of detalles) {
          await tx.inscripcion.upsert({
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
        }
      })

      console.log(`[WEBHOOK IZIPAY] Pedido ${pedido.id} completado con éxito.`)
    } else {
      console.warn(`[WEBHOOK IZIPAY] Pago no exitoso para pedido ${pedido.id}: ${orderStatus}`)
    }

    return NextResponse.json({ message: 'Notificación procesada' }, { status: 200 })
  } catch (error) {
    console.error('[WEBHOOK IZIPAY] Error crítico:', error)

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
