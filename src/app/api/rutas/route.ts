export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/rutas
 * Lista todas las rutas de aprendizaje activas para el público
 */
export async function GET(request: Request) {
  try {
    const rutas = await prisma.rutaAprendizaje.findMany({
      where: { esta_activo: true },
      include: {
        cursos: {
          orderBy: { orden: 'asc' },
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                miniatura: true,
                slug: true,
                precio: true,
                moneda: true,
                es_gratis: true
              }
            }
          }
        },
        _count: {
          select: { cursos: true }
        }
      },
      orderBy: { creado_en: 'desc' }
    })

    const formattedRutas = rutas.map(ruta => ({
      ...ruta,
      total_cursos: ruta._count.cursos,
      cursos: ruta.cursos.map(rc => rc.curso)
    }))

    return ApiResponse.success(request, formattedRutas)
  } catch (error) {
    return handleApiError(error, request)
  }
}
