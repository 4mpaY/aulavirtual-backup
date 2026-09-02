export const dynamic = 'force-dynamic'
export const revalidate = 0

import { revalidateTag } from 'next/cache'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/admin/escuelas
 * Lista todas las escuelas (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const escuelas = await prisma.escuela.findMany({
      orderBy: { orden: 'asc' }
    })

    return ApiResponse.success(request, escuelas)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/escuelas
 * Crea una nueva escuela
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { nombre, slug, descripcion, imagen, estado, orden } = await request.json()

    if (!nombre || !slug) {
      return ApiResponse.error(request, 'El nombre y el slug son requeridos', 400)
    }

    const escuela = await prisma.escuela.create({
      data: {
        nombre,
        slug,
        descripcion,
        imagen,
        estado: estado || 'DISPONIBLE',
        orden: Number(orden) || 0
      }
    })

    revalidateTag('web-escuelas')

    return ApiResponse.success(request, { id: escuela.id, message: 'Escuela creada correctamente' })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return ApiResponse.error(request, 'Ya existe una escuela con ese nombre o slug', 400)
    }

    return handleApiError(error, request)
  }
}
