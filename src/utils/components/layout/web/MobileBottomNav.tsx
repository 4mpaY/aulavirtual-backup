'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home, BookOpen, Users, Award, Map, BookText } from 'lucide-react'

const ALL_NAV_ITEMS = [
  { title: 'Inicio', url: '/', icon: Home, key: 'inicio' },
  { title: 'Cursos', url: '/cursos', icon: BookOpen, key: 'cursos' },
  { title: 'Ebooks', url: '/ebooks', icon: BookText, key: 'ebooks' },
  { title: 'Rutas', url: '/rutas', icon: Map, key: 'rutas' },
  { title: 'Nosotros', url: '/nosotros', icon: Users, key: 'nosotros' },
  { title: 'Certificado', url: '/verificar-certificado', icon: Award, key: 'certificado' },
]

export default function MobileBottomNav({
  rutasHabilitado = true,
}: {
  rutasHabilitado?: boolean
}) {
  const pathname = usePathname()

  const navItems = ALL_NAV_ITEMS.filter(item => {
    if (item.key === 'rutas' && !rutasHabilitado) return false

    return true
  })

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
    </nav>
  )
}
