export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { culqiSuscripcion, mapearEstadoCulqi } from '@/utils/libs/culqi-suscripcion'
import { enviarEmailRenovacion } from '@/utils/libs/suscripcion-emails'

const CRON_SECRET = process.env.CRON_SECRET

/**
 * POST /api/admin/suscripciones/sync
 *
 * Consulta Culqi por cada suscripción activa y detecta nuevos pagos comparando
 * next_billing_date. Puede ser llamado:
 *   - Manualmente desde el panel admin (con sesión de admin)
 *   - Por un cron externo enviando el header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: Request) {
  try {
    // Acepta autenticación de admin (sesión) O cron secret (header)
    const authHeader = request.headers.get('authorization') ?? ''
    const esCron = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`

    if (!esCron) {
      const auth = await requireAuth(request)

      if (!auth.authorized || auth.user.rol !== 'ADMIN') {
        return ApiResponse.error(request, 'No autorizado', 403)
      }
    }

    const suscripciones = await prisma.suscripcion.findMany({
      where: {
        culqi_suscripcion_id: { not: null },
        estado: { in: ['ACTIVA', 'PENDIENTE', 'EN_PRUEBA'] }
      },
      include: {
        plan: { select: { nombre: true, precio: true, moneda: true, intervalo: true } },
        usuario: { select: { nombre: true, apellido: true, correo: true } }
      }
    })

    const resultado = {
      revisadas: suscripciones.length,
      pagosNuevos: 0,
      estadosActualizados: 0,
      errores: 0
    }

    for (const sub of suscripciones) {
      try {
        const culqiSub = await culqiSuscripcion.consultarSuscripcion(sub.culqi_suscripcion_id!)

        const nuevoEstado = mapearEstadoCulqi(culqiSub.status ?? 1)
        const nuevaFecha = culqiSub.next_billing_date
          ? new Date(Number(culqiSub.next_billing_date) * 1000)
          : null

        // Detectar nuevo pago: la fecha de próximo cobro en Culqi avanzó
        const fechaDbMs = sub.fecha_proximo_cobro?.getTime() ?? 0
        const fechaCulqiMs = nuevaFecha?.getTime() ?? 0
        const hayNuevoPago = nuevaFecha !== null && fechaCulqiMs > fechaDbMs

        if (hayNuevoPago) {
          // Idempotencia: no crear si ya existe un pago en ese período
          const yaRegistrado = await prisma.pagoSuscripcion.findFirst({
            where: {
              suscripcion_id: sub.id,
              periodo_fin: nuevaFecha
            }
          })

          if (!yaRegistrado) {
            await prisma.pagoSuscripcion.create({
              data: {
                suscripcion_id: sub.id,
                monto: sub.plan.precio,
                moneda: sub.plan.moneda,
                estado: 'COMPLETADO',
                periodo_inicio: sub.fecha_proximo_cobro ?? new Date(),
                periodo_fin: nuevaFecha
              }
            })

            enviarEmailRenovacion({
              nombreUsuario: `${sub.usuario.nombre} ${sub.usuario.apellido ?? ''}`.trim(),
              correoUsuario: sub.usuario.correo,
              nombrePlan: sub.plan.nombre,
              precio: Number(sub.plan.precio),
              moneda: sub.plan.moneda,
              intervalo: sub.plan.intervalo,
              fechaProximoCobro: nuevaFecha
            }).catch(e => console.error('[SYNC] Email renovación:', e))

            resultado.pagosNuevos++
          }
        }

        // Sincronizar estado y fecha si cambiaron
        const cambios: Record<string, any> = {}

        if (nuevoEstado !== sub.estado) cambios.estado = nuevoEstado
        if (nuevaFecha && fechaCulqiMs !== fechaDbMs) cambios.fecha_proximo_cobro = nuevaFecha
        if (nuevoEstado === 'CANCELADA' && !sub.fecha_cancelacion) {
          cambios.fecha_cancelacion = new Date()
        }

        if (Object.keys(cambios).length > 0) {
          await prisma.suscripcion.update({ where: { id: sub.id }, data: cambios })
          resultado.estadosActualizados++
        }
      } catch (err: any) {
        console.error(`[SYNC] Error en suscripción ${sub.id}:`, err?.message)
        resultado.errores++
      }
    }

    console.log('[SYNC] Resultado:', resultado)

    return ApiResponse.success(request, resultado)
  } catch (error) {
    return handleApiError(error, request)
  }
}
