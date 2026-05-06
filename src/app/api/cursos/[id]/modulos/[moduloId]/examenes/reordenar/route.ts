import prisma from '@/utils/libs/prisma'
import { reordenarLeccionesSchema } from '@/schemas/leccion.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]/examenes/reordenar
 * Reordenar exámenes intermedios dentro de un módulo
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; moduloId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, moduloId } = params
    const body = await request.json()
    const validation = validateRequest(reordenarLeccionesSchema, body, request)

    if (!validation.success) return validation.error

    const modulo = await prisma.modulo.findFirst({ where: { id: moduloId, curso_id: cursoId } })

    if (!modulo) return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)

    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (auth.user.rol === 'PROFESOR' && curso?.profesor_id !== auth.user.id)
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)

    // Two-step update to avoid order collisions (defensive, mirrors lecciones pattern)
    await prisma.$transaction([
      ...validation.data.items.map((item: any, i: number) =>
        prisma.examen.update({ where: { id: item.id }, data: { orden: 10000 + i } })
      ),
      ...validation.data.items.map((item: any) =>
        prisma.examen.update({ where: { id: item.id }, data: { orden: item.orden } })
      )
    ])

    const examenes = await prisma.examen.findMany({
      where: { modulo_id: moduloId },
      orderBy: { orden: 'asc' }
    })

    return ApiResponse.success(request, { examenes })
  } catch (error) {
    return handleApiError(error, request)
  }
}
