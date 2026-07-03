export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getIO } from '@/utils/libs/socket-server'

async function verificarParticipante(conversacionId: string, userId: string) {
  return prisma.participanteConversacion.findUnique({
    where: { conversacion_id_usuario_id: { conversacion_id: conversacionId, usuario_id: userId } }
  })
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const participante = await verificarParticipante(params.id, auth.user.id)

    if (!participante) return ApiResponse.error(request, 'Conversación no encontrada', 404)

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')

    const mensajes = await prisma.mensajeChat.findMany({
      where: { conversacion_id: params.id },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { creado_en: 'asc' },
      take: 50,
      include: {
        remitente: { select: { id: true, nombre: true, apellido: true, avatar: true, rol: true } },
        adjunto: { select: { id: true, url: true, nombre: true, mimetype: true, tipo: true } }
      }
    })

    return ApiResponse.success(request, mensajes)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const participante = await verificarParticipante(params.id, auth.user.id)

    if (!participante) return ApiResponse.error(request, 'Conversación no encontrada', 404)

    const { contenido, adjunto_id } = await request.json()

    if (!contenido || typeof contenido !== 'string' || contenido.trim().length === 0) {
      return ApiResponse.error(request, 'El contenido no puede estar vacío', 400)
    }

    if (contenido.length > 4000) {
      return ApiResponse.error(request, 'El mensaje no puede superar los 4000 caracteres', 400)
    }

    const [mensaje] = await prisma.$transaction([
      prisma.mensajeChat.create({
        data: {
          contenido: contenido.trim(),
          conversacion_id: params.id,
          remitente_id: auth.user.id,
          ...(adjunto_id ? { adjunto_id } : {})
        },
        include: {
          remitente: { select: { id: true, nombre: true, apellido: true, avatar: true, rol: true } },
          adjunto: { select: { id: true, url: true, nombre: true, mimetype: true, tipo: true } }
        }
      }),
      prisma.conversacion.update({
        where: { id: params.id },
        data: { actualizado_en: new Date() }
      })
    ])

    // Notificar en tiempo real a todos los participantes de la conversación
    const io = getIO()

    if (io) {
      // Enviar el mensaje a todos en la sala de la conversación
      io.to(`conversacion:${params.id}`).emit('nuevo_mensaje', mensaje)

      // Notificar a las salas personales de los otros participantes (para actualizar el badge y la lista)
      const participantes = await prisma.participanteConversacion.findMany({
        where: { conversacion_id: params.id, usuario_id: { not: auth.user.id } },
        select: { usuario_id: true }
      })

      participantes.forEach(p => {
        io.to(`usuario:${p.usuario_id}`).emit('conversacion_actualizada', { conversacion_id: params.id })
      })
    }

    return ApiResponse.success(request, mensaje, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
