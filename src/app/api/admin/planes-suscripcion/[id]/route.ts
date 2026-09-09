export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError, validateRequest } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { actualizarPlanSchema } from '@/schemas/plan-suscripcion.schema'
import { calcularCulqiIntervalo, culqiSuscripcion } from '@/utils/libs/culqi-suscripcion'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos', 403)
    }

    const plan = await prisma.planSuscripcion.findUnique({
      where: { id: params.id },
      include: {
        cursos: { include: { curso: { select: { id: true, titulo: true, estado: true } } } },
        _count: { select: { suscripciones: true, cursos: true } }
      }
    })

    if (!plan) return ApiResponse.error(request, 'Plan no encontrado', 404)

    return ApiResponse.success(request, { plan })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos', 403)
    }

    const plan = await prisma.planSuscripcion.findUnique({ where: { id: params.id } })

    if (!plan) return ApiResponse.error(request, 'Plan no encontrado', 404)

    const body = await request.json()
    const validation = validateRequest(actualizarPlanSchema, body, request)

    if (!validation.success) return validation.error

    const { cursoIds, intervalo, ...rest } = validation.data

    const updateData: any = { ...rest }

    if (intervalo) {
      const { culqi_interval_unit, culqi_interval_count } = calcularCulqiIntervalo(intervalo)

      updateData.intervalo = intervalo
      updateData.culqi_interval_unit = culqi_interval_unit
      updateData.culqi_interval_count = culqi_interval_count
    }

    const planActualizado = await prisma.$transaction(async tx => {
      if (cursoIds !== undefined) {
        await tx.cursoEnPlan.deleteMany({ where: { plan_id: params.id } })
        await tx.cursoEnPlan.createMany({
          data: cursoIds.map(curso_id => ({ plan_id: params.id, curso_id }))
        })
      }

      return tx.planSuscripcion.update({
        where: { id: params.id },
        data: updateData,
        include: {
          cursos: { include: { curso: { select: { id: true, titulo: true, estado: true } } } },
          _count: { select: { suscripciones: true, cursos: true } }
        }
      })
    })

    // Sincronizar con Culqi: nombre, descripción y estado (precio/intervalo no se pueden cambiar en Culqi)
    if (planActualizado.culqi_plan_id) {
      const culqiUpdate: Record<string, any> = {}

      if (rest.nombre !== undefined) culqiUpdate.name = planActualizado.nombre
      if (rest.descripcion !== undefined) culqiUpdate.description = planActualizado.descripcion || planActualizado.nombre
      if (rest.esta_activo !== undefined) culqiUpdate.status = planActualizado.esta_activo ? 1 : 2

      if (Object.keys(culqiUpdate).length > 0) {
        try {
          await culqiSuscripcion.actualizarPlan(planActualizado.culqi_plan_id, culqiUpdate)
        } catch (culqiError: any) {
          console.error('Error actualizando plan en Culqi:', culqiError?.message)
        }
      }
    }

    return ApiResponse.success(request, { plan: planActualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos', 403)
    }

    const plan = await prisma.planSuscripcion.findUnique({
      where: { id: params.id },
      include: { _count: { select: { suscripciones: true } } }
    })

    if (!plan) return ApiResponse.error(request, 'Plan no encontrado', 404)

    if (plan._count.suscripciones > 0) {
      return ApiResponse.error(
        request,
        `No se puede eliminar: existen ${plan._count.suscripciones} suscripción(es) asociadas`,
        409
      )
    }

    // Eliminar plan en Culqi antes de borrar en DB
    if (plan.culqi_plan_id) {
      try {
        await culqiSuscripcion.eliminarPlan(plan.culqi_plan_id)
      } catch (culqiError: any) {
        console.error('Error eliminando plan en Culqi:', culqiError?.message)
      }
    }

    await prisma.planSuscripcion.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Plan eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
