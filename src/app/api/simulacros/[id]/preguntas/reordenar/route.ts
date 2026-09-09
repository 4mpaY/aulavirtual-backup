export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { reordenarPreguntasSimulacroSchema } from '@/schemas/simulacro.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()
    const validation = validateRequest(reordenarPreguntasSimulacroSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { items } = validation.data

    await Promise.all(
      items.map(({ id, orden }) =>
        prisma.$executeRaw`
          UPDATE "PreguntaSimulacro" SET orden = ${orden}
          WHERE id = ${id} AND simulacro_id = ${params.id}
        `
      )
    )

    return ApiResponse.success(request, { message: 'Orden actualizado' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
