'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home, BookOpen, Users, Award, MonitorSmartphone } from 'lucide-react'

import { usePWAInstall } from '@/utils/hooks/usePWAInstall'

import { isFeatureEnabled } from '@/utils/configs/projectFeatures'

const ALL_NAV_ITEMS = [
  { title: 'Inicio', url: '/', icon: Home, key: 'inicio' },
  { title: 'Cursos', url: '/cursos', icon: BookOpen, key: 'cursos' },

  // { title: 'Simulacros', url: '/simulacros', icon: ClipboardList, key: 'simulacros' },
  // { title: 'Ebooks', url: '/ebooks', icon: BookText, key: 'ebooks' },
  // { title: 'Rutas', url: '/rutas', icon: Map, key: 'rutas' },
  { title: 'Nosotros', url: '/nosotros', icon: Users, key: 'nosotros' },
  { title: 'Certificado', url: '/verificar-certificado', icon: Award, key: 'certificado' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { canInstall, hasNativePrompt, install } = usePWAInstall()
  const [showTip, setShowTip] = useState(false)

  const navItems = ALL_NAV_ITEMS

  const isActive = (url: string) => {
    if (url === '/') return pathname === '/'

    return pathname.startsWith(url)
  }

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
      {navItems.map(item => {
        const active = isActive(item.url)

        return (
          <Link
            key={item.title}
            href={item.url}
            className="no-underline flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            style={{ color: active ? 'var(--web-primary, #25927F)' : '#94a3b8' }}
          >
            <div
              className="flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: '36px',
                height: '28px',
                backgroundColor: active ? 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)' : 'transparent',
              }}
            >
              <item.icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.625rem',
                fontWeight: active ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {item.title}
            </span>
          </Link>
        )
      })}

      {canInstall && (
        <>
          <button
            onClick={() => { hasNativePrompt ? install() : setShowTip(t => !t) }}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--web-primary, #25927F)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl transition-all duration-200"
              style={{ width: '36px', height: '28px', backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)' }}
            >
              <MonitorSmartphone size={20} strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.625rem', fontWeight: 600, lineHeight: 1 }}>
              Instalar
            </span>
          </button>

          {showTip && !hasNativePrompt && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowTip(false)} />
              <div style={{ position: 'fixed', bottom: '72px', left: '50%', transform: 'translateX(-50%)', width: '280px', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid hsl(214,20%,91%)', zIndex: 50, padding: '14px 16px' }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', margin: '0 0 6px 0' }}>Instalar la aplicación</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  En Chrome Android: toca el menú <strong>⋮</strong> y selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.<br />
                  En Safari iOS: toca <strong>Compartir ↑</strong> y luego <strong>&quot;Agregar a inicio&quot;</strong>.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </nav>
  )
}
