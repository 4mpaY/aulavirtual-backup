import prisma from '@/utils/libs/prisma'
import { reordenarModulosSchema } from '@/schemas/modulo.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/reordenar
 * Reordenar módulos de un curso
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

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

    // Si es PROFESOR, solo puede reordenar si es el dueño
    if (user.rol === 'PROFESOR' && curso.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // Actualizar el orden en dos pasos dentro de una transacción para evitar conflictos con la restricción UNIQUE(curso_id, orden)
    await prisma.$transaction([
      // Paso 1: Mover a posiciones temporales fuera de rango para liberar los números
      ...validation.data.items.map((item, index) =>
        prisma.modulo.update({
          where: { id: item.id },
          data: { orden: 10000 + index }
        })
      ),

      // Paso 2: Asignar las posiciones reales finales
      ...validation.data.items.map(item =>
        prisma.modulo.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    ])

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
