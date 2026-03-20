import { createHmac, timingSafeEqual } from 'crypto'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'

/**
 * Verifica la firma HMAC-SHA256 del webhook de Izipay.
 * Izipay envía el header 'x-izipay-hmac-sha256' con la firma del body.
 */
function verifyIzipaySignature(rawBody: string, signature: string | null): boolean {
  const apiKey = process.env.IZIPAY_API_KEY

  if (!apiKey || !signature) return false

  try {
    const expected = createHmac('sha256', apiKey).update(rawBody).digest('hex')
    const expectedBuffer = Buffer.from(expected, 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')

    // timingSafeEqual previene ataques de timing
    if (expectedBuffer.length !== signatureBuffer.length) return false

    return timingSafeEqual(expectedBuffer, signatureBuffer)
  } catch {
    return false
  }
}

/**
 * POST /api/izipay/webhook
 * Endpoint de respaldo para recibir notificaciones IPN de Izipay (server-to-server).
 * En el flujo principal de Web Core, la confirmación se hace vía /api/izipay/confirm.
 */
export async function POST(request: Request) {
  try {
    // 🔐 SEGURIDAD: Verificar firma HMAC antes de procesar cualquier dato
    const rawBody = await request.text()
    const signature = request.headers.get('x-izipay-hmac-sha256')

    if (!verifyIzipaySignature(rawBody, signature)) {
      console.warn('[WEBHOOK IZIPAY] Firma inválida rechazada. IP potencialmente maliciosa.')

      return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)

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

    if (pedido.estado === 'COMPLETADO') {
      return NextResponse.json({ message: 'Pedido ya completado' }, { status: 200 })
    }

    if (orderStatus === 'PAID') {
      const transaccion = transactions?.[0]
      const transaccionId = transaccion?.uuid

      await prisma.$transaction(async tx => {
        // Obtener pedido más reciente
        const currentPedido = await tx.pedido.findUnique({
          where: { id: pedido.id }
        })

        if (!currentPedido) throw new Error('Pedido no encontrado en webhook')

        await tx.pedido.update({
          where: { id: pedido.id },
          data: {
            estado: 'COMPLETADO',
            pagado_en: new Date(),
            transaccion_id: transaccionId,
            respuesta_izipay: body
          }
        })

        // Incrementar usos del cupón si existe
        if (currentPedido.cupon_id) {
          await tx.cupon.update({
            where: { id: currentPedido.cupon_id },
            data: { usos_actuales: { increment: 1 } }
          })
        }

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
