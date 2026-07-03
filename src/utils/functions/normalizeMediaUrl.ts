/**
 * Normaliza URLs de archivos subidos a rutas relativas (/uploads/...)
 * para evitar errores cuando la URL guardada apunta a localhost:3000
 * pero el servidor corre en otro puerto.
 */
export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return ''

  const trimmed = url.trim()

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('/api/')) {
    return trimmed
  }

  try {
    const parsed = new URL(
      trimmed,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    )

    if (parsed.pathname.startsWith('/uploads/')) {
      return parsed.pathname
    }
  } catch {
    // URL relativa u otro formato — usar tal cual
  }

  return trimmed
}
