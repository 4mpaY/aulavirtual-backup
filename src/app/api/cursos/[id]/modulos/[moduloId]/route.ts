import prisma from '@/utils/libs/prisma'
import { actualizarModuloSchema } from '@/schemas/modulo.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]
 * Actualizar un módulo
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string; moduloId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { id: cursoId, moduloId } = params
    const body = await request.json()

    const validation = validateRequest(actualizarModuloSchema, body, request)

    if (!validation.success) return validation.error

    // Verificar que el módulo existe y pertenece al curso
    const modulo = await prisma.modulo.findFirst({
      where: { id: moduloId, curso_id: cursoId }
    })

    if (!modulo) {
      return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)
    }

    // Verificar propiedad del curso
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (user.rol === 'PROFESOR' && curso?.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    const moduloActualizado = await prisma.modulo.update({
      where: { id: moduloId },
      data: validation.data,
      include: {
        lecciones: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    return ApiResponse.success(request, { modulo: moduloActualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/cursos/[id]/modulos/[moduloId]
 * Eliminar un módulo y sus lecciones en cascada
 */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string; moduloId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { id: cursoId, moduloId } = params

    const modulo = await prisma.modulo.findFirst({
      where: { id: moduloId, curso_id: cursoId }
    })

    if (!modulo) {
      return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)
    }

    // Verificar propiedad del curso
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (user.rol === 'PROFESOR' && curso?.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // Eliminar en cascada (lecciones → contenidos se eliminan por Prisma cascade)
    await prisma.modulo.delete({
      where: { id: moduloId }
    })

    return ApiResponse.success(request, { message: 'Módulo eliminado exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
