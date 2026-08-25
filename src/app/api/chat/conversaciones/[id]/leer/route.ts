export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const participante = await prisma.participanteConversacion.findUnique({
      where: { conversacion_id_usuario_id: { conversacion_id: params.id, usuario_id: auth.user.id } }
    })

    if (!participante) {
      return ApiResponse.error(request, 'Conversación no encontrada', 404)
    }

    const { count } = await prisma.mensajeChat.updateMany({
      where: {
        conversacion_id: params.id,
        remitente_id: { not: auth.user.id },
        leido: false
      },
      data: { leido: true }
    })

    return ApiResponse.success(request, { actualizados: count })
  } catch (error) {
    return handleApiError(error, request)
  }
}
