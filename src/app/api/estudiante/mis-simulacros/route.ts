export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)
    if (!auth.authorized) return auth.error

    const { user } = auth

    // Usamos queryRaw porque el cliente Prisma aún no tiene el modelo inscripcionSimulacro
    // (pendiente de regenerar con pnpm db:client:generate)
    const rows = await prisma.$queryRaw<any[]>`
      SELECT
        s.id,
        s.titulo,
        s.slug,
        s.miniatura,
        s.nivel,
        s.duracion,
        s.numero_preguntas,
        s.area_tematica,
        s.es_gratis,
        s.precio,
        s.moneda,
        ins.id        AS inscripcion_id,
        ins.inscrito_en,
        ins.intentos,
        ins.mejor_puntaje
      FROM inscripciones_simulacro ins
      JOIN "Simulacro" s ON s.id = ins.simulacro_id
      WHERE ins.usuario_id = ${user.id}
        AND ins.estado = 'ACTIVO'
      ORDER BY ins.inscrito_en DESC
    `

    const simulacros = rows.map(r => ({
      ...r,
      precio: Number(r.precio),
      intentos: Number(r.intentos),
      mejor_puntaje: r.mejor_puntaje != null ? Number(r.mejor_puntaje) : null,
    }))

    return ApiResponse.success(request, { simulacros })
  } catch (error) {
    return handleApiError(error, request)
  }
}
