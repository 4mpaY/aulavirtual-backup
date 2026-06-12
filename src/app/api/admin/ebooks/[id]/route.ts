export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const ebook = await prisma.ebook.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { accesos: true } },
      },
    })

    if (!ebook) return ApiResponse.error(request, 'Ebook no encontrado', 404)

    return ApiResponse.success(request, { ebook })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const body = await request.json()
    const { titulo, descripcion, autor, miniatura, archivo_pdf, precio, precio_falso, moneda, es_gratis, paginas, genero, categoria_id, estado } = body

    const ebook = await prisma.ebook.update({
      where: { id: params.id },
      data: {
        titulo: titulo?.trim(),
        descripcion: descripcion?.trim() || null,
        autor: autor?.trim() || null,
        miniatura: miniatura || null,
        ...(archivo_pdf && { archivo_pdf }),
        precio: precio !== undefined ? precio : undefined,
        precio_falso: precio_falso !== undefined ? precio_falso : undefined,
        moneda: moneda || undefined,
        es_gratis: es_gratis !== undefined ? es_gratis : undefined,
        paginas: paginas !== undefined ? (paginas ? Number(paginas) : null) : undefined,
        categoria_id: categoria_id !== undefined ? (categoria_id || null) : undefined,
        estado: estado || undefined,
      },
    })

    // genero se actualiza con raw SQL hasta que el cliente Prisma sea regenerado
    if (genero !== undefined) {
      const generoVal = genero?.trim() || null

      await prisma.$executeRaw`UPDATE ebooks SET genero = ${generoVal} WHERE id = ${params.id}`

      return ApiResponse.success(request, { ebook: { ...ebook, genero: generoVal } })
    }

    return ApiResponse.success(request, { ebook })
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    await prisma.ebook.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Ebook eliminado' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
