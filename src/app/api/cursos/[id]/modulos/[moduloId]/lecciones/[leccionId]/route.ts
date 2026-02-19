import prisma from '@/utils/libs/prisma'
import { actualizarLeccionSchema } from '@/schemas/leccion.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]/lecciones/[leccionId]
 * Actualizar una lección
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; moduloId: string; leccionId: string } }
) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: cursoId, moduloId, leccionId } = params
    const body = await request.json()

    const validation = validateRequest(actualizarLeccionSchema, body, request)
    if (!validation.success) return validation.error

    // Verificar que la lección existe y pertenece al módulo del curso
    const leccion = await prisma.leccion.findFirst({
      where: {
        id: leccionId,
        modulo_id: moduloId,
        modulo: { curso_id: cursoId }
      }
    })

    if (!leccion) {
      return ApiResponse.error(request, 'Lección no encontrada en este módulo', 404)
    }

    const leccionActualizada = await prisma.leccion.update({
      where: { id: leccionId },
      data: validation.data
    })

    return ApiResponse.success(request, { leccion: leccionActualizada })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/cursos/[id]/modulos/[moduloId]/lecciones/[leccionId]
 * Eliminar una lección
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduloId: string; leccionId: string } }
) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: cursoId, moduloId, leccionId } = params

    const leccion = await prisma.leccion.findFirst({
      where: {
        id: leccionId,
        modulo_id: moduloId,
        modulo: { curso_id: cursoId }
      }
    })

    if (!leccion) {
      return ApiResponse.error(request, 'Lección no encontrada en este módulo', 404)
    }

    await prisma.leccion.delete({
      where: { id: leccionId }
    })

    return ApiResponse.success(request, { message: 'Lección eliminada exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
