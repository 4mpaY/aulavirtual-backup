export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { user } = auth

    const inscriptions = await prisma.inscripcion.findMany({
      where: {
        usuario_id: user.id,
        estado: 'ACTIVO'
      },
      include: {
        curso: {
          include: {
            profesor: {
              select: { nombre: true, apellido: true }
            },
            categoria: {
              select: { nombre: true }
            },
            progreso: {
              where: { usuario_id: user.id }
            }
          }
        }
      }
    })

    const courses = inscriptions.map(ins => ({
      id: ins.curso.id,
      titulo: ins.curso.titulo,
      slug: ins.curso.slug,
      miniatura: ins.curso.miniatura ?? undefined,
      profesor: ins.curso.profesor,
      categoria: ins.curso.categoria?.nombre,
      progreso: ins.curso.progreso[0]?.porcentaje_progreso || 0
    }))

    return ApiResponse.success(request, { courses })
  } catch (error) {
    return handleApiError(error, request)
  }
}
