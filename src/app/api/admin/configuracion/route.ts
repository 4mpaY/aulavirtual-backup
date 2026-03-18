import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/admin/configuracion
 * Obtiene todas las configuraciones del sistema
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const configuraciones = await prisma.configuracion.findMany({
      orderBy: { clave: 'asc' }
    })

    return ApiResponse.success(request, configuraciones)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/configuracion
 * Actualiza o crea configuraciones
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { configuraciones } = await request.json()

    if (!Array.isArray(configuraciones)) {
      return ApiResponse.error(request, 'Datos inválidos', 400)
    }

    // Actualizar en lote usando upsert de Prisma
    for (const conf of configuraciones) {
      await prisma.configuracion.upsert({
        where: { clave: conf.clave },
        update: {
          valor: conf.valor,
          descripcion: conf.descripcion
        },
        create: {
          clave: conf.clave,
          valor: conf.valor,
          descripcion: conf.descripcion
        }
      })
    }

    return ApiResponse.success(request, { message: 'Configuraciones actualizadas' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
