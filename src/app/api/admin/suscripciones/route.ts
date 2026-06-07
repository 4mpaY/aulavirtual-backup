export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos', 403)
    }

    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') ?? undefined
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit

    const where: any = {}

    if (estado) where.estado = estado

    const [suscripciones, total] = await Promise.all([
      prisma.suscripcion.findMany({
        where,
        skip,
        take: limit,
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true, correo: true } },
          plan: { select: { id: true, nombre: true, precio: true, moneda: true, intervalo: true } },
          _count: { select: { pagos: true } }
        },
        orderBy: { creado_en: 'desc' }
      }),
      prisma.suscripcion.count({ where })
    ])

    return ApiResponse.success(request, { suscripciones, total })
  } catch (error) {
    return handleApiError(error, request)
  }
}
