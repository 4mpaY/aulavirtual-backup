import { z } from 'zod'

import prisma from '@/utils/libs/prisma'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

const reordenarCursosSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        orden: z.number().int().min(0)
      })
    )
    .min(1)
})

/**
 * PATCH /api/cursos/reordenar
 * Reordenar cursos del profesor autenticado
 */
export async function PATCH(request: Request) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const body = await request.json()
    const validation = validateRequest(reordenarCursosSchema, body, request)

    if (!validation.success) return validation.error

    const { items } = validation.data

    // Si es PROFESOR, verificar que todos los cursos le pertenecen
    if (user.rol === 'PROFESOR') {
      const ids = items.map(i => i.id)

      const cursos = await prisma.curso.findMany({
        where: { id: { in: ids } },
        select: { id: true, profesor_id: true }
      })

      const ajeno = cursos.find(c => c.profesor_id !== user.id)

      if (ajeno) {
        return ApiResponse.error(request, 'No tienes permiso para reordenar uno o más de estos cursos', 403)
      }
    }

    await Promise.all(
      items.map(item =>
        prisma.curso.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    )

    return ApiResponse.success(request, { message: 'Cursos reordenados correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
