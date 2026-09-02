export const dynamic = 'force-dynamic'
export const revalidate = 0

import { revalidateTag } from 'next/cache'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * PATCH /api/admin/escuelas/reordenar
 * Reordena las escuelas
 */
export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { items } = await request.json()

    if (!Array.isArray(items) || items.length === 0) {
      return ApiResponse.error(request, 'Formato de datos inválido', 400)
    }

    await prisma.$transaction(
      items.map((item: { id: string; orden: number }) =>
        prisma.escuela.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    )

    revalidateTag('web-escuelas')

    return ApiResponse.success(request, { message: 'Escuelas reordenadas correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
