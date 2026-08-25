import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import sharp from 'sharp'

const BRANDING_DIR = join(process.cwd(), 'public', 'uploads', 'branding')
const ICONS_DIR = join(process.cwd(), 'public', 'icons')
const FAVICON_PUBLIC_PATH = '/uploads/branding/site-favicon.png'

const PWA_ICONS: { file: string; size: number }[] = [
  { file: 'icon-192x192.png', size: 192 },
  { file: 'icon-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

function resolvePublicPath(url: string): string {
  const normalized = url.startsWith('/') ? url.slice(1) : url

  return join(process.cwd(), 'public', normalized)
}

/**
 * Genera el favicon de pestaña (32×32) y los íconos de instalación PWA
 * (192, 512, apple-touch-icon) a partir de la misma imagen fuente, para que
 * el ícono usado al "instalar/descargar" la app quede siempre sincronizado.
 */
export async function syncFaviconFromUrl(sourceUrl: string): Promise<string> {
  if (!sourceUrl?.trim()) {
    throw new Error('URL de favicon inválida')
  }

  const sourcePath = resolvePublicPath(sourceUrl)
  const sourceBuffer = await readFile(sourcePath)

  await mkdir(BRANDING_DIR, { recursive: true })
  await mkdir(ICONS_DIR, { recursive: true })

  const faviconBuffer = await sharp(sourceBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer()

  await writeFile(join(BRANDING_DIR, 'site-favicon.png'), faviconBuffer)

  await Promise.all(
    PWA_ICONS.map(async ({ file, size }) => {
      const buffer = await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer()

      await writeFile(join(ICONS_DIR, file), buffer)
    })
  )

  return FAVICON_PUBLIC_PATH
}

export function getDefaultFaviconPath(): string {
  return FAVICON_PUBLIC_PATH
}

export function resolveFaviconUrl(configs: Record<string, string>): string {
  // Solo usar el favicon personalizado si existe y no está vacío
  if (configs.SITE_FAVICON && configs.SITE_FAVICON.trim().length > 0) {
    return FAVICON_PUBLIC_PATH
  }

  // Por defecto usar el favicon.ico de public/
  return '/favicon.ico'
}
