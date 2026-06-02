import { NextResponse } from 'next/server'

import { culqi } from '@/lib/culqi'
import prisma from '@/utils/libs/prisma'

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

    if (tipo === 'charge.creation.succeeded') {
      // Renovación pagada: buscar suscripción por culqi_suscripcion_id en metadata
      const suscripcionCulqiId = objeto?.subscription_id ?? objeto?.metadata?.subscription_id

      if (suscripcionCulqiId) {
        const suscripcion = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: suscripcionCulqiId }
        })

        if (suscripcion) {
          const periodoFin = objeto?.next_billing_date
            ? new Date(objeto.next_billing_date * 1000)
            : null

          await prisma.$transaction([
            prisma.pagoSuscripcion.create({
              data: {
                suscripcion_id: suscripcion.id,
                monto: (objeto.amount ?? 0) / 100,
                moneda: objeto.currency_code ?? suscripcion.id,
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

    if (tipo === 'charge.creation.failed') {
      const suscripcionCulqiId = objeto?.subscription_id ?? objeto?.metadata?.subscription_id

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

          if (intentosFallidos >= 3) {
            await prisma.suscripcion.update({
              where: { id: suscripcion.id },
              data: { estado: 'VENCIDA' }
            })
          }
        }
      }
    }

    if (tipo === 'subscription.canceled') {
      const culqiSubId = objeto?.id

      if (culqiSubId) {
        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId, estado: { not: 'CANCELADA' } },
          data: { estado: 'CANCELADA', fecha_cancelacion: new Date() }
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[CULQI_WEBHOOK_ERROR]', error)

    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 })
  }
}
