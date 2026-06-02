export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { actualizarSimulacroSchema } from '@/schemas/simulacro.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { generateUniqueSlug } from '@/utils/libs/slug'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const simulacro = await prisma.simulacro.findUnique({ where: { id: params.id } })
    if (!simulacro) return ApiResponse.notFound('Simulacro no encontrado')
    return ApiResponse.success(simulacro)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const existing = await prisma.simulacro.findUnique({ where: { id: params.id } })
    if (!existing) return ApiResponse.notFound('Simulacro no encontrado')

    const body = await request.json()
    const validation = validateRequest(actualizarSimulacroSchema, body, request)
    if (!validation.success) return validation.error

    const { titulo, ...rest } = validation.data

    let slug = existing.slug
    if (titulo && titulo !== existing.titulo) {
      slug = await generateUniqueSlug(titulo, prisma.simulacro, params.id)
    }

    const simulacro = await prisma.simulacro.update({
      where: { id: params.id },
      data: { ...(titulo ? { titulo, slug } : {}), ...rest },
    })

    return ApiResponse.success(simulacro)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const simulacro = await prisma.simulacro.findUnique({ where: { id: params.id } })
    if (!simulacro) return ApiResponse.notFound('Simulacro no encontrado')
    if (simulacro.estado !== 'BORRADOR') {
      return ApiResponse.badRequest('Solo se pueden eliminar simulacros en estado BORRADOR')
    }

    await prisma.simulacro.delete({ where: { id: params.id } })
    return ApiResponse.success({ message: 'Simulacro eliminado correctamente' })
  } catch (error) {
    return handleApiError(error)
  }
}
