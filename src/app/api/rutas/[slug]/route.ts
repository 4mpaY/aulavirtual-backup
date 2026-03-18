import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/rutas/[slug]
 * Detalle público de una ruta de aprendizaje por su slug
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const ruta = await prisma.rutaAprendizaje.findFirst({
      where: {
        slug: params.slug,
        esta_activo: true
      },
      include: {
        cursos: {
          orderBy: { orden: 'asc' },
          include: {
            curso: {
              include: {
                _count: {
                  select: { modulos: true }
                }
              }
            }
          }
        }
      }
    })

    if (!ruta) return ApiResponse.error(request, 'Ruta no encontrada', 404)

    const formattedCursos = ruta.cursos.map(rc => ({
      ...rc.curso,
      total_modulos: rc.curso._count.modulos,
      orden: rc.orden
    }))

    return ApiResponse.success(request, { ...ruta, cursos: formattedCursos })
  } catch (error) {
    return handleApiError(error, request)
  }
}
