import prisma from '@/utils/libs/prisma'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { listarPedidosQuerySchema } from '@/schemas/pedido.schema'

/**
 * GET /api/pedidos
 * Listar todos los pedidos (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    const validation = validateRequest(listarPedidosQuerySchema, query, request)

    if (!validation.success) {
      return validation.error
    }

    const { page, limit, estado, buscar } = validation.data

    const where: any = {}

    if (estado) {
      where.estado = estado
    }

    if (buscar) {
      where.OR = [
        { usuario: { nombre: { contains: buscar, mode: 'insensitive' } } },
        { usuario: { apellido: { contains: buscar, mode: 'insensitive' } } },
        { usuario: { correo: { contains: buscar, mode: 'insensitive' } } },
        { transaccion_id: { contains: buscar } }
      ]
    }

    const skip = (page - 1) * limit

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              correo: true
            }
          },
          detalles: {
            include: {
              curso: {
                select: {
                  titulo: true
                }
              }
            }
          }
        }
      }),
      prisma.pedido.count({ where })
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
