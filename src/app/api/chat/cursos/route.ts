export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { id: userId, rol } = auth.user

    if (rol === 'PROFESOR') {
      const cursos = await prisma.curso.findMany({
        where: { profesor_id: userId },
        select: { id: true, titulo: true },
        orderBy: { titulo: 'asc' }
      })

      return ApiResponse.success(request, cursos)
    }

    if (rol === 'ESTUDIANTE') {
      const inscripciones = await prisma.inscripcion.findMany({
        where: { usuario_id: userId },
        include: { curso: { select: { id: true, titulo: true } } },
        orderBy: { curso: { titulo: 'asc' } }
      })

      const cursos = inscripciones.map(i => ({ id: i.curso.id, titulo: i.curso.titulo }))

      return ApiResponse.success(request, cursos)
    }

    return ApiResponse.success(request, [])
  } catch (error) {
    return handleApiError(error, request)
  }
}
