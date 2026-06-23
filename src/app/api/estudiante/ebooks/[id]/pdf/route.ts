export const dynamic = 'force-dynamic'

import { readFile } from 'fs/promises'
import path from 'path'

import { NextResponse } from 'next/server'

import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'

/**
 * GET /api/estudiante/ebooks/[id]/pdf
 * Sirve el PDF del ebook de forma segura (inline, sin descarga).
 * Solo accesible para usuarios autenticados con EbookAcceso registrado.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const ebook = await prisma.ebook.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        estado: 'PUBLICADO',
      },
      select: { id: true, titulo: true, archivo_pdf: true },
    })

    if (!ebook) return NextResponse.json({ error: 'Ebook no encontrado' }, { status: 404 })

    const acceso = await prisma.ebookAcceso.findUnique({
      where: { usuario_id_ebook_id: { usuario_id: auth.user.id, ebook_id: ebook.id } },
    })

    if (!acceso && auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes acceso a este ebook' }, { status: 403 })
    }

    const pdfPath = ebook.archivo_pdf

    let pdfBuffer: Buffer

    if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
      const res = await fetch(pdfPath)

      if (!res.ok) return NextResponse.json({ error: 'No se pudo obtener el archivo' }, { status: 502 })
      pdfBuffer = Buffer.from(await res.arrayBuffer())
    } else {
      // Paths from /api/media are relative URLs like /uploads/cursos/file.pdf
      // path.isAbsolute('/uploads/...') returns true on Windows (/ is a path separator)
      // but the actual file lives under public/ — always join with cwd/public
      const absPath = path.join(process.cwd(), 'public', pdfPath)

      pdfBuffer = await readFile(absPath)
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
