export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/escuelas/[slug]
 * Retorna los detalles de la escuela y sus rutas de aprendizaje activas
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const escuela = await prisma.escuela.findUnique({
      where: { slug: params.slug },
      include: {
        rutas: {
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
                    precio_oferta: true,
                    moneda: true,
                    es_gratis: true
                  }
                }
              }
            },
            _count: {
              select: { cursos: true }
            }
          }
        }
      }
    })

    if (!escuela) {
      return ApiResponse.error(request, 'Escuela no encontrada', 404)
    }

    const formattedRutas = escuela.rutas.map(ruta => ({
      ...ruta,
      total_cursos: ruta._count.cursos,
      cursos: ruta.cursos.map(rc => rc.curso)
    }))

    return ApiResponse.success(request, {
      ...escuela,
      rutas: formattedRutas
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
