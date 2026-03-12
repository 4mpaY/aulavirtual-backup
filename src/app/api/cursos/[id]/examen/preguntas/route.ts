import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: cursoId } = params
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

    // Get the exam for this course
    const examen = await prisma.examen.findFirst({
      where: { curso_id: cursoId }
    })

    if (!examen) {
       return ApiResponse.error(request, 'Primero debe crear la configuración inicial del examen', 404)
    }

    // Determine the next order number
    const maxOrden = await prisma.pregunta.aggregate({
      where: { examen_id: examen.id },
      _max: { orden: true }
    })
    const nextOrden = (maxOrden._max.orden || 0) + 1

    // Create question and its options in a transaction
    const nuevaPregunta = await prisma.pregunta.create({
      data: {
        texto,
        tipo,
        puntos: Number(puntos || 1),
        orden: nextOrden,
        examen_id: examen.id,
        opciones: {
          create: opciones.map((opt: any, index: number) => ({
            texto: opt.texto,
            es_correcta: Boolean(opt.es_correcta),
            orden: index + 1
          }))
        }
      },
      include: {
        opciones: true
      }
    })

    return ApiResponse.success(request, { pregunta: nuevaPregunta, message: 'Pregunta agregada exitosamente' }, 201)
  } catch (error: any) {
    return handleApiError(error, request)
  }
}
