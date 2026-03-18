import prisma from '@/utils/libs/prisma'
import { reordenarLeccionesSchema } from '@/schemas/leccion.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]/lecciones/reordenar
 * Reordenar lecciones dentro de un módulo
 */
export async function PATCH(request: Request, { params }: { params: { id: string; moduloId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const { id: cursoId, moduloId } = params
    const body = await request.json()

    const validation = validateRequest(reordenarLeccionesSchema, body, request)

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

    // Actualizar el orden de cada lección en una transacción
    await prisma.$transaction(
      validation.data.items.map(item =>
        prisma.leccion.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    )

    // Retornar las lecciones actualizadas
    const lecciones = await prisma.leccion.findMany({
      where: { modulo_id: moduloId },
      orderBy: { orden: 'asc' }
    })

    return ApiResponse.success(request, { lecciones })
  } catch (error) {
    return handleApiError(error, request)
  }
}
