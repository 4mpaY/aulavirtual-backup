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

  interface Navigator {
    standalone?: boolean
  }
}

type Platform = 'ios' | 'android' | 'desktop'

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

function detectPlatform(ua: string): Platform {
  // iPadOS 13+ en modo escritorio se identifica como Mac con soporte táctil
  const isIPadOS = /Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1

  if (/iPhone|iPad|iPod/.test(ua) || isIPadOS) return 'ios'
  if (/Android/.test(ua)) return 'android'

  return 'desktop'
}

function detectIsSafari(ua: string): boolean {
  // En iOS, Chrome/Firefox/Edge usan WebKit pero se identifican con CriOS/FxiOS/EdgiOS
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
}

function detectIsInAppBrowser(ua: string): boolean {
  return /Instagram|FBAN|FBAV|Line\/|TikTok|MicroMessenger|WhatsApp/.test(ua)
}

export function usePWAInstall() {
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [isSafari, setIsSafari] = useState(false)
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)

  useEffect(() => {
    setMounted(true)

    const ua = window.navigator.userAgent

    setPlatform(detectPlatform(ua))
    setIsSafari(detectIsSafari(ua))
    setIsInAppBrowser(detectIsInAppBrowser(ua))

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
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
    platform,
    isSafari,
    isInAppBrowser,
  }
}
