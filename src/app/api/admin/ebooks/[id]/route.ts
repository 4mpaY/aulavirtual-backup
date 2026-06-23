export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError, validateRequest } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { actualizarEbookSchema } from '@/schemas/ebook.schema'

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
    const validation = validateRequest(actualizarEbookSchema, body, request)

    if (!validation.success) return validation.error

    const {
      titulo,
      descripcion,
      resena,
      autor,
      miniatura,
      archivo_pdf,
      precio,
      precio_falso,
      moneda,
      es_gratis,
      paginas,
      genero,
      categoria_id,
      estado,
      editorial,
      anio_edicion,
      saga,
      idioma,
    } = validation.data

    const ebook = await prisma.ebook.update({
      where: { id: params.id },
      data: {
        titulo: titulo?.trim(),
        descripcion: descripcion !== undefined ? descripcion?.trim() || null : undefined,
        resena: resena !== undefined ? resena?.trim() || null : undefined,
        autor: autor !== undefined ? autor?.trim() || null : undefined,
        miniatura: miniatura !== undefined ? miniatura || null : undefined,
        ...(archivo_pdf && { archivo_pdf }),
        precio,
        precio_falso,
        moneda,
        es_gratis,
        paginas: paginas !== undefined ? paginas ?? null : undefined,
        genero: genero !== undefined ? genero?.trim() || null : undefined,
        categoria_id: categoria_id !== undefined ? categoria_id || null : undefined,
        estado,
        editorial: editorial !== undefined ? editorial?.trim() || null : undefined,
        anio_edicion: anio_edicion !== undefined ? anio_edicion ?? null : undefined,
        saga: saga !== undefined ? saga?.trim() || null : undefined,
        idioma: idioma !== undefined ? idioma?.trim() || null : undefined,
      },
    })

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
