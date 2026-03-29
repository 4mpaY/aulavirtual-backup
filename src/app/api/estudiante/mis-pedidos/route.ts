export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * GET /api/estudiante/mis-pedidos
 * Listar todos los pedidos del usuario autenticado
 */
export async function GET(request: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return ApiResponse.error(request, 'No autorizado', 401)
    }

    const { searchParams } = new URL(request.url)
    const rawPage = searchParams.get('page')
    const rawLimit = searchParams.get('limit')
    
    const page = rawPage ? parseInt(rawPage) : 1
    const limit = rawLimit ? parseInt(rawLimit) : 10
    const skip = (page - 1) * limit

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where: {
          usuario_id: session.user.id
        },
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        include: {
          cupon: {
            select: { codigo: true }
          },
          detalles: {
            include: {
              curso: {
                select: { titulo: true }
              }
            }
          }
        }
      }),
      prisma.pedido.count({
        where: { usuario_id: session.user.id }
      })
    ])

    return ApiResponse.success(request, {
      pedidos,
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
