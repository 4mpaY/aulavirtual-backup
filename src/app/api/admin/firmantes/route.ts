export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/admin/firmantes
 * Lista todos los firmantes (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const firmantes = await prisma.firmante.findMany({
      orderBy: { creado_en: 'desc' }
    })

    return ApiResponse.success(request, { firmantes })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/firmantes
 * Crea un nuevo firmante (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { nombre, cargo, firma, sello } = body

    if (!nombre) {
      return ApiResponse.error(request, 'nombre es obligatorio', 400)
    }

    const firmante = await prisma.firmante.create({
      data: {
        nombre,
        cargo: cargo || null,
        firma: firma || null,
        sello: sello || null
      }
    })

    return ApiResponse.success(request, { firmante }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
