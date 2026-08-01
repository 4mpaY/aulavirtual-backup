import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { completeOrder } from '@/utils/libs/order-service'
import { getConfigs } from '@/utils/libs/config'
import { verifyVadsSignature } from '@/utils/libs/izipay-signature'

// Mapeo de códigos ISO 4217 numéricos a alfabéticos para las monedas soportadas.
const CURRENCY_NUMERIC_TO_ALPHA: Record<string, string> = {
  '604': 'PEN',
  '840': 'USD'
}

/**
 * POST /api/izipay/webhook
 * Notificación IPN server-to-server de Izipay (Lyra / MiCuentaWeb), formato clásico
 * vads_* (application/x-www-form-urlencoded) con firma HMAC-SHA256 en el campo
 * `signature`, calculada sobre los campos vads_* concatenados en orden alfabético.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const params = new URLSearchParams(rawBody)

    // TEMPORAL: diagnóstico para depurar la verificación de firma end-to-end.
    console.log('[WEBHOOK IZIPAY][DEBUG] Content-Type:', request.headers.get('content-type'))
    console.log('[WEBHOOK IZIPAY][DEBUG] Raw body:', rawBody)

    const configs = await getConfigs()
    const claveHash = configs.IZIPAY_HASH_KEY

    if (!claveHash) {
      console.error('[WEBHOOK IZIPAY] IZIPAY_HASH_KEY no configurado. Rechazando notificación por seguridad.')

      return NextResponse.json({ message: 'Pasarela no configurada correctamente' }, { status: 500 })
    }

    if (!verifyVadsSignature(params, claveHash)) {
      console.warn('[WEBHOOK IZIPAY] Firma inválida rechazada. IP potencialmente maliciosa.')

      return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
    }

    const orderId = params.get('vads_order_id')
    const transStatus = params.get('vads_trans_status')
    const transUuid = params.get('vads_trans_uuid')
    const amount = params.get('vads_amount')
    const currencyNumeric = params.get('vads_currency')

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

    if (transStatus === 'AUTHORISED' || transStatus === 'CAPTURED') {
      // Validar que el monto/moneda notificados coincidan con el pedido antes de
      // otorgar acceso, evitando confiar ciegamente en un IPN con datos manipulados.
      if (amount != null && currencyNumeric != null) {
        const expectedAmount = Math.round(Number(pedido.total) * 100)
        const reportedCurrency = CURRENCY_NUMERIC_TO_ALPHA[currencyNumeric] ?? currencyNumeric

        if (Number(amount) !== expectedAmount || reportedCurrency !== pedido.moneda) {
          console.error(
            `[WEBHOOK IZIPAY] Monto/moneda no coinciden para pedido ${pedido.id}. ` +
              `Esperado: ${expectedAmount} ${pedido.moneda}. Recibido: ${amount} ${reportedCurrency}.`
          )

          return NextResponse.json({ message: 'El monto notificado no coincide con el pedido' }, { status: 400 })
        }
      }

      await completeOrder(pedido.id, {
        metodo_pago: 'IZIPAY',
        respuesta_pago: Object.fromEntries(params.entries()),
        transaccion_id: transUuid || undefined
      })

      console.log(`[WEBHOOK IZIPAY] Pedido ${pedido.id} completado con éxito vía servicio.`)
    } else {
      console.warn(`[WEBHOOK IZIPAY] Pago no exitoso para pedido ${pedido.id}: ${transStatus}`)
    }

    return NextResponse.json({ message: 'Notificación procesada' }, { status: 200 })
  } catch (error) {
    console.error('[WEBHOOK IZIPAY] Error crítico:', error)

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
