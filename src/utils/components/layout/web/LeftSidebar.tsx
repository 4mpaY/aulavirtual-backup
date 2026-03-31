'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home, BookOpen, Users, Award, Map, Building2 } from 'lucide-react'

const navItems = [
  { title: 'Inicio', url: '/', icon: Home },
  { title: 'Cursos', url: '/cursos', icon: BookOpen },
  { title: 'Rutas', url: '/rutas', icon: Map },
  { title: 'Empresas', url: '/empresas', icon: Building2 },
  { title: 'Nosotros', url: '/nosotros', icon: Users },
  { title: 'Certificado', url: '/verificar-certificado', icon: Award },
]

export default function LeftSidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  const isActive = (url: string) => {
    if (url === '/') return pathname === '/'

    return pathname.startsWith(url)
  }

  return (
    <aside
      className="fixed left-0 bottom-0 flex flex-col items-start py-6 gap-1 overflow-hidden shadow-xl transition-all duration-300 ease-in-out"
      style={{
        top: 'var(--navbar-height)',
        width: expanded ? 'var(--sidebar-width-expanded)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--web-dark, #025E44)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        zIndex: 40,
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {navItems.map(item => {
        const active = isActive(item.url)

        return (
          <Link
            key={item.title}
            href={item.url}
            className="no-underline flex items-center w-full px-4 transition-colors duration-200 relative"
            style={{
              height: '56px',
              color: active ? 'var(--web-light, #BDD962)' : '#ffffff',
              fontWeight: active ? 700 : 500,
              backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
            onMouseEnter={e => {
              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={e => {
              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            {/* Active indicator bar */}
            {active && (
              <div
                className="absolute left-0 rounded-r-full"
                style={{ width: '4px', height: '32px', backgroundColor: 'var(--web-light, #BDD962)' }}
              />
            )}

            {/* Icon container */}
            <div
              className="flex items-center justify-center rounded-xl transition-all flex-shrink-0"
              style={{
                minWidth: '48px',
                height: '48px',
                backgroundColor: active ? 'var(--web-light, #BDD962)' : 'transparent',
                color: active ? '#0A0A0A' : 'inherit',
                boxShadow: active ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              <item.icon style={{ width: '22px', height: '22px' }} />
            </div>

            {/* Label — visible when expanded */}
            <span
              className="ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
              style={{
                fontFamily: 'Poppins, sans-serif',
                opacity: expanded ? 1 : 0,
                maxWidth: expanded ? '180px' : '0px',
                transition: 'opacity 0.2s, max-width 0.3s',
              }}
            >
              {item.title}
            </span>
          </Link>
        )
      })}

      {/* Status badge at bottom */}
      <div
        className="mt-auto px-4 w-full"
        style={{
          paddingBottom: '24px',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            Estado
          </p>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>
            Sistema Activo
          </p>
        </div>
      </div>
    </aside>
  )
}
