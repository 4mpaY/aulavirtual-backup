export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { listarReclamacionesQuerySchema } from '@/schemas/reclamacion.schema'

/**
 * GET /api/reclamaciones
 * Listar todas las reclamaciones (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    const validation = validateRequest(listarReclamacionesQuerySchema, query, request)

    if (!validation.success) {
      return validation.error
    }

    const { page, limit, estado, buscar } = validation.data

    const where: any = {}

    if (estado && estado !== 'TODOS') {
      where.estado = estado
    }

    if (buscar) {
      const idNumber = parseInt(buscar)
      
      if (!isNaN(idNumber)) {
        where.numero_correlativo = idNumber
      } else {
        where.OR = [
          { nombre: { contains: buscar, mode: 'insensitive' } },
          { email: { contains: buscar, mode: 'insensitive' } },
          { numero_documento: { contains: buscar } },
          { pedido: { contains: buscar, mode: 'insensitive' } }
        ]
      }
    }

    const skip = (page - 1) * limit

    const [reclamaciones, total] = await Promise.all([
      prisma.reclamacion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' }
      }),
      prisma.reclamacion.count({ where })
    ])

    return ApiResponse.success(request, {
      reclamaciones,
      paginacion: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
