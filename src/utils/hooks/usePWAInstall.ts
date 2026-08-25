'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent
  }
}

// Captura el evento al evaluar el módulo, ANTES de que React monte.
// Los módulos ES son singletons: este código corre una sola vez aunque
// el hook sea importado por múltiples componentes.
if (typeof window !== 'undefined') {
  window.addEventListener(
    'beforeinstallprompt',
    (e) => {
      e.preventDefault()
      window.__pwaInstallPrompt = e as BeforeInstallPromptEvent
    },
    { once: true },
  )
}

export function usePWAInstall() {
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)

      return
    }

    // El evento pudo haberse disparado antes de que React montara
    if (window.__pwaInstallPrompt) {
      setInstallPrompt(window.__pwaInstallPrompt)
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault()
      const evt = e as BeforeInstallPromptEvent

      window.__pwaInstallPrompt = evt
      setInstallPrompt(evt)
    }

    const handleInstalled = () => {
      window.__pwaInstallPrompt = undefined
      setInstallPrompt(null)
      setIsInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice

      if (outcome === 'accepted') {
        window.__pwaInstallPrompt = undefined
        setInstallPrompt(null)
        setIsInstalled(true)
      }
    }
  }

  return {
    canInstall: mounted && !isInstalled,
    hasNativePrompt: !!installPrompt,
    install,
  }
}
