export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getMisCertificados } from '@/features/estudiante/certificados/server/getMisCertificados'

/**
 * GET /api/estudiante/certificados
 * Lista todos los certificados del estudiante autenticado
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const certificados = await getMisCertificados(auth.user.id)

    return ApiResponse.success(request, { certificados })
  } catch (error) {
    return handleApiError(error, request)
  }
}
