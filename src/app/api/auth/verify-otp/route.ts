import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/auth/verify-otp
 * Verifica si el código OTP ingresado es válido
 */
export async function POST(request: Request) {
  try {
    const { correo, codigo } = await request.json()

    if (!correo || !codigo) {
      return ApiResponse.error(request, 'Correo y código son obligatorios', 400)
    }

    // Buscar el código más reciente no usado para este correo
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        correo,
        codigo,
        usado: false,
        expira_en: { gte: new Date() }
      },
      orderBy: { creado_en: 'desc' }
    })

    if (!resetRequest) {
      return ApiResponse.error(request, 'Código inválido o expirado', 400)
    }

    return ApiResponse.success(request, { message: 'Código verificado con éxito' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
