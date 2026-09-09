import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/cursos/[id]/lecciones/[leccionId]/trabajo/entregas
 * Obtiene la lista de todos los estudiantes inscritos en el curso y sus entregas
 * correspondientes al trabajo de una lección específica.
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string; leccionId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { id: cursoId, leccionId } = params

    // 1. Verificar existencia del curso y propiedad si es PROFESOR
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: { profesor_id: true }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    if (user.rol === 'PROFESOR' && curso.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // 2. Verificar existencia de la lección y obtener su Trabajo
    const leccion = await prisma.leccion.findFirst({
      where: {
        id: leccionId,
        modulo: { curso_id: cursoId }
      },
      include: {
        trabajo: true
      }
    })

    if (!leccion) {
      return ApiResponse.error(request, 'Lección no encontrada en este curso', 404)
    }

    if (!leccion.trabajo) {
      return ApiResponse.success(request, { trabajo: null, entregas: [] })
    }

    // 3. Obtener todos los alumnos inscritos activos
    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        curso_id: cursoId,
        estado: 'ACTIVO'
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            avatar: true
          }
        }
      },
      orderBy: {
        usuario: {
          nombre: 'asc'
        }
      }
    })

    // 4. Obtener todas las entregas realizadas para este trabajo
    const entregas = await prisma.entregaTrabajo.findMany({
      where: { trabajo_id: leccion.trabajo.id }
    })

    const entregasMap = new Map(entregas.map(e => [e.usuario_id, e]))

    // 5. Mapear la lista combinando inscritos con sus entregas
    const listaEntregas = inscripciones.map(ins => {
      const estudiante = ins.usuario
      const entrega = entregasMap.get(estudiante.id) || null

      return {
        estudiante: {
          id: estudiante.id,
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          correo: estudiante.correo,
          avatar: estudiante.avatar
        },
        entrega: entrega
          ? {
              id: entrega.id,
              archivo_url: entrega.archivo_url,
              archivo_nombre: entrega.archivo_nombre,
              comentario_estudiante: entrega.comentario_estudiante,
              nota: entrega.nota,
              comentario_docente: entrega.comentario_docente,
              creado_en: entrega.creado_en,
              actualizado_en: entrega.actualizado_en
            }
          : null
      }
    })

    return ApiResponse.success(request, {
      trabajo: {
        id: leccion.trabajo.id,
        titulo: leccion.trabajo.titulo,
        descripcion: leccion.trabajo.descripcion,
        archivo_url: leccion.trabajo.archivo_url,
        archivo_nombre: leccion.trabajo.archivo_nombre,
        fecha_inicio: leccion.trabajo.fecha_inicio,
        fecha_fin: leccion.trabajo.fecha_fin
      },
      entregas: listaEntregas
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
