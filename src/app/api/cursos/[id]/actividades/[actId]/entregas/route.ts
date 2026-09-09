export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

const actividadReviewInclude = {
  preguntas: {
    orderBy: { orden: 'asc' as const },
    include: {
      opciones: { orderBy: { orden: 'asc' as const } }
    }
  }
}

async function assertActividadAccess(cursoId: string, actId: string, auth: any, request: Request) {
  const curso = await prisma.curso.findUnique({ where: { id: cursoId } })

  if (!curso) return { error: ApiResponse.error(request, 'Curso no encontrado', 404) }

  if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
    return { error: ApiResponse.error(request, 'No tienes permiso', 403) }
  }

  const actividad = await prisma.actividad.findUnique({
    where: { id: actId },
    include: actividadReviewInclude
  })

  if (!actividad || actividad.curso_id !== cursoId) {
    return { error: ApiResponse.error(request, 'Actividad no encontrada', 404) }
  }

  return { curso, actividad }
}

/**
 * GET /api/cursos/[id]/actividades/[actId]/entregas
 * Lista entregas, pendientes y contexto de la actividad para revisión
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string; actId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const check = await assertActividadAccess(cursoId, actId, auth, request)

    if (check.error) return check.error

    const { actividad } = check

    const entregas = await prisma.entregaActividad.findMany({
      where: { actividad_id: actId },
      orderBy: { creado_en: 'desc' },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } }
      }
    })

    const inscripciones = await prisma.inscripcion.findMany({
      where: { curso_id: cursoId, estado: 'ACTIVO' },
      select: { usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } } }
    })

    const entregaIds = new Set(entregas.map(e => e.usuario_id))

    const pendientes = inscripciones
      .map(i => i.usuario)
      .filter(u => !entregaIds.has(u.id))

    return ApiResponse.success(request, {
      entregas,
      pendientes,
      actividad: {
        id: actividad!.id,
        titulo: actividad!.titulo,
        tipo: actividad!.tipo,
        instrucciones: actividad!.instrucciones,
        puntaje_maximo: actividad!.puntaje_maximo,
        preguntas: actividad!.preguntas
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
