import { join } from 'path'
import { readFile } from 'fs/promises'

import { NextResponse } from 'next/server'

/**
 * Mapeo de extensiones a Content-Type para servir archivos correctamente
 */
const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mkv: 'video/x-matroska'
}

export async function GET(request: Request, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params
    const pathSegments = params.path

    const filePath = join(process.cwd(), 'public', 'uploads', ...pathSegments)

    // Obtener la extensión para el Content-Type
    const ext = pathSegments[pathSegments.length - 1]?.split('.').pop()?.toLowerCase() || ''
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'

    try {
      const fileBuffer = await readFile(filePath)

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return new NextResponse('Archivo no encontrado', { status: 404 })
      }

      throw error
    }
  } catch (error) {
    console.error('Error serving upload:', error)

    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}
