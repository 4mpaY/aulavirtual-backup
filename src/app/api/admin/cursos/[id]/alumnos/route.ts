import { NextResponse } from 'next/server'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * GET /api/admin/cursos/[id]/alumnos
 * Obtiene los alumnos inscritos en un curso, con opción de búsqueda
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const cursoId = params.id

    // Validar existencia del curso
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    const where: any = {
      curso_id: cursoId,
    }

    if (search) {
      where.usuario = {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { apellido: { contains: search, mode: 'insensitive' } },
          { numero_documento: { contains: search } },
          { correo: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            numero_documento: true,
            avatar: true
          }
        }
      },
      orderBy: { inscrito_en: 'desc' }
    })

    const alumnos = inscripciones.map(i => ({
      id: i.usuario.id,
      nombre: i.usuario.nombre,
      apellido: i.usuario.apellido,
      correo: i.usuario.correo,
      numero_documento: i.usuario.numero_documento,
      avatar: i.usuario.avatar,
      estado_inscripcion: i.estado,
      inscrito_en: i.inscrito_en,
      completado_en: i.completado_en
    }))

    return ApiResponse.success(request, { alumnos, total: alumnos.length })
  } catch (error) {
    return handleApiError(error, request)
  }
}
