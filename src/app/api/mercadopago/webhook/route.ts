import { NextResponse } from 'next/server'

import { getConfigs } from '@/utils/libs/config'
import { completeOrder } from '@/utils/libs/order-service'
import prisma from '@/utils/libs/prisma'

/**
 * POST /api/mercadopago/webhook
 * Recibe notificaciones IPN de Mercado Pago y completa el pedido
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Solo procesar notificaciones de pagos aprobados
    if (type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = data?.id

    if (!paymentId) {

      return NextResponse.json({ received: true })
    }

    const configs = await getConfigs()
    const accessToken = configs.MP_ACCESS_TOKEN

    if (!accessToken) {
      console.error('[MP_WEBHOOK] MP_ACCESS_TOKEN no configurado')

      return NextResponse.json({ error: 'Pasarela no configurada' }, { status: 500 })
    }

    // Consultar el pago en la API de Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!mpResponse.ok) {
      console.error('[MP_WEBHOOK] Error consultando pago:', await mpResponse.text())

      return NextResponse.json({ received: true })
    }

    const payment = await mpResponse.json()

    if (payment.status !== 'approved') {

      return NextResponse.json({ received: true })
    }

    // Buscar el pedido por external_reference (pedidoId)
    const pedidoId = payment.external_reference

    if (!pedidoId) {
      console.error('[MP_WEBHOOK] Sin external_reference en el pago')

      return NextResponse.json({ received: true })
    }

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })

    if (!pedido) {
      console.error('[MP_WEBHOOK] Pedido no encontrado:', pedidoId)

      return NextResponse.json({ received: true })
    }

    await completeOrder(pedidoId, {
      metodo_pago: 'MERCADOPAGO',
      transaccion_id: String(paymentId),
      respuesta_pago: payment
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[MP_WEBHOOK] Error:', error)

    return NextResponse.json({ received: true }) // Siempre 200 para que MP no reintente indefinidamente
  }
}
