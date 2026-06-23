export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError, validateRequest } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { generateUniqueSlug } from '@/utils/libs/slug'
import { crearEbookSchema } from '@/schemas/ebook.schema'

/**
 * GET /api/admin/ebooks — Listado completo (admin)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { searchParams } = new URL(request.url)
    const buscar = searchParams.get('buscar') ?? undefined
    const estado = searchParams.get('estado') ?? undefined

    const where: any = {}

    if (estado) where.estado = estado

    if (buscar) {
      where.OR = [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { autor: { contains: buscar, mode: 'insensitive' } },
      ]
    }

    const ebooks = await prisma.ebook.findMany({
      where,
      orderBy: { creado_en: 'desc' },
      include: {
        _count: { select: { accesos: true } },
      },
    })

    return NextResponse.json({ ebooks })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/ebooks — Crear ebook
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()
    const validation = validateRequest(crearEbookSchema, body, request)

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

    const slug = await generateUniqueSlug(titulo, prisma.ebook)

    const ebook = await prisma.ebook.create({
      data: {
        titulo: titulo.trim(),
        slug,
        descripcion: descripcion?.trim() || null,
        resena: resena?.trim() || null,
        autor: autor?.trim() || null,
        miniatura: miniatura || null,
        archivo_pdf,
        precio,
        precio_falso,
        moneda,
        es_gratis,
        paginas: paginas ?? null,
        genero: genero?.trim() || null,
        categoria_id: categoria_id || null,
        estado,
        editorial: editorial?.trim() || null,
        anio_edicion: anio_edicion ?? null,
        saga: saga?.trim() || null,
        idioma: idioma?.trim() || null,
      },
    })

    return NextResponse.json({ ebook }, { status: 201 })
  } catch (error) {
    return handleApiError(error, request)
  }
}
