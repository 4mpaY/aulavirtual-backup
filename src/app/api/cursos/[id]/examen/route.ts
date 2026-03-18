import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId } = params

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // El profesor debe ser el dueño o ser admin
    if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para ver este examen', 403)
    }

    // Buscar el examen
    const examen = await prisma.examen.findFirst({
      where: { curso_id: cursoId },
      include: {
        preguntas: {
          orderBy: { orden: 'asc' },
          include: {
            opciones: {
              orderBy: { orden: 'asc' }
            }
          }
        }
      }
    })

    return ApiResponse.success(request, { examen: examen || null })
  } catch (error: any) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId } = params
    const body = await request.json()
    const { titulo, descripcion, limite_tiempo, puntaje_aprobacion, intentos_maximos, esta_publicado, mezclar_preguntas } = body

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // El profesor debe ser el dueño o ser admin
    if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para editar este examen', 403)
    }

    // Check if exam already exists
    let examen = await prisma.examen.findFirst({
      where: { curso_id: cursoId }
    })

    if (examen) {
      // Update existing exam
      examen = await prisma.examen.update({
        where: { id: examen.id },
        data: {
          titulo: titulo || examen.titulo,
          descripcion: descripcion !== undefined ? descripcion : examen.descripcion,
          limite_tiempo: limite_tiempo !== undefined ? limite_tiempo : examen.limite_tiempo,
          puntaje_aprobacion: puntaje_aprobacion !== undefined ? Number(puntaje_aprobacion) : examen.puntaje_aprobacion,
          intentos_maximos: intentos_maximos !== undefined ? Number(intentos_maximos) : examen.intentos_maximos,
          esta_publicado: esta_publicado !== undefined ? esta_publicado : examen.esta_publicado,
          mezclar_preguntas: mezclar_preguntas !== undefined ? mezclar_preguntas : examen.mezclar_preguntas
        }
      })
    } else {
      // Create new exam
      if (!titulo) {
         return ApiResponse.error(request, 'El título del examen es requerido', 400)
      }
      
      examen = await prisma.examen.create({
        data: {
          titulo,
          descripcion,
          limite_tiempo,
          puntaje_aprobacion: Number(puntaje_aprobacion || 60),
          intentos_maximos: Number(intentos_maximos || 1),
          esta_publicado: esta_publicado || false,
          mezclar_preguntas: mezclar_preguntas || false,
          curso_id: cursoId
        }
      })
    }

    return ApiResponse.success(request, { examen, message: 'Examen guardado exitosamente' })
  } catch (error: any) {
    return handleApiError(error, request)
  }
}
