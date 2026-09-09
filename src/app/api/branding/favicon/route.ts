import { readFile } from 'fs/promises'
import { join } from 'path'

import { NextResponse } from 'next/server'

import { resolveFaviconUrl } from '@/utils/functions/resolveFavicon'

export const dynamic = 'force-dynamic'

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  ico: 'image/x-icon',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
}

async function readPublicFile(relativePath: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const clean = relativePath.replace(/^\//, '')
  const ext = clean.split('.').pop()?.toLowerCase() || 'png'
  const filePath = join(process.cwd(), 'public', clean)

  try {
    const buffer = await readFile(filePath)

    return { buffer, contentType: CONTENT_TYPES[ext] || 'application/octet-stream' }
  } catch {
    return null
  }
}

export async function GET() {
  const faviconUrl = resolveFaviconUrl()
  const candidates = [faviconUrl, '/favicon.ico'].filter(Boolean)

  for (const path of candidates) {
    const file = await readPublicFile(path)

    if (file) {
      return new NextResponse(file.buffer, {
        headers: {
          'Content-Type': file.contentType,
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      })
    }
  }

  return new NextResponse('Favicon no encontrado', { status: 404 })
}
