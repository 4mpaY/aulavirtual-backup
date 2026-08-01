export const dynamic = 'force-dynamic'

import { randomUUID } from 'crypto'

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

    const existing: any[] = await prisma.$queryRaw`
      SELECT id FROM "PreguntaSimulacro" WHERE id = ${params.preguntaId} LIMIT 1
    `

    if (existing.length === 0) return ApiResponse.error(request, 'Pregunta no encontrada', 404)

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) return ApiResponse.error(request, 'Datos inválidos', 400)

    const { enunciado, tema, fundamento, audio_url, imagen_url, orden, opciones } = parsed.data

    if (enunciado !== undefined) {
      await prisma.$executeRaw`
        UPDATE "PreguntaSimulacro"
        SET enunciado  = ${enunciado},
            tema       = ${tema ?? null},
            fundamento = ${fundamento ?? null},
            audio_url  = ${audio_url ?? null},
            imagen_url = ${imagen_url ?? null},
            orden      = ${orden ?? 0}
        WHERE id = ${params.preguntaId}
      `
    }

    if (opciones) {
      await prisma.$executeRaw`DELETE FROM "OpcionPreguntaSimulacro" WHERE pregunta_id = ${params.preguntaId}`

      for (const op of opciones) {
        await prisma.$executeRaw`
          INSERT INTO "OpcionPreguntaSimulacro" (id, pregunta_id, texto, es_correcta, orden)
          VALUES (${randomUUID()}, ${params.preguntaId}, ${op.texto}, ${op.es_correcta}, ${op.orden})
        `
      }
    }

    const [pregunta]: any[] = await prisma.$queryRaw`
      SELECT id, enunciado, tema, fundamento, audio_url, imagen_url, orden FROM "PreguntaSimulacro" WHERE id = ${params.preguntaId}
    `

    const opcionesRes: any[] = await prisma.$queryRaw`
      SELECT id, texto, es_correcta, orden FROM "OpcionPreguntaSimulacro" WHERE pregunta_id = ${params.preguntaId} ORDER BY orden
    `

    return ApiResponse.success(request, { ...pregunta, opciones: opcionesRes })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string; preguntaId: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    await prisma.$executeRaw`DELETE FROM "PreguntaSimulacro" WHERE id = ${params.preguntaId}`

    const [{ total }]: any[] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS total FROM "PreguntaSimulacro" WHERE simulacro_id = ${params.id}
    `

    await prisma.simulacro.update({ where: { id: params.id }, data: { numero_preguntas: total } })

    return ApiResponse.success(request, { message: 'Pregunta eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
