export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/escuelas
 * Lista todas las escuelas activas/disponibles para el público
 */
export async function GET(request: Request) {
  try {
    const escuelas = await prisma.escuela.findMany({
      orderBy: { orden: 'asc' }
    })

    return ApiResponse.success(request, escuelas)
  } catch (error) {
    return handleApiError(error, request)
  }
}
