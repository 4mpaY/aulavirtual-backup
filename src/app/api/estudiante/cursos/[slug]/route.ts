export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { verify } from 'jsonwebtoken'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { CourseNotFoundError, UnenrolledError, getPlayerCourseData } from '@/features/estudiante/player/server/getPlayerCourseData'

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

    const data = await getPlayerCourseData(user, slug)

    return ApiResponse.success(request, data)
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    if (error instanceof UnenrolledError) {
      return NextResponse.json(
        {
          status: false,
          code: 'UNCISCRIBED',
          message: 'No tienes acceso a este curso',
          statusCode: 403,
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      )
    }

    return handleApiError(error, request)
  }
}
