import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import sharp from 'sharp'

const BRANDING_DIR = join(process.cwd(), 'public', 'uploads', 'branding')
const FAVICON_PUBLIC_PATH = '/uploads/branding/site-favicon.png'

function resolvePublicPath(url: string): string {
  const normalized = url.startsWith('/') ? url.slice(1) : url

  return join(process.cwd(), 'public', normalized)
}

/**
 * Genera un favicon optimizado (32×32 PNG) a partir de una imagen subida.
 * El archivo se guarda en public/uploads/branding (volumen persistente en Docker).
 */
export async function syncFaviconFromUrl(sourceUrl: string): Promise<string> {
  if (!sourceUrl?.trim()) {
    throw new Error('URL de favicon inválida')
  }

  const sourcePath = resolvePublicPath(sourceUrl)
  const sourceBuffer = await readFile(sourcePath)

  await mkdir(BRANDING_DIR, { recursive: true })

  const faviconBuffer = await sharp(sourceBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer()

  await writeFile(join(BRANDING_DIR, 'site-favicon.png'), faviconBuffer)

  return FAVICON_PUBLIC_PATH
}

export function getDefaultFaviconPath(): string {
  return FAVICON_PUBLIC_PATH
}

export function resolveFaviconUrl(configs: Record<string, string>): string {
  return '/favicon.jpg'
}
