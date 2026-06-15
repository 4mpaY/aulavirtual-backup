export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'

/**
 * GET /api/estudiante/ebooks — Ebooks a los que el estudiante tiene acceso
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const accesos = await prisma.ebookAcceso.findMany({
      where: { usuario_id: auth.user.id },
      orderBy: { creado_en: 'desc' },
      include: {
        ebook: {
          select: {
            id: true,
            titulo: true,
            slug: true,
            descripcion: true,
            autor: true,
            miniatura: true,
            paginas: true,
          },
        },
      },
    })

    const ebooks = accesos.map(a => a.ebook)

    return ApiResponse.success(request, { ebooks })
  } catch (error) {
    return handleApiError(error, request)
  }
}
