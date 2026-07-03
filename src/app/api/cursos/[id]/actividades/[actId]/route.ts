export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

const actividadInclude = {
  modulo: { select: { id: true, titulo: true, orden: true } },
  preguntas: {
    orderBy: { orden: 'asc' as const },
    include: { opciones: { orderBy: { orden: 'asc' as const } } }
  },
  _count: { select: { entregas: true } }
}

async function checkAccess(cursoId: string, actId: string, auth: any, request: Request) {
  const curso = await prisma.curso.findUnique({ where: { id: cursoId } })

  if (!curso) return { error: ApiResponse.error(request, 'Curso no encontrado', 404) }

  if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
    return { error: ApiResponse.error(request, 'No tienes permiso', 403) }
  }

  const actividad = await prisma.actividad.findUnique({ where: { id: actId } })

  if (!actividad || actividad.curso_id !== cursoId) {
    return { error: ApiResponse.error(request, 'Actividad no encontrada', 404) }
  }

  return { curso, actividad }
}

/**
 * GET /api/cursos/[id]/actividades/[actId]
 */
export async function GET(request: Request, { params }: { params: { id: string; actId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const check = await checkAccess(cursoId, actId, auth, request)

    if (check.error) return check.error

    const actividad = await prisma.actividad.findUnique({
      where: { id: actId },
      include: actividadInclude
    })

    return ApiResponse.success(request, { actividad })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/cursos/[id]/actividades/[actId]
 */
export async function PATCH(request: Request, { params }: { params: { id: string; actId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const check = await checkAccess(cursoId, actId, auth, request)

    if (check.error) return check.error

    const body = await request.json()
    const { titulo, instrucciones, tipo, puntaje_maximo, esta_publicado, fecha_inicio, fecha_fin, modulo_id } = body

    const updated = await prisma.actividad.update({
      where: { id: actId },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(instrucciones !== undefined && { instrucciones }),
        ...(tipo !== undefined && { tipo }),
        ...(puntaje_maximo !== undefined && { puntaje_maximo: Number(puntaje_maximo) }),
        ...(esta_publicado !== undefined && { esta_publicado }),
        ...(modulo_id !== undefined && { modulo_id: modulo_id || null }),
        ...(fecha_inicio !== undefined && { fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null }),
        ...(fecha_fin !== undefined && { fecha_fin: fecha_fin ? new Date(fecha_fin) : null })
      },
      include: actividadInclude
    })

    return ApiResponse.success(request, { actividad: updated })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/cursos/[id]/actividades/[actId]
 */
export async function DELETE(request: Request, { params }: { params: { id: string; actId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const check = await checkAccess(cursoId, actId, auth, request)

    if (check.error) return check.error

    await prisma.actividad.delete({ where: { id: actId } })

    return ApiResponse.success(request, { message: 'Actividad eliminada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
