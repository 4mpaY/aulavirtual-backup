import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { completeOrder } from '@/utils/libs/order-service'
import { getConfigs } from '@/utils/libs/config'
import { verifyIzipaySignature } from '@/utils/libs/izipay-signature'

/**
 * POST /api/izipay/webhook
 * Notificación IPN server-to-server de Izipay (Lyra / MiCuentaWeb).
 * El body llega como application/x-www-form-urlencoded con los campos
 * kr-answer (JSON stringificado) y kr-hash (HMAC-SHA256 hex sobre kr-answer,
 * calculado con la "Clave HMAC-SHA-256" del comercio).
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const contentType = request.headers.get('content-type') || ''

    let krAnswer: string | undefined
    let krHash: string | undefined

    if (contentType.includes('application/json')) {
      const parsed = JSON.parse(rawBody)

      krAnswer = parsed['kr-answer']
      krHash = parsed['kr-hash']
    } else {
      const params = new URLSearchParams(rawBody)

      krAnswer = params.get('kr-answer') || undefined
      krHash = params.get('kr-hash') || undefined
    }

    if (!krAnswer || !krHash) {
      return NextResponse.json({ message: 'kr-answer/kr-hash no proporcionados' }, { status: 400 })
    }

    const configs = await getConfigs()
    const claveHash = configs.IZIPAY_HASH_KEY

    if (!claveHash) {
      console.error('[WEBHOOK IZIPAY] IZIPAY_HASH_KEY no configurado. Rechazando notificación por seguridad.')

      return NextResponse.json({ message: 'Pasarela no configurada correctamente' }, { status: 500 })
    }

    if (!verifyIzipaySignature({ krAnswer, krHash }, claveHash)) {
      console.warn('[WEBHOOK IZIPAY] Firma inválida rechazada. IP potencialmente maliciosa.')

      return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
    }

    const answer = JSON.parse(krAnswer)
    const orderStatus = answer.orderStatus
    const orderId = answer.orderDetails?.orderId ?? answer.orderId

    if (!orderId) {
      return NextResponse.json({ message: 'orderId no proporcionado' }, { status: 400 })
    }

    // Buscamos por el UUID del pedido (enviado como orderId al crear la orden). Se
    // mantiene un fallback por numero_pedido como red de seguridad barata.
    let pedido = await prisma.pedido.findUnique({
      where: { id: orderId }
    })

    if (!pedido) {
      const numeroPedido = Number(orderId)

      if (!Number.isNaN(numeroPedido)) {
        pedido = await prisma.pedido.findFirst({
          where: { numero_pedido: numeroPedido }
        })
      }
    }

    if (!pedido) {
      console.error(`[WEBHOOK IZIPAY] Pedido no encontrado: ${orderId}`)

      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 })
    }

    if (pedido.estado === 'COMPLETADO') {
      return NextResponse.json({ message: 'Pedido ya completado' }, { status: 200 })
    }

    if (orderStatus === 'PAID') {
      const transaccionId = answer.transactions?.[0]?.uuid

      // Validar que el monto/moneda notificados coincidan con el pedido antes de
      // otorgar acceso, evitando confiar ciegamente en un IPN con datos manipulados.
      const reportedAmount = answer.orderDetails?.orderTotalAmount ?? answer.transactions?.[0]?.amount
      const reportedCurrency = answer.orderDetails?.orderCurrency ?? answer.transactions?.[0]?.currency

      if (reportedAmount != null && reportedCurrency != null) {
        const expectedAmount = Math.round(Number(pedido.total) * 100)

        if (Number(reportedAmount) !== expectedAmount || reportedCurrency !== pedido.moneda) {
          console.error(
            `[WEBHOOK IZIPAY] Monto/moneda no coinciden para pedido ${pedido.id}. ` +
              `Esperado: ${expectedAmount} ${pedido.moneda}. Recibido: ${reportedAmount} ${reportedCurrency}.`
          )

          return NextResponse.json({ message: 'El monto notificado no coincide con el pedido' }, { status: 400 })
        }
      }

      await completeOrder(pedido.id, {
        metodo_pago: 'IZIPAY',
        respuesta_pago: answer,
        transaccion_id: transaccionId
      })

      console.log(`[WEBHOOK IZIPAY] Pedido ${pedido.id} completado con éxito vía servicio.`)
    } else {
      console.warn(`[WEBHOOK IZIPAY] Pago no exitoso para pedido ${pedido.id}: ${orderStatus}`)
    }

    return NextResponse.json({ message: 'Notificación procesada' }, { status: 200 })
  } catch (error) {
    console.error('[WEBHOOK IZIPAY] Error crítico:', error)

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
