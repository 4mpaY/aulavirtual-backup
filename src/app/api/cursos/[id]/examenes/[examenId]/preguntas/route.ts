import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/cursos/[id]/examenes/[examenId]/preguntas
 * Agregar una pregunta a un examen específico
 */
export async function POST(request: Request, { params }: { params: { id: string; examenId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, examenId } = params
    const body = await request.json()
    const { texto, tipo, puntos, opciones } = body

    if (!texto || !tipo || !opciones || !Array.isArray(opciones) || opciones.length === 0) {
      return ApiResponse.error(request, 'Faltan datos requeridos o las opciones son inválidas', 400)
    }

    const curso = await prisma.curso.findUnique({ where: { id: cursoId } })

    if (!curso) return ApiResponse.error(request, 'Curso no encontrado', 404)

    if (auth.user.rol === 'PROFESOR' && curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso', 403)
    }

    const examen = await prisma.examen.findUnique({ where: { id: examenId } })

    if (!examen || examen.curso_id !== cursoId) {
      return ApiResponse.error(request, 'Examen no encontrado', 404)
    }

    const maxOrden = await prisma.pregunta.aggregate({
      where: { examen_id: examenId },
      _max: { orden: true }
    })

    const nextOrden = (maxOrden._max.orden ?? 0) + 1

    const nuevaPregunta = await prisma.pregunta.create({
      data: {
        texto,
        tipo,
        puntos: Number(puntos || 1),
        orden: nextOrden,
        examen_id: examenId,
        opciones: {
          create: opciones.map((opt: any, index: number) => ({
            texto: opt.texto,
            es_correcta: Boolean(opt.es_correcta),
            orden: index + 1
          }))
        }
      },
      include: { opciones: { orderBy: { orden: 'asc' } } }
    })

    return ApiResponse.success(request, { pregunta: nuevaPregunta }, 201)
  } catch (error: any) {
    return handleApiError(error, request)
  }
}
