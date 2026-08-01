export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/cursos/[id]/actividades
 * Lista todas las actividades del curso
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId } = params
    const curso = await prisma.curso.findUnique({ where: { id: cursoId } })

    if (!curso) return ApiResponse.error(request, 'Curso no encontrado', 404)

    if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso', 403)
    }

    const actividades = await prisma.actividad.findMany({
      where: { curso_id: cursoId },
      orderBy: [{ modulo_id: 'asc' }, { orden: 'asc' }],
      include: {
        preguntas: {
          orderBy: { orden: 'asc' },
          include: { opciones: { orderBy: { orden: 'asc' } } }
        },
        modulo: { select: { id: true, titulo: true, orden: true } },
        _count: { select: { entregas: true } }
      }
    })

    return ApiResponse.success(request, { actividades })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/cursos/[id]/actividades
 * Crear una nueva actividad
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId } = params
    const body = await request.json()

    const {
      titulo,
      instrucciones,
      tipo = 'ARCHIVO',
      puntaje_maximo = 20,
      esta_publicado = false,
      modulo_id,
      fecha_inicio,
      fecha_fin
    } = body

    if (!titulo) return ApiResponse.error(request, 'El título es requerido', 400)

    const curso = await prisma.curso.findUnique({ where: { id: cursoId } })

    if (!curso) return ApiResponse.error(request, 'Curso no encontrado', 404)

    if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso', 403)
    }

    if (modulo_id) {
      const modulo = await prisma.modulo.findUnique({ where: { id: modulo_id } })

      if (!modulo || modulo.curso_id !== cursoId) {
        return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)
      }
    }

    const maxOrden = await prisma.actividad.aggregate({
      where: { curso_id: cursoId, modulo_id: modulo_id || null },
      _max: { orden: true }
    })

    const orden = (maxOrden._max.orden ?? -1) + 1

    const actividad = await prisma.actividad.create({
      data: {
        titulo,
        instrucciones,
        tipo,
        puntaje_maximo: Number(puntaje_maximo),
        esta_publicado,
        orden,
        curso_id: cursoId,
        modulo_id: modulo_id || null,
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null
      },
      include: {
        modulo: { select: { id: true, titulo: true, orden: true } },
        _count: { select: { preguntas: true, entregas: true } }
      }
    })

    return ApiResponse.success(request, { actividad }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
