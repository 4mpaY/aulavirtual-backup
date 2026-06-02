import { NextResponse } from 'next/server'

import { culqi } from '@/lib/culqi'
import prisma from '@/utils/libs/prisma'
import { mapearEstadoCulqi } from '@/utils/libs/culqi-suscripcion'

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('x-culqi-signature') ?? ''

    if (!culqi.verificarFirma(payload, signature)) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    const tipo: string = event?.type ?? ''
    const objeto = event?.data?.object ?? {}

    console.log('[CULQI_WEBHOOK] Evento recibido:', tipo)

    // Renovación exitosa: cargo generado por la suscripción
    if (tipo === 'charge.creation.succeeded') {
      const suscripcionCulqiId = objeto?.subscription_id

      if (suscripcionCulqiId) {
        const suscripcion = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: suscripcionCulqiId }
        })

        if (suscripcion) {
          const periodoFin = objeto?.next_billing_date
            ? new Date(Number(objeto.next_billing_date) * 1000)
            : null

          await prisma.$transaction([
            prisma.pagoSuscripcion.create({
              data: {
                suscripcion_id: suscripcion.id,
                monto: (objeto.amount ?? 0) / 100,
                moneda: objeto.currency_code ?? 'PEN',
                estado: 'COMPLETADO',
                culqi_cargo_id: objeto.id ?? null,
                periodo_inicio: new Date(),
                periodo_fin: periodoFin
              }
            }),
            prisma.suscripcion.update({
              where: { id: suscripcion.id },
              data: { estado: 'ACTIVA', fecha_proximo_cobro: periodoFin }
            })
          ])
        }
      }
    }

    // Cargo fallido en renovación
    if (tipo === 'charge.creation.failed') {
      const suscripcionCulqiId = objeto?.subscription_id

      if (suscripcionCulqiId) {
        const suscripcion = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: suscripcionCulqiId },
          include: { _count: { select: { pagos: { where: { estado: 'FALLIDO' } } } } }
        })

        if (suscripcion) {
          const intentosFallidos = suscripcion._count.pagos + 1

          await prisma.pagoSuscripcion.create({
            data: {
              suscripcion_id: suscripcion.id,
              monto: (objeto.amount ?? 0) / 100,
              moneda: objeto.currency_code ?? 'PEN',
              estado: 'FALLIDO',
              culqi_cargo_id: objeto.id ?? null,
              intentos: intentosFallidos
            }
          })

          // Culqi marca como Finalizada (status 6) después de reintentos agotados
          if (intentosFallidos >= 3) {
            await prisma.suscripcion.update({
              where: { id: suscripcion.id },
              data: { estado: 'VENCIDA' }
            })
          }
        }
      }
    }

    // Suscripción cancelada desde Culqi o por agotamiento de intentos
    if (tipo === 'subscription.canceled') {
      const culqiSubId = objeto?.id

      if (culqiSubId) {
        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId, estado: { not: 'CANCELADA' } },
          data: { estado: 'CANCELADA', fecha_cancelacion: new Date() }
        })
      }
    }

    // Cambio de estado general en la suscripción (status actualizado desde Culqi)
    if (tipo === 'subscription.update') {
      const culqiSubId = objeto?.id
      const culqiStatus = objeto?.status

      if (culqiSubId && culqiStatus) {
        const estadoNuevo = mapearEstadoCulqi(culqiStatus)
        const fechaProximo = objeto?.next_billing_date
          ? new Date(Number(objeto.next_billing_date) * 1000)
          : undefined

        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId },
          data: {
            estado: estadoNuevo,
            ...(fechaProximo && { fecha_proximo_cobro: fechaProximo })
          }
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[CULQI_WEBHOOK_ERROR]', error)

    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 })
  }
}
