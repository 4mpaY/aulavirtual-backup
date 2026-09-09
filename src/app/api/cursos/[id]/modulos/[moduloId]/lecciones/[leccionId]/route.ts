import prisma from '@/utils/libs/prisma'
import { actualizarLeccionSchema } from '@/schemas/leccion.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]/lecciones/[leccionId]
 * Actualizar una lección
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string; moduloId: string; leccionId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
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

    // Verificar propiedad del curso
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (user.rol === 'PROFESOR' && curso?.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    const { trabajo, ...restData } = validation.data

    const leccionActualizada = await prisma.$transaction(async (tx) => {
      const updated = await tx.leccion.update({
        where: { id: leccionId },
        data: restData
      })

      if (trabajo === null) {
        try {
          await tx.trabajo.delete({
            where: { leccion_id: leccionId }
          })
        } catch {
          // Ignorar si no existía
        }
      } else if (trabajo) {
        await tx.trabajo.upsert({
          where: { leccion_id: leccionId },
          create: {
            titulo: trabajo.titulo,
            descripcion: trabajo.descripcion || null,
            archivo_url: trabajo.archivo_url || null,
            archivo_nombre: trabajo.archivo_nombre || null,
            fecha_inicio: trabajo.fecha_inicio ? new Date(trabajo.fecha_inicio) : null,
            fecha_fin: trabajo.fecha_fin ? new Date(trabajo.fecha_fin) : null,
            leccion_id: leccionId
          },
          update: {
            titulo: trabajo.titulo,
            descripcion: trabajo.descripcion || null,
            archivo_url: trabajo.archivo_url || null,
            archivo_nombre: trabajo.archivo_nombre || null,
            fecha_inicio: trabajo.fecha_inicio ? new Date(trabajo.fecha_inicio) : null,
            fecha_fin: trabajo.fecha_fin ? new Date(trabajo.fecha_fin) : null,
          }
        })
      }

      return updated
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
  props: { params: Promise<{ id: string; moduloId: string; leccionId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
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

    // Verificar propiedad del curso
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (user.rol === 'PROFESOR' && curso?.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    await prisma.leccion.delete({
      where: { id: leccionId }
    })

    return ApiResponse.success(request, { message: 'Lección eliminada exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
