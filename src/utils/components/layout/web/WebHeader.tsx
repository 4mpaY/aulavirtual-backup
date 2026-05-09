'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { LogIn } from 'lucide-react'

import { Button } from '@mui/material'

import UserDropdown from '@components/layout/shared/UserDropdown'
import { useAuthModal } from '@/contexts/AuthModalContext'
import CartIcon from '@/features/web/cart/components/CartIcon'

export interface Category {
  id: string
  nombre: string
  slug: string
}

export interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Cursos', href: '/cursos' },
]

export default function WebHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'

    return pathname.startsWith(href)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 gradient-visiona border-b border-white/5"
      style={{
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : '0 2px 20px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 lg:px-8">

        {/* ── Logo ─── */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/visiona/logo-visiona.png"
            alt="VISIONA"
            width={140}
            height={48}
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Nav desktop ─── */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide transition-colors duration-200"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: isActive(item.href) ? 'hsl(43 74% 49%)' : 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) e.currentTarget.style.color = 'hsl(43 74% 49%)'
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Right: Cart + Auth ─── */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Cart */}
          <div className="text-white/80 hover:text-white transition-colors">
            <CartIcon />
          </div>

          {session ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                onClick={() => openLogin()}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}
              >
                <LogIn size={15} />
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => openRegister()}
                variant="contained"
                size="small"
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: '#02115C',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { backgroundColor: '#0A50A1' },
                }}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Nav mobile (scroll horizontal, sin hamburguesa) ─── */}
      <div className="md:hidden overflow-x-auto border-t border-white/5">
        <nav className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: isActive(item.href) ? 'hsl(43 74% 49%)' : 'rgba(255,255,255,0.7)',
                backgroundColor: isActive(item.href) ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
