export const dynamic = 'force-dynamic'

import { randomUUID } from 'crypto'

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

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const preguntas: any[] = await prisma.$queryRaw`
      SELECT id, enunciado, tema, fundamento, audio_url, imagen_url, orden
      FROM "PreguntaSimulacro"
      WHERE simulacro_id = ${params.id}
      ORDER BY orden ASC
    `

    const preguntasConOpciones = await Promise.all(
      preguntas.map(async (pq: any) => {
        const opciones: any[] = await prisma.$queryRaw`
          SELECT id, texto, es_correcta, orden
          FROM "OpcionPreguntaSimulacro"
          WHERE pregunta_id = ${pq.id}
          ORDER BY orden ASC
        `

        return { ...pq, opciones }
      })
    )

    return ApiResponse.success(request, preguntasConOpciones)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const simulacro: any[] = await prisma.$queryRaw`
      SELECT id FROM "Simulacro" WHERE id = ${params.id} LIMIT 1
    `

    if (simulacro.length === 0) return ApiResponse.error(request, 'Simulacro no encontrado', 404)

    const body = await request.json()
    const parsed = preguntaSchema.safeParse(body)

    if (!parsed.success) return ApiResponse.error(request, 'Datos inválidos', 400)

    const { enunciado, tema, fundamento, audio_url, imagen_url, orden, opciones } = parsed.data
    const preguntaId = randomUUID()

    await prisma.$executeRaw`
      INSERT INTO "PreguntaSimulacro" (id, simulacro_id, enunciado, tema, fundamento, audio_url, imagen_url, orden, creado_en)
      VALUES (${preguntaId}, ${params.id}, ${enunciado}, ${tema ?? null}, ${fundamento ?? null}, ${audio_url ?? null}, ${imagen_url ?? null}, ${orden}, NOW())
    `

    for (const op of opciones) {
      await prisma.$executeRaw`
        INSERT INTO "OpcionPreguntaSimulacro" (id, pregunta_id, texto, es_correcta, orden)
        VALUES (${randomUUID()}, ${preguntaId}, ${op.texto}, ${op.es_correcta}, ${op.orden})
      `
    }

    // Devolver la pregunta creada con sus opciones
    const [pregunta]: any[] = await prisma.$queryRaw`
      SELECT id, enunciado, tema, fundamento, audio_url, imagen_url, orden FROM "PreguntaSimulacro" WHERE id = ${preguntaId}
    `

    const opcionesCreadas: any[] = await prisma.$queryRaw`
      SELECT id, texto, es_correcta, orden FROM "OpcionPreguntaSimulacro" WHERE pregunta_id = ${preguntaId} ORDER BY orden
    `

    return ApiResponse.success(request, { ...pregunta, opciones: opcionesCreadas }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
