import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/admin/rutas/[id]
 * Detalle de una ruta con sus cursos
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const ruta = await prisma.rutaAprendizaje.findUnique({
      where: { id: params.id },
      include: {
        cursos: {
          orderBy: { orden: 'asc' },
          include: {
            curso: {
              select: { id: true, titulo: true, miniatura: true }
            }
          }
        }
      }
    })

    if (!ruta) return ApiResponse.error(request, 'Ruta no encontrada', 404)

    // Formateamos los cursos para que tengan la estructura esperada: { id, titulo, miniatura, orden }
    const formattedCursos = ruta.cursos.map(rc => ({
      id: rc.curso.id,
      titulo: rc.curso.titulo,
      miniatura: rc.curso.miniatura,
      orden: rc.orden,
      seccion_id: rc.seccion_id
    }))

    return ApiResponse.success(request, { ...ruta, cursos: formattedCursos })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PUT /api/admin/rutas/[id]
 * Actualiza una ruta
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const { titulo, slug, descripcion, miniatura, beneficios, esta_activo } = await request.json()

    await prisma.rutaAprendizaje.update({
      where: { id: params.id },
      data: {
        titulo,
        slug,
        descripcion,
        miniatura,
        beneficios,
        esta_activo,
        actualizado_en: new Date()
      }
    })

    return ApiResponse.success(request, { message: 'Ruta actualizada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/admin/rutas/[id]
 * Elimina una ruta
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    await prisma.rutaAprendizaje.delete({
      where: { id: params.id }
    })

    return ApiResponse.success(request, { message: 'Ruta eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
