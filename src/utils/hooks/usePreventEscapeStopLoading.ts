'use client'

import { useEffect } from 'react'

/**
 * Evita que Escape cancele cargas en curso (navegación RSC, fetch, etc.).
 * En algunos navegadores Escape interrumpe peticiones activas y deja la UI colgada.
 */
export function usePreventEscapeStopLoading(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })

    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [enabled])
}
