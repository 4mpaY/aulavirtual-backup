import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/estudiante/progreso
 * Cuerpo: { leccionId: string, estaCompletado: boolean }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { leccionId, estaCompletado } = await request.json()

    if (!leccionId) {
      return ApiResponse.error(request, 'ID de lección es requerido', 400)
    }

    // 1. Obtener información de la lección y el curso
    const leccion = await prisma.leccion.findUnique({
      where: { id: leccionId },
      include: {
        modulo: {
          select: { curso_id: true }
        }
      }
    })

    if (!leccion) {
      return ApiResponse.error(request, 'Lección no encontrada', 404)
    }

    const cursoId = leccion.modulo.curso_id

    // 2. Actualizar o crear ProgresoLeccion
    await prisma.progresoLeccion.upsert({
      where: {
        usuario_id_leccion_id: {
          usuario_id: auth.user.id,
          leccion_id: leccionId
        }
      },
      update: {
        esta_completado: estaCompletado,
        completado_en: estaCompletado ? new Date() : null
      },
      create: {
        usuario_id: auth.user.id,
        leccion_id: leccionId,
        esta_completado: estaCompletado,
        completado_en: estaCompletado ? new Date() : null
      }
    })

    // 3. Recalcular progreso del curso
    // Obtener todas las lecciones del curso
    const todasLasLecciones = await prisma.leccion.findMany({
      where: {
        modulo: { curso_id: cursoId }
      },
      select: { id: true }
    })

    const totalLecciones = todasLasLecciones.length

    if (totalLecciones === 0) {
      return ApiResponse.success(request, { porcentaje: 100 })
    }

    // Obtener lecciones completadas por el usuario en este curso
    const leccionesCompletadasCount = await prisma.progresoLeccion.count({
      where: {
        usuario_id: auth.user.id,
        esta_completado: true,
        leccion: {
          modulo: { curso_id: cursoId }
        }
      }
    })

    const porcentaje = Math.round((leccionesCompletadasCount / totalLecciones) * 100)

    // 4. Actualizar ProgresoCurso
    const progresoCurso = await prisma.progresoCurso.upsert({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      },
      update: {
        porcentaje_progreso: porcentaje
      },
      create: {
        usuario_id: auth.user.id,
        curso_id: cursoId,
        porcentaje_progreso: porcentaje
      }
    })

    return ApiResponse.success(request, { 
      porcentaje,
      leccionId,
      estaCompletado,
      progresoCursoId: progresoCurso.id
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
