export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { actualizarEventoExternoSchema } from '@/schemas/eventoExterno.schema'

/**
 * PATCH /api/eventos-externos/[id]
 * Solo el creador del evento puede editarlo
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const eventoExistente = await prisma.eventoExterno.findUnique({
      where: { id: params.id }
    })

    if (!eventoExistente) {
      return ApiResponse.error(request, 'Evento no encontrado', 404)
    }

    if (eventoExistente.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para editar este evento', 403)
    }

    const body = await request.json()

    const validation = validateRequest(actualizarEventoExternoSchema, body, request)

    if (!validation.success) return validation.error

    const { titulo, descripcion, fecha_inicio, fecha_fin, todo_el_dia, color } = validation.data

    const fechaInicioFinal = fecha_inicio ?? eventoExistente.fecha_inicio
    const fechaFinFinal = fecha_fin !== undefined ? fecha_fin : eventoExistente.fecha_fin

    if (fechaFinFinal && fechaFinFinal < fechaInicioFinal) {
      return ApiResponse.error(request, 'La fecha de fin no puede ser anterior a la fecha de inicio', 422)
    }

    const evento = await prisma.eventoExterno.update({
      where: { id: params.id },
      data: {
        titulo,
        descripcion: descripcion === undefined ? undefined : descripcion || null,
        fecha_inicio,
        fecha_fin: fecha_fin === undefined ? undefined : fecha_fin || null,
        todo_el_dia,
        color: color === undefined ? undefined : color || null
      }
    })

    return ApiResponse.success(request, { evento })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/eventos-externos/[id]
 * Solo el creador del evento puede eliminarlo
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const eventoExistente = await prisma.eventoExterno.findUnique({
      where: { id: params.id }
    })

    if (!eventoExistente) {
      return ApiResponse.error(request, 'Evento no encontrado', 404)
    }

    if (eventoExistente.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para eliminar este evento', 403)
    }

    await prisma.eventoExterno.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Evento eliminado exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
