export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { verify } from 'jsonwebtoken'

import { getAuthSession } from '@/utils/libs/auth-helpers'

import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    let user: any = null

    // 1. Intentar obtener sesión por cookies (NextAuth estándar)
    const session = await getAuthSession()

    if (session) {
      user = session.user
    } else {
      // 2. Si no hay sesión, intentar obtener token del header Authorization (Bearer)
      // Esto es necesario para llamadas servidor-servidor desde Server Components
      const authHeader = request.headers.get('Authorization')

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]

        try {
          const decoded = verify(token, JWT_SECRET) as any

          if (decoded) {
            user = decoded
          }
        } catch (err) {
          console.error('Error al verificar token Bearer:', err)
        }
      }
    }

    if (!user) {
      return ApiResponse.error(request, 'No autorizado', 401)
    }

    const { slug } = params

    const course = await prisma.curso.findUnique({
      where: { slug },
      include: {
        modulos: {
          include: {
            lecciones: {
              include: {
                progreso: {
                  where: { usuario_id: user.id }
                }
              },
              orderBy: { orden: 'asc' }
            }
          },
          orderBy: { orden: 'asc' }
        },
        examenes: {
          select: {
            id: true,
            titulo: true,
            esta_publicado: true
          }
        }
      }
    })

    if (!course) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    const isAdmin = user.rol === 'ADMIN'
    const isCourseProfessor = user.rol === 'PROFESOR' && course.profesor_id === user.id

    if (!isAdmin && !isCourseProfessor) {
      const inscription = await prisma.inscripcion.findUnique({
        where: {
          usuario_id_curso_id: {
            usuario_id: user.id,
            curso_id: course.id
          }
        }
      })

      if (!inscription || inscription.estado !== 'ACTIVO') {
        return NextResponse.json(
          {
            status: false,
            code: 'UNCISCRIBED',
            message: 'Usuario no matriculado',
            statusCode: 403,
            timestamp: new Date().toISOString()
          },
          { status: 403 }
        )
      }
    }

    const formattedCourse = {
      id: course.id,
      titulo: course.titulo,
      modulos: course.modulos.map(m => ({
        id: m.id,
        titulo: m.titulo,
        orden: m.orden,
        lecciones: m.lecciones
          .filter(l => l.estado === 'PUBLICADO')
          .map(l => ({
            id: l.id,
            titulo: l.titulo,
            contenido: l.contenido,
            orden: l.orden,
            video_url: l.video_url,
            es_en_vivo: (l as any).es_en_vivo,
            fecha_programada: (l as any).fecha_programada,
            enlace_reunion: (l as any).enlace_reunion,
            completada: l.progreso[0]?.esta_completado || false,
            recursos: Array.isArray(l.recursos) ? l.recursos : []
          }))
      })),
      examenes: course.examenes
    }

    return ApiResponse.success(request, { course: formattedCourse })
  } catch (error) {
    return handleApiError(error, request)
  }
}
