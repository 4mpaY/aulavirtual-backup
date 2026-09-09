export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { actualizarSimulacroSchema } from '@/schemas/simulacro.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { generateUniqueSlug } from '@/utils/libs/slug'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const simulacro = await prisma.simulacro.findUnique({ where: { id: params.id } })

    if (!simulacro) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    return ApiResponse.success(request, simulacro)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const existing = await prisma.simulacro.findUnique({ where: { id: params.id } })

    if (!existing) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    const body = await request.json()
    const validation = validateRequest(actualizarSimulacroSchema, body, request)

    if (!validation.success) return validation.error

    const { titulo, duracion, ...rest } = validation.data

    let slug = existing.slug

    if (titulo && titulo !== existing.titulo) {
      slug = await generateUniqueSlug(titulo, prisma.simulacro, params.id)
    }

    const simulacro = await prisma.simulacro.update({
      where: { id: params.id },
      data: {
        ...(titulo ? { titulo, slug } : {}),
        ...(duracion !== undefined ? { duracion: duracion != null ? String(duracion) : null } : {}),
        ...rest,
      },
    })

    return ApiResponse.success(request, simulacro)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const simulacro = await prisma.simulacro.findUnique({ where: { id: params.id } })

    if (!simulacro) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    if (simulacro.estado !== 'BORRADOR') {
      return ApiResponse.error(request, 'Solo se pueden eliminar simulacros en estado BORRADOR', 400)
    }

    await prisma.simulacro.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Simulacro eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
