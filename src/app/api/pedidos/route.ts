export const dynamic = 'force-dynamic'

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

    const { page, limit, estado, buscar, nro_pedido, nombre, curso_id, fecha_inicio, fecha_fin } = validation.data

    const where: any = {}
    
    // Si el estado no es 'TODOS', aplicamos el filtro. 
    if (estado && estado !== 'TODOS') {
      where.estado = estado
    }

    if (nro_pedido) {
      const nro = parseInt(nro_pedido)

      if (!isNaN(nro)) {
        where.numero_pedido = nro
      }
    }

    if (nombre) {
      where.OR = [
        { usuario: { nombre: { contains: nombre, mode: 'insensitive' } } },
        { usuario: { apellido: { contains: nombre, mode: 'insensitive' } } },
        { usuario: { correo: { contains: nombre, mode: 'insensitive' } } }
      ]
    }

    if (buscar) {
      // Búsqueda general por transaccion_id o términos varios si no se especificaron filtros fijos
      if (!where.OR) {
        where.OR = [
          { usuario: { nombre: { contains: buscar, mode: 'insensitive' } } },
          { usuario: { apellido: { contains: buscar, mode: 'insensitive' } } },
          { usuario: { correo: { contains: buscar, mode: 'insensitive' } } },
          { transaccion_id: { contains: buscar } }
        ]
      }
    }

    if (curso_id) {
      where.detalles = { some: { curso_id } }
    }

    if (fecha_inicio || fecha_fin) {
      where.creado_en = {}
      if (fecha_inicio) where.creado_en.gte = new Date(`${fecha_inicio}T00:00:00`)
      if (fecha_fin) where.creado_en.lte = new Date(`${fecha_fin}T23:59:59.999`)
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
          cupon: {
            select: {
              codigo: true
            }
          },
          detalles: {
            include: {
              curso: {
                select: {
                  titulo: true
                }
              },
              ebook: {
                select: {
                  titulo: true,
                  miniatura: true
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
