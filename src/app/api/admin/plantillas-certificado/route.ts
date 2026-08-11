export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/admin/plantillas-certificado
 * Lista todas las plantillas de certificado personalizadas (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const plantillas = await prisma.plantillaCertificadoPersonalizada.findMany({
      orderBy: { creado_en: 'desc' }
    })

    return ApiResponse.success(request, { plantillas })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/plantillas-certificado
 * Crea una nueva plantilla de certificado personalizada (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { nombre, cara_frente_url, cara_reverso_url, campos } = body

    if (!nombre) {
      return ApiResponse.error(request, 'nombre es obligatorio', 400)
    }

    const plantilla = await prisma.plantillaCertificadoPersonalizada.create({
      data: {
        nombre,
        cara_frente_url: cara_frente_url || '',
        cara_reverso_url: cara_reverso_url || null,
        campos: Array.isArray(campos) ? campos : []
      }
    })

    return ApiResponse.success(request, { plantilla }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
