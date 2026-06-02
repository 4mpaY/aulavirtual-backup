export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { culqiSuscripcion, mapearEstadoCulqi } from '@/utils/libs/culqi-suscripcion'

/**
 * GET /api/estudiante/suscripciones
 * Devuelve la suscripción activa del usuario autenticado (con plan y pagos)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const suscripcion = await prisma.suscripcion.findFirst({
      where: {
        usuario_id: auth.user.id,
        estado: { in: ['ACTIVA', 'EN_PRUEBA', 'PENDIENTE'] }
      },
      include: {
        plan: {
          include: {
            cursos: {
              include: { curso: { select: { id: true, titulo: true, miniatura: true } } }
            }
          }
        },
        pagos: {
          orderBy: { creado_en: 'desc' },
          take: 5
        }
      }
    })

    return ApiResponse.success(request, { suscripcion })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/estudiante/suscripciones
 * Crea una suscripción: Customer → Card → Subscription en Culqi + registro en DB
 * Body: { planId, tokenId, email }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { planId, tokenId } = await request.json()

    if (!planId || !tokenId) {
      return ApiResponse.error(request, 'planId y tokenId son requeridos', 400)
    }

    // Verificar que el plan existe y está activo
    const plan = await prisma.planSuscripcion.findUnique({
      where: { id: planId, esta_activo: true }
    })

    if (!plan) return ApiResponse.error(request, 'Plan no encontrado o inactivo', 404)
    if (!plan.culqi_plan_id) {
      return ApiResponse.error(request, 'El plan no está sincronizado con el procesador de pagos', 422)
    }

    // Verificar que no tenga ya una suscripción activa a este plan
    const suscripcionExistente = await prisma.suscripcion.findFirst({
      where: {
        usuario_id: auth.user.id,
        plan_id: planId,
        estado: { in: ['ACTIVA', 'EN_PRUEBA'] }
      }
    })

    if (suscripcionExistente) {
      return ApiResponse.error(request, 'Ya tienes una suscripción activa a este plan', 409)
    }

    // Obtener datos completos del usuario para Culqi
    const usuarioDb = await prisma.usuario.findUnique({
      where: { id: auth.user.id },
      select: { nombre: true, apellido: true, correo: true, celular: true }
    })

    // Paso 1: Crear cliente en Culqi
    const cliente = await culqiSuscripcion.crearCliente({
      first_name: usuarioDb?.nombre ?? 'Cliente',
      last_name: usuarioDb?.apellido ?? '',
      email: usuarioDb?.correo ?? (auth.user.email ?? ''),
      address: 'Lima, Perú',
      phone_number: usuarioDb?.celular ?? '999999999'
    })

    // Paso 2: Asociar token de tarjeta al cliente
    const tarjeta = await culqiSuscripcion.crearTarjeta({
      customer_id: cliente.id,
      token_id: tokenId
    })

    // Paso 3: Crear suscripción recurrente en Culqi
    // La respuesta de create solo devuelve { id, customer_id, plan_id, status, created_at }
    const culqiSubCreada = await culqiSuscripcion.crearSuscripcion({
      card_id: tarjeta.id,
      plan_id: plan.culqi_plan_id,
      tyc: true,
      metadata: { usuario_id: auth.user.id, plan_id: planId }
    })

    // Paso 4: Consultar suscripción para obtener next_billing_date y status completo
    let culqiSub = culqiSubCreada
    try {
      culqiSub = await culqiSuscripcion.consultarSuscripcion(culqiSubCreada.id)
    } catch {
      // Si falla el GET, usamos la respuesta del create
    }

    const estadoInicial = mapearEstadoCulqi(culqiSub.status ?? culqiSubCreada.status ?? 1)
    const fechaProximoCobro = culqiSub.next_billing_date
      ? new Date(culqiSub.next_billing_date * 1000)
      : null

    const suscripcion = await prisma.$transaction(async tx => {
      const sub = await tx.suscripcion.create({
        data: {
          usuario_id: auth.user.id,
          plan_id: planId,
          estado: estadoInicial,
          culqi_suscripcion_id: culqiSubCreada.id,
          culqi_customer_id: cliente.id,
          culqi_card_id: tarjeta.id,
          fecha_inicio: new Date(),
          fecha_proximo_cobro: fechaProximoCobro
        },
        include: {
          plan: {
            include: {
              cursos: { include: { curso: { select: { id: true, titulo: true } } } }
            }
          }
        }
      })

      // Registrar el primer período (estado según Culqi)
      await tx.pagoSuscripcion.create({
        data: {
          suscripcion_id: sub.id,
          monto: plan.precio,
          moneda: plan.moneda,
          estado: estadoInicial === 'ACTIVA' ? 'COMPLETADO' : 'PENDIENTE',
          periodo_inicio: new Date(),
          periodo_fin: fechaProximoCobro
        }
      })

      return sub
    })

    return ApiResponse.success(request, { suscripcion }, 201)
  } catch (error: any) {
    return handleApiError(error, request)
  }
}
