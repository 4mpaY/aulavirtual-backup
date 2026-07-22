'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

import Link from 'next/link'

import { useSession } from 'next-auth/react'

import { LogIn, User, MonitorSmartphone } from 'lucide-react'

import { useAuthModal } from '@/contexts/AuthModalContext'
import { usePWAInstall } from '@/utils/hooks/usePWAInstall'
import PWAInstallTip from '@/utils/components/shared/PWAInstallTip'

export default function MobileBottomNav() {
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const { canInstall, hasNativePrompt, install } = usePWAInstall()
  const [showInstallTip, setShowInstallTip] = useState(false)

  const itemStyle = (active: boolean): CSSProperties => ({
    color: active ? 'var(--web-primary, #25927F)' : '#94a3b8',
  })

  const iconBoxStyle = (active: boolean): CSSProperties => ({
    width: '36px',
    height: '28px',
    backgroundColor: active ? 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)' : 'transparent',
  })

  const labelStyle = (active: boolean): CSSProperties => ({
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.625rem',
    fontWeight: active ? 700 : 500,
    lineHeight: 1,
  })

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around sm:hidden z-50"
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid hsl(214, 20%, 88%)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {session?.user ? (
        <Link
          href="/perfil"
          className="no-underline flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
          style={itemStyle(false)}
        >
          <div className="flex items-center justify-center rounded-xl transition-all duration-200" style={iconBoxStyle(false)}>
            <User size={20} strokeWidth={1.8} />
          </div>
          <span style={labelStyle(false)}>Mi Cuenta</span>
        </Link>
      ) : (
        <button
          onClick={() => openLogin()}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors border-none bg-transparent cursor-pointer"
          style={itemStyle(false)}
        >
          <div className="flex items-center justify-center rounded-xl transition-all duration-200" style={iconBoxStyle(false)}>
            <LogIn size={20} strokeWidth={1.8} />
          </div>
          <span style={labelStyle(false)}>Iniciar Sesión</span>
        </button>
      )}

      {canInstall && (
        <div className="relative flex-1 h-full">
          <button
            onClick={() => (hasNativePrompt ? install() : setShowInstallTip(t => !t))}
            className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors border-none bg-transparent cursor-pointer"
            style={itemStyle(false)}
          >
            <div className="flex items-center justify-center rounded-xl transition-all duration-200" style={iconBoxStyle(false)}>
              <MonitorSmartphone size={20} strokeWidth={1.8} />
            </div>
            <span style={labelStyle(false)}>Instalar App</span>
          </button>

          {showInstallTip && !hasNativePrompt && (
            <PWAInstallTip
              onClose={() => setShowInstallTip(false)}
              style={{ position: 'fixed', top: 'auto', bottom: '72px', right: '12px', left: 'auto', width: '280px' }}
            />
          )}
        </div>
      )}
    </nav>
  )
}
