export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError, validateRequest } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { crearPlanSchema, listarPlanesQuerySchema } from '@/schemas/plan-suscripcion.schema'
import { calcularCulqiIntervalo, culqiSuscripcion } from '@/utils/libs/culqi-suscripcion'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { searchParams } = new URL(request.url)
    const queryValidation = validateRequest(listarPlanesQuerySchema, Object.fromEntries(searchParams), request)

    if (!queryValidation.success) return queryValidation.error

    const { page, limit, buscar, esta_activo } = queryValidation.data
    const skip = (page - 1) * limit

    const where: any = {}

    if (esta_activo !== undefined) where.esta_activo = esta_activo
    if (buscar) where.nombre = { contains: buscar, mode: 'insensitive' }

    const [planes, total] = await Promise.all([
      prisma.planSuscripcion.findMany({
        where,
        skip,
        take: limit,
        include: {
          cursos: { include: { curso: { select: { id: true, titulo: true, estado: true } } } },
          _count: { select: { suscripciones: true, cursos: true } }
        },
        orderBy: { creado_en: 'desc' }
      }),
      prisma.planSuscripcion.count({ where })
    ])

    return ApiResponse.success(request, { planes, total })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const body = await request.json()
    const validation = validateRequest(crearPlanSchema, body, request)

    if (!validation.success) return validation.error

    const { cursoIds, ...planData } = validation.data
    const { culqi_interval_unit, culqi_interval_count } = calcularCulqiIntervalo(planData.intervalo)

    const plan = await prisma.planSuscripcion.create({
      data: {
        ...planData,
        precio: planData.precio,
        culqi_interval_unit,
        culqi_interval_count,
        cursos: {
          create: cursoIds.map(curso_id => ({ curso_id }))
        }
      },
      include: {
        cursos: { include: { curso: { select: { id: true, titulo: true, estado: true } } } },
        _count: { select: { suscripciones: true, cursos: true } }
      }
    })

    // Sincronizar con Culqi: crear el plan recurrente
    try {
      const shortName = `plan-${plan.id.slice(0, 8)}`
      const culqiPlan = await culqiSuscripcion.crearPlan({
        name: plan.nombre,
        short_name: shortName,
        description: plan.descripcion ?? undefined,
        amount: Math.round(Number(plan.precio) * 100),
        currency: plan.moneda,
        interval_unit_time: plan.culqi_interval_unit,
        interval_count: plan.culqi_interval_count,
        initial_cycles: { count: 0, amount: 0, has_initial_charge: false, interval_unit_time: plan.culqi_interval_unit },
        metadata: { plan_id: plan.id }
      })

      await prisma.planSuscripcion.update({
        where: { id: plan.id },
        data: { culqi_plan_id: culqiPlan.id, culqi_short_name: shortName }
      })

      plan.culqi_plan_id = culqiPlan.id
      plan.culqi_short_name = shortName
    } catch (culqiError: any) {
      console.error('Error sincronizando plan con Culqi:', culqiError?.message)
      // No fallar: el plan queda creado en DB, culqi_plan_id será null hasta sincronizar
    }

    return ApiResponse.success(request, { plan }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
