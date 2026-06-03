export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { cambiarEstadoSimulacroSchema } from '@/schemas/simulacro.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const simulacro = await prisma.simulacro.findUnique({ where: { id: params.id } })
    if (!simulacro) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    const body = await request.json()
    const validation = validateRequest(cambiarEstadoSimulacroSchema, body, request)
    if (!validation.success) return validation.error

    const updated = await prisma.simulacro.update({
      where: { id: params.id },
      data: { estado: validation.data.estado },
    })

    return ApiResponse.success(request, updated)
  } catch (error) {
    return handleApiError(error, request)
  }
}
