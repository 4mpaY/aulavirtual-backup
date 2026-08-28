export const dynamic = 'force-dynamic'

import { z } from 'zod'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

const opcionSchema = z.object({
  texto: z.string().min(1),
  es_correcta: z.boolean().default(false),
  orden: z.number().int().default(0),
})

const preguntaSchema = z.object({
  enunciado: z.string().min(1),
  tema: z.string().optional().nullable(),
  fundamento: z.string().optional().nullable(),
  audio_url: z.string().optional().nullable(),
  imagen_url: z.string().optional().nullable(),
  orden: z.number().int().default(0),
  opciones: z.array(opcionSchema).min(2).max(6),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const preguntas = await prisma.preguntaSimulacro.findMany({
      where: { simulacro_id: params.id },
      orderBy: { orden: 'asc' },
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

    return ApiResponse.success(request, preguntas)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const simulacro = await prisma.simulacro.findUnique({
      where: { id: params.id },
      select: { id: true }
    })

    if (!simulacro) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    const body = await request.json()
    const parsed = preguntaSchema.safeParse(body)

    if (!parsed.success) return ApiResponse.error(request, 'Datos inválidos', 400)

    const { enunciado, tema, fundamento, audio_url, imagen_url, orden, opciones } = parsed.data

    const pregunta = await prisma.preguntaSimulacro.create({
      data: {
        simulacro_id: params.id,
        enunciado,
        tema: tema ?? null,
        fundamento: fundamento ?? null,
        audio_url: audio_url ?? null,
        imagen_url: imagen_url ?? null,
        orden,
        opciones: {
          create: opciones.map(op => ({
            texto: op.texto,
            es_correcta: op.es_correcta,
            orden: op.orden
          }))
        }
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

    return ApiResponse.success(request, pregunta, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
