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

export function usePWAInstall() {
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Ya instalada como app standalone → ocultar el botón
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)

      return
    }

    // El evento puede haber disparado antes de que React montara
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

  // mounted evita el flash: SSR no muestra nada, el cliente decide
  return {
    canInstall: mounted && !isInstalled,
    hasNativePrompt: !!installPrompt,
    install,
  }
}
