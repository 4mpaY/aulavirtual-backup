export const dynamic = 'force-dynamic'

import { revalidateTag } from 'next/cache'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/admin/escuelas/[id]
 * Detalle de una escuela
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const escuela = await prisma.escuela.findUnique({
      where: { id: params.id },
      include: {
        rutas: {
          select: { id: true, titulo: true, slug: true }
        }
      }
    })

    if (!escuela) return ApiResponse.error(request, 'Escuela no encontrada', 404)

    return ApiResponse.success(request, escuela)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PUT /api/admin/escuelas/[id]
 * Actualiza una escuela
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const { nombre, slug, descripcion, imagen, estado, orden } = await request.json()

    await prisma.escuela.update({
      where: { id: params.id },
      data: {
        nombre,
        slug,
        descripcion,
        imagen,
        estado,
        orden: Number(orden) || 0,
        actualizado_en: new Date()
      }
    })

    revalidateTag('web-escuelas')

    return ApiResponse.success(request, { message: 'Escuela actualizada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/admin/escuelas/[id]
 * Elimina una escuela
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    await prisma.escuela.delete({
      where: { id: params.id }
    })

    revalidateTag('web-escuelas')

    return ApiResponse.success(request, { message: 'Escuela eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
