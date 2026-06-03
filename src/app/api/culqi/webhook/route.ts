import { NextResponse } from 'next/server'

import { culqi } from '@/lib/culqi'
import prisma from '@/utils/libs/prisma'
import { mapearEstadoCulqi } from '@/utils/libs/culqi-suscripcion'
import {
  enviarEmailRenovacion,
  enviarEmailCobroFallido,
  enviarEmailSuscripcionCancelada
} from '@/utils/libs/suscripcion-emails'

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

    // ── charge.creation.succeeded ───────────────────────────────────────────────
    // Cargo genérico con subscription_id → registra PagoSuscripcion + actualiza estado
    if (tipo === 'charge.creation.succeeded') {
      const suscripcionCulqiId = objeto?.subscription_id
      const cargoId = objeto?.id

      if (suscripcionCulqiId && cargoId) {
        // Idempotencia: ignorar si este cargo ya fue registrado
        const yaExiste = await prisma.pagoSuscripcion.findUnique({ where: { culqi_cargo_id: cargoId } })
        if (yaExiste) return NextResponse.json({ ok: true })

        const suscripcion = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: suscripcionCulqiId }
        })

        if (suscripcion) {
          const periodoFin = objeto?.next_billing_date
            ? new Date(Number(objeto.next_billing_date) * 1000)
            : null

          const [, suscripcionActualizada] = await prisma.$transaction([
            prisma.pagoSuscripcion.create({
              data: {
                suscripcion_id: suscripcion.id,
                monto: (objeto.amount ?? 0) / 100,
                moneda: objeto.currency_code ?? 'PEN',
                estado: 'COMPLETADO',
                culqi_cargo_id: cargoId,
                periodo_inicio: new Date(),
                periodo_fin: periodoFin
              }
            }),
            prisma.suscripcion.update({
              where: { id: suscripcion.id },
              data: { estado: 'ACTIVA', fecha_proximo_cobro: periodoFin },
              include: { plan: true, usuario: { select: { nombre: true, apellido: true, correo: true } } }
            })
          ])

          enviarEmailRenovacion({
            nombreUsuario: `${suscripcionActualizada.usuario.nombre} ${suscripcionActualizada.usuario.apellido ?? ''}`.trim(),
            correoUsuario: suscripcionActualizada.usuario.correo,
            nombrePlan: suscripcionActualizada.plan.nombre,
            precio: Number(suscripcionActualizada.plan.precio),
            moneda: suscripcionActualizada.plan.moneda,
            intervalo: suscripcionActualizada.plan.intervalo,
            fechaProximoCobro: periodoFin
          }).catch(e => console.error('Email renovación:', e))
        }
      }
    }

    // ── charge.creation.failed ──────────────────────────────────────────────────
    // Cargo genérico fallido con subscription_id → registra PagoSuscripcion fallido
    if (tipo === 'charge.creation.failed') {
      const suscripcionCulqiId = objeto?.subscription_id
      const cargoId = objeto?.id

      if (suscripcionCulqiId) {
        // Idempotencia: ignorar si este cargo fallido ya fue registrado
        if (cargoId) {
          const yaExiste = await prisma.pagoSuscripcion.findUnique({ where: { culqi_cargo_id: cargoId } })
          if (yaExiste) return NextResponse.json({ ok: true })
        }

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
              culqi_cargo_id: cargoId ?? null,
              intentos: intentosFallidos
            }
          })

          if (intentosFallidos >= 3) {
            await prisma.suscripcion.update({
              where: { id: suscripcion.id },
              data: { estado: 'VENCIDA' }
            })
          }

          const sub = await prisma.suscripcion.findUnique({
            where: { id: suscripcion.id },
            include: { plan: true, usuario: { select: { nombre: true, apellido: true, correo: true } } }
          })

          if (sub) {
            enviarEmailCobroFallido({
              nombreUsuario: `${sub.usuario.nombre} ${sub.usuario.apellido ?? ''}`.trim(),
              correoUsuario: sub.usuario.correo,
              nombrePlan: sub.plan.nombre,
              precio: Number(sub.plan.precio),
              moneda: sub.plan.moneda,
              intervalo: sub.plan.intervalo,
              intentos: intentosFallidos
            }).catch(e => console.error('Email cobro fallido:', e))
          }
        }
      }
    }

    // ── subscription.charge.succeeded ───────────────────────────────────────────
    // Evento específico de cargo exitoso de suscripción → sincroniza estado
    if (tipo === 'subscription.charge.succeeded') {
      const culqiSubId = objeto?.id
      if (culqiSubId) {
        const fechaProximo = objeto?.next_billing_date
          ? new Date(Number(objeto.next_billing_date) * 1000)
          : undefined

        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId },
          data: {
            estado: 'ACTIVA',
            ...(fechaProximo && { fecha_proximo_cobro: fechaProximo })
          }
        })
      }
    }

    // ── subscription.charge.failed ──────────────────────────────────────────────
    // Evento específico de cargo fallido de suscripción → cancela si supera 3 intentos
    if (tipo === 'subscription.charge.failed') {
      const culqiSubId = objeto?.id
      if (culqiSubId) {
        const suscripcion = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: culqiSubId },
          include: { _count: { select: { pagos: { where: { estado: 'FALLIDO' } } } } }
        })

        if (suscripcion && suscripcion._count.pagos >= 3) {
          await prisma.suscripcion.update({
            where: { id: suscripcion.id },
            data: { estado: 'VENCIDA' }
          })
        }
      }
    }

    // ── subscription.cancel.succeeded ───────────────────────────────────────────
    // Suscripción cancelada exitosamente en Culqi → sincroniza estado y envía email
    if (tipo === 'subscription.cancel.succeeded') {
      const culqiSubId = objeto?.id

      if (culqiSubId) {
        const sub = await prisma.suscripcion.findFirst({
          where: { culqi_suscripcion_id: culqiSubId, estado: { not: 'CANCELADA' } },
          include: { plan: true, usuario: { select: { nombre: true, apellido: true, correo: true } } }
        })

        if (sub) {
          await prisma.suscripcion.update({
            where: { id: sub.id },
            data: { estado: 'CANCELADA', fecha_cancelacion: new Date() }
          })

          enviarEmailSuscripcionCancelada({
            nombreUsuario: `${sub.usuario.nombre} ${sub.usuario.apellido ?? ''}`.trim(),
            correoUsuario: sub.usuario.correo,
            nombrePlan: sub.plan.nombre,
            precio: Number(sub.plan.precio),
            moneda: sub.plan.moneda,
            intervalo: sub.plan.intervalo
          }).catch(e => console.error('Email cancelación:', e))
        }
      }
    }

    // ── subscription.trial.end ──────────────────────────────────────────────────
    // Período de prueba finalizado → activa la suscripción
    if (tipo === 'subscription.trial.end') {
      const culqiSubId = objeto?.id
      if (culqiSubId) {
        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId, estado: 'EN_PRUEBA' },
          data: { estado: 'ACTIVA' }
        })
      }
    }

    // ── subscription.creation.succeeded ────────────────────────────────────────
    // Culqi confirmó la creación de la suscripción → actualiza estado desde PENDIENTE
    if (tipo === 'subscription.creation.succeeded') {
      const culqiSubId = objeto?.id
      const culqiStatus = objeto?.status

      if (culqiSubId && culqiStatus) {
        const estadoNuevo = mapearEstadoCulqi(culqiStatus)
        const fechaProximo = objeto?.next_billing_date
          ? new Date(Number(objeto.next_billing_date) * 1000)
          : undefined

        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId, estado: 'PENDIENTE' },
          data: {
            estado: estadoNuevo,
            ...(fechaProximo && { fecha_proximo_cobro: fechaProximo })
          }
        })
      }
    }

    // ── subscription.creation.failed ────────────────────────────────────────────
    // Culqi no pudo crear la suscripción → marca como cancelada
    if (tipo === 'subscription.creation.failed') {
      const culqiSubId = objeto?.id
      if (culqiSubId) {
        await prisma.suscripcion.updateMany({
          where: { culqi_suscripcion_id: culqiSubId },
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
