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

    const conversaciones = await prisma.conversacion.findMany({
      where: { participantes: { some: { usuario_id: auth.user.id } } },
      include: {
        participantes: {
          include: {
            usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, rol: true } }
          }
        },
        mensajes: {
          orderBy: { creado_en: 'desc' },
          take: 1,
          select: { id: true, contenido: true, creado_en: true, remitente_id: true, leido: true }
        }
      },
      orderBy: { actualizado_en: 'desc' }
    })

    const result = await Promise.all(
      conversaciones.map(async conv => {
        const otro = conv.participantes.find(p => p.usuario_id !== auth.user.id)

        const noLeidos = await prisma.mensajeChat.count({
          where: {
            conversacion_id: conv.id,
            leido: false,
            remitente_id: { not: auth.user.id }
          }
        })

        return {
          id: conv.id,
          actualizado_en: conv.actualizado_en,
          otroParticipante: otro?.usuario ?? null,
          ultimoMensaje: conv.mensajes[0] ?? null,
          mensajesNoLeidos: noLeidos
        }
      })
    )

    return ApiResponse.success(request, result)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { receptor_id } = await request.json()

    if (!receptor_id || typeof receptor_id !== 'string') {
      return ApiResponse.error(request, 'receptor_id es requerido', 400)
    }

    const allowedIds = await getAllowedContactIds(auth.user.id, auth.user.rol)

    if (!allowedIds.includes(receptor_id)) {
      return ApiResponse.error(request, 'No tienes permiso para chatear con este usuario', 403)
    }

    const existentes = await prisma.conversacion.findMany({
      where: { participantes: { some: { usuario_id: auth.user.id } } },
      include: { participantes: { select: { usuario_id: true } } }
    })

    const encontrada = existentes.find(
      c => c.participantes.length === 2 && c.participantes.some(p => p.usuario_id === receptor_id)
    )

    if (encontrada) {
      return ApiResponse.success(request, { conversacion_id: encontrada.id })
    }

    const nueva = await prisma.conversacion.create({
      data: {
        participantes: {
          create: [{ usuario_id: auth.user.id }, { usuario_id: receptor_id }]
        }
      }
    })

    return ApiResponse.success(request, { conversacion_id: nueva.id }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
