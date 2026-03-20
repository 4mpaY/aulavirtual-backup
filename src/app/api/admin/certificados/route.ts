export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/admin/certificados
 * Listar todos los certificados emitidos (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    // Verificar que sea admin
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const buscar = searchParams.get('buscar') || ''

    const skip = (page - 1) * limit

    // Filtros
    const where: any = {}

    if (buscar) {
      where.OR = [
        {
          usuario: {
            OR: [
              { nombre: { contains: buscar, mode: 'insensitive' } },
              { apellido: { contains: buscar, mode: 'insensitive' } },
              { correo: { contains: buscar, mode: 'insensitive' } }
            ]
          }
        },
        {
          curso: {
            titulo: { contains: buscar, mode: 'insensitive' }
          }
        },
        {
          codigo_verificacion: { contains: buscar, mode: 'insensitive' }
        }
      ]
    }

    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        where,
        skip,
        take: limit,
        orderBy: { emitido_en: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              correo: true,
              avatar: true
            }
          },
          curso: {
            select: {
              id: true,
              titulo: true
            }
          }
        }
      }),
      prisma.certificado.count({ where })
    ])

    return ApiResponse.success(request, {
      certificados,
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
