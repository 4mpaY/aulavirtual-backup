export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { user } = auth

    const inscriptions = await prisma.inscripcion.findMany({
      where: {
        usuario_id: user.id,
        estado: 'ACTIVO'
      },
      include: {
        curso: {
          include: {
            profesor: {
              select: { nombre: true, apellido: true }
            },
            categoria: {
              select: { nombre: true }
            },
            progreso: {
              where: { usuario_id: user.id }
            }
          }
        }
      }
    })

    const ahora = new Date()

    const cursosInscritos = inscriptions.map(ins => {
      const vigenciaMeses = ins.curso.vigencia_meses ?? 0
      let tieneAcceso = true

      if (vigenciaMeses > 0) {
        const accesHasta = new Date(ins.inscrito_en)

        accesHasta.setMonth(accesHasta.getMonth() + vigenciaMeses)
        tieneAcceso = accesHasta > ahora
      }

      return {
        id: ins.curso.id,
        titulo: ins.curso.titulo,
        slug: ins.curso.slug,
        miniatura: ins.curso.miniatura ?? undefined,
        profesor: ins.curso.profesor,
        categoria: ins.curso.categoria?.nombre,
        progreso: ins.curso.progreso[0]?.porcentaje_progreso || 0,
        tieneAcceso,
        origen: 'COMPRA' as const
      }
    })

    // Incluir cursos de suscripción activa
    const suscripcionActiva = await prisma.suscripcion.findFirst({
      where: {
        usuario_id: user.id,
        estado: { in: ['ACTIVA', 'EN_PRUEBA'] }
      },
      include: {
        plan: {
          include: {
            cursos: {
              include: {
                curso: {
                  include: {
                    profesor: { select: { nombre: true, apellido: true } },
                    categoria: { select: { nombre: true } },
                    progreso: { where: { usuario_id: user.id } }
                  }
                }
              }
            }
          }
        }
      }
    })

    const cursosSuscripcion = suscripcionActiva?.plan.cursos.map(cp => ({
      id: cp.curso.id,
      titulo: cp.curso.titulo,
      slug: cp.curso.slug,
      miniatura: cp.curso.miniatura ?? undefined,
      profesor: cp.curso.profesor,
      categoria: cp.curso.categoria?.nombre,
      progreso: cp.curso.progreso[0]?.porcentaje_progreso || 0,
      tieneAcceso: true,
      origen: 'SUSCRIPCION' as const
    })) ?? []

    // Combinar y deduplicar por id (compra tiene prioridad sobre suscripción)
    const idsInscritos = new Set(cursosInscritos.map(c => c.id))
    const cursosSoloSub = cursosSuscripcion.filter(c => !idsInscritos.has(c.id))
    const courses = [...cursosInscritos, ...cursosSoloSub]

    return ApiResponse.success(request, { courses })
  } catch (error) {
    return handleApiError(error, request)
  }
}
