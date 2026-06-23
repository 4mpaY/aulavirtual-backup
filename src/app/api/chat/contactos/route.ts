export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getAllowedContactIds } from '../_helpers/allowedContacts'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const allowedIds = await getAllowedContactIds(auth.user.id, auth.user.rol)

    if (allowedIds.length === 0) {
      return ApiResponse.success(request, [])
    }

    const usuarios = await prisma.usuario.findMany({
      where: { id: { in: allowedIds }, esta_activo: true },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        avatar: true,
        rol: true
      }
    })

    const conversaciones = await prisma.conversacion.findMany({
      where: { participantes: { some: { usuario_id: auth.user.id } } },
      include: { participantes: { select: { usuario_id: true } } }
    })

    const contactos = usuarios.map(u => {
      const conv = conversaciones.find(
        c => c.participantes.length === 2 && c.participantes.some(p => p.usuario_id === u.id)
      )

      return { ...u, conversacion_id: conv?.id ?? null }
    })

    return ApiResponse.success(request, contactos)
  } catch (error) {
    return handleApiError(error, request)
  }
}
