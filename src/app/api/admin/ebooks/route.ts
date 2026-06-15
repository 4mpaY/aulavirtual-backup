export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { generateUniqueSlug } from '@/utils/libs/slug'

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
    const { titulo, descripcion, autor, miniatura, archivo_pdf, precio, precio_falso, moneda, es_gratis, paginas, genero, categoria_id, estado } = body

    if (!titulo?.trim()) return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })
    if (!archivo_pdf?.trim()) return NextResponse.json({ error: 'El archivo PDF es requerido' }, { status: 400 })

    const slug = await generateUniqueSlug(titulo, prisma.ebook)

    const ebook = await prisma.ebook.create({
      data: {
        titulo: titulo.trim(),
        slug,
        descripcion: descripcion?.trim() || null,
        autor: autor?.trim() || null,
        miniatura: miniatura || null,
        archivo_pdf,
        precio: precio ?? 0,
        precio_falso: precio_falso ?? 0,
        moneda: moneda || 'PEN',
        es_gratis: es_gratis ?? false,
        paginas: paginas ? Number(paginas) : null,
        categoria_id: categoria_id || null,
        estado: estado || 'BORRADOR',
      },
    })

    // genero se setea con raw SQL hasta que el cliente Prisma sea regenerado
    const generoVal = genero?.trim() || null

    await prisma.$executeRaw`UPDATE ebooks SET genero = ${generoVal} WHERE id = ${ebook.id}`

    return NextResponse.json({ ebook: { ...ebook, genero: generoVal } }, { status: 201 })
  } catch (error) {
    return handleApiError(error, request)
  }
}
