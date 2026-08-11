export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { crearEventoExternoSchema } from '@/schemas/eventoExterno.schema'

/**
 * GET /api/eventos-externos
 * Lista los eventos externos del usuario autenticado (agenda personal)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const eventos = await prisma.eventoExterno.findMany({
      where: { usuario_id: auth.user.id },
      orderBy: { fecha_inicio: 'asc' }
    })

    return ApiResponse.success(request, { eventos })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/eventos-externos
 * Crea un evento externo (privado) para el usuario autenticado
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()

    const validation = validateRequest(crearEventoExternoSchema, body, request)

    if (!validation.success) return validation.error

    const { titulo, descripcion, fecha_inicio, fecha_fin, todo_el_dia, color } = validation.data

    const evento = await prisma.eventoExterno.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        fecha_inicio,
        fecha_fin: fecha_fin || null,
        todo_el_dia,
        color: color || null,
        usuario_id: auth.user.id
      }
    })

    return ApiResponse.success(request, { evento }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
