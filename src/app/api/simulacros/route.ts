export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { crearSimulacroSchema, listarSimulacrosQuerySchema } from '@/schemas/simulacro.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { generateUniqueSlug } from '@/utils/libs/slug'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    const validation = validateRequest(listarSimulacrosQuerySchema, query, request)

    if (!validation.success) return validation.error

    const { page, limit, buscar, estado, nivel } = validation.data
    const skip = (page - 1) * limit

    const authHeader = request.headers.get('authorization')
    const estadoFiltro = estado ?? (authHeader ? undefined : 'PUBLICADO')

    const where: any = {}

    if (estadoFiltro) where.estado = estadoFiltro

    if (nivel) where.nivel = nivel

    if (buscar) {
      where.OR = [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { descripcion: { contains: buscar, mode: 'insensitive' } },
        { area_tematica: { contains: buscar, mode: 'insensitive' } },
      ]
    }

    const [simulacros, total] = await Promise.all([
      prisma.simulacro.findMany({ where, orderBy: { creado_en: 'desc' }, skip, take: limit }),
      prisma.simulacro.count({ where }),
    ])

    return ApiResponse.success(request, { simulacros, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()
    const validation = validateRequest(crearSimulacroSchema, body, request)

    if (!validation.success) return validation.error

    const { titulo, precio, duracion, ...rest } = validation.data
    const slug = await generateUniqueSlug(titulo, prisma.simulacro)

    const simulacro = await prisma.simulacro.create({
      data: {
        titulo,
        slug,
        precio,
        duracion: duracion != null ? String(duracion) : null,
        ...rest,
      },
    })

    return ApiResponse.success(request, simulacro, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
