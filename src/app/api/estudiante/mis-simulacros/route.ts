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

    const inscripciones = await prisma.inscripcionSimulacro.findMany({
      where: {
        usuario_id: user.id,
        estado: 'ACTIVO'
      },
      include: {
        simulacro: {
          select: {
            id: true,
            titulo: true,
            slug: true,
            miniatura: true,
            nivel: true,
            duracion: true,
            numero_preguntas: true,
            area_tematica: true,
            es_gratis: true,
            precio: true,
            moneda: true
          }
        }
      },
      orderBy: {
        inscrito_en: 'desc'
      }
    })

    const simulacros = inscripciones.map(ins => ({
      id: ins.simulacro.id,
      titulo: ins.simulacro.titulo,
      slug: ins.simulacro.slug,
      miniatura: ins.simulacro.miniatura,
      nivel: ins.simulacro.nivel,
      duracion: ins.simulacro.duracion,
      numero_preguntas: ins.simulacro.numero_preguntas,
      area_tematica: ins.simulacro.area_tematica,
      es_gratis: ins.simulacro.es_gratis,
      precio: Number(ins.simulacro.precio),
      moneda: ins.simulacro.moneda,
      inscripcion_id: ins.id,
      inscrito_en: ins.inscrito_en,
      intentos: ins.intentos,
      mejor_puntaje: ins.mejor_puntaje != null ? Number(ins.mejor_puntaje) : null
    }))

    return ApiResponse.success(request, { simulacros })
  } catch (error) {
    return handleApiError(error, request)
  }
}
