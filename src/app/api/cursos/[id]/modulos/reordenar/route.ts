import prisma from '@/utils/libs/prisma'
import { reordenarModulosSchema } from '@/schemas/modulo.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/reordenar
 * Reordenar módulos de un curso
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: cursoId } = params
    const body = await request.json()

    const validation = validateRequest(reordenarModulosSchema, body, request)
    if (!validation.success) return validation.error

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // Actualizar el orden de cada módulo en una transacción
    await prisma.$transaction(
      validation.data.items.map(item =>
        prisma.modulo.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    )

    // Retornar los módulos actualizados
    const modulos = await prisma.modulo.findMany({
      where: { curso_id: cursoId },
      orderBy: { orden: 'asc' },
      include: {
        lecciones: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    return ApiResponse.success(request, { modulos })
  } catch (error) {
    return handleApiError(error, request)
  }
}
