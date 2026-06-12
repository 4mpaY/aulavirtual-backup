export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/ebooks — Catálogo público de ebooks publicados
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const buscar = searchParams.get('buscar') ?? undefined
    const categoria_id = searchParams.get('categoria_id') ?? undefined

    const where: any = { estado: 'PUBLICADO' }
    if (categoria_id) where.categoria_id = categoria_id
    if (buscar) {
      where.OR = [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { autor: { contains: buscar, mode: 'insensitive' } },
      ]
    }

    const [ebooks, categorias] = await Promise.all([
      prisma.ebook.findMany({
        where,
        orderBy: { creado_en: 'desc' },
        select: {
          id: true, titulo: true, slug: true, descripcion: true,
          autor: true, miniatura: true, precio: true, precio_falso: true,
          moneda: true, es_gratis: true, paginas: true,
        },
      }),
      prisma.categoria.findMany({
        where: { esta_activo: true },
        select: { id: true, nombre: true },
        orderBy: { nombre: 'asc' },
      }),
    ])

    return NextResponse.json({ ebooks, categorias })
  } catch (error) {
    return handleApiError(error, request)
  }
}
