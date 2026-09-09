export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/ebooks/[id] — Detalle público por slug o id
 */
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const { id } = params

    const ebook = await prisma.ebook.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        estado: 'PUBLICADO',
      },
      select: {
        id: true, titulo: true, slug: true, descripcion: true,
        autor: true, miniatura: true, precio: true, precio_falso: true,
        moneda: true, es_gratis: true, paginas: true,
        _count: { select: { accesos: true } },
      },
    })

    if (!ebook) return NextResponse.json({ error: 'Ebook no encontrado' }, { status: 404 })

    return NextResponse.json({ ebook })
  } catch (error) {
    return handleApiError(error, request)
  }
}
