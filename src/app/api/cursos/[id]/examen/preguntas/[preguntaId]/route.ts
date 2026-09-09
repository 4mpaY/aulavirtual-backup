import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string; preguntaId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, preguntaId } = params
    const body = await request.json()
    const { texto, tipo, puntos, opciones } = body

    if (!texto || !tipo || !opciones || !Array.isArray(opciones) || opciones.length === 0) {
      return ApiResponse.error(request, 'Faltan datos requeridos o las opciones son inválidas', 400)
    }

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

    // Update question and its options in a transaction
    const updatedPregunta = await prisma.$transaction(async tx => {
      // First, update the question text/points
      await tx.pregunta.update({
        where: { id: preguntaId },
        data: {
          texto,
          tipo,
          puntos: Number(puntos || 1)
        }
      })

      // Delete old options
      await tx.opcionPregunta.deleteMany({
        where: { pregunta_id: preguntaId }
      })

      // Create new options
      await tx.opcionPregunta.createMany({
        data: opciones.map((opt: any, index: number) => ({
          texto: opt.texto,
          es_correcta: Boolean(opt.es_correcta),
          orden: index + 1,
          pregunta_id: preguntaId
        }))
      })

      // Return updated question with options
      return tx.pregunta.findUnique({
        where: { id: preguntaId },
        include: { opciones: { orderBy: { orden: 'asc' } } }
      })
    })

    return ApiResponse.success(request, { pregunta: updatedPregunta, message: 'Pregunta actualizada exitosamente' })
  } catch (error: any) {
    return handleApiError(error, request)
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string; preguntaId: string }> }
) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, preguntaId } = params

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

    // Delete the question (cascade will delete options)
    await prisma.pregunta.delete({
      where: { id: preguntaId }
    })

    return ApiResponse.success(request, { message: 'Pregunta eliminada exitosamente' })
  } catch (error: any) {
    return handleApiError(error, request)
  }
}
