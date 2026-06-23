export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const total = await prisma.mensajeChat.count({
      where: {
        leido: false,
        remitente_id: { not: auth.user.id },
        conversacion: {
          participantes: { some: { usuario_id: auth.user.id } }
        }
      }
    })

    return ApiResponse.success(request, { total })
  } catch (error) {
    return handleApiError(error, request)
  }
}
