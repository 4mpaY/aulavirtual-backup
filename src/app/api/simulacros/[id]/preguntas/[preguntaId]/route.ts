export const dynamic = 'force-dynamic'

import { z } from 'zod'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

const updateSchema = z.object({
  enunciado: z.string().min(1).optional(),
  tema: z.string().optional().nullable(),
  fundamento: z.string().optional().nullable(),
  orden: z.number().int().optional(),
  audio_url: z.string().optional().nullable(),
  imagen_url: z.string().optional().nullable(),
  opciones: z.array(z.object({
    texto: z.string().min(1),
    es_correcta: z.boolean().default(false),
    orden: z.number().int().default(0),
  })).min(2).max(6).optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string; preguntaId: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const existing = await prisma.preguntaSimulacro.findUnique({
      where: { id: params.preguntaId },
      select: { id: true }
    })

    if (!existing) return ApiResponse.error(request, 'Pregunta no encontrada', 404)

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) return ApiResponse.error(request, 'Datos inválidos', 400)

    const { enunciado, tema, fundamento, audio_url, imagen_url, orden, opciones } = parsed.data

    const pregunta = await prisma.preguntaSimulacro.update({
      where: { id: params.preguntaId },
      data: {
        ...(enunciado !== undefined ? { enunciado } : {}),
        tema: tema ?? null,
        fundamento: fundamento ?? null,
        audio_url: audio_url ?? null,
        imagen_url: imagen_url ?? null,
        ...(orden !== undefined ? { orden } : {}),
        ...(opciones
          ? {
              opciones: {
                deleteMany: {},
                create: opciones.map(op => ({
                  texto: op.texto,
                  es_correcta: op.es_correcta,
                  orden: op.orden
                }))
              }
            }
          : {})
      },
      select: {
        id: true,
        enunciado: true,
        tema: true,
        fundamento: true,
        audio_url: true,
        imagen_url: true,
        orden: true,
        opciones: {
          orderBy: { orden: 'asc' },
          select: { id: true, texto: true, es_correcta: true, orden: true }
        }
      }
    })

    return ApiResponse.success(request, pregunta)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string; preguntaId: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    await prisma.preguntaSimulacro.delete({
      where: { id: params.preguntaId }
    })

    const totalPreguntas = await prisma.preguntaSimulacro.count({
      where: { simulacro_id: params.id }
    })

    await prisma.simulacro.update({
      where: { id: params.id },
      data: { numero_preguntas: totalPreguntas }
    })

    return ApiResponse.success(request, { message: 'Pregunta eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
