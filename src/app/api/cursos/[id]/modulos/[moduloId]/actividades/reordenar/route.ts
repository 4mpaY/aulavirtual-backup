export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * PATCH /api/cursos/[id]/modulos/[moduloId]/actividades/reordenar
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string; moduloId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, moduloId } = params
    const { items } = await request.json()

    const modulo = await prisma.modulo.findFirst({
      where: { id: moduloId, curso_id: cursoId }
    })

    if (!modulo) {
      return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)
    }

    await Promise.all(
      items.map(({ id, orden }: { id: string; orden: number }) =>
        prisma.actividad.update({ where: { id }, data: { orden } })
      )
    )

    return ApiResponse.success(request, { message: 'Actividades reordenadas' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
