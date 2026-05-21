'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from '@mui/material'
import { useSession } from 'next-auth/react'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { useConfig } from '@/contexts/ConfigContext'

export interface Category {
  id: string
  nombre: string
  slug: string
}

interface WebHeaderProps {
  initialCategories?: Category[]
  platformName?: string
  platformSlogan?: string
}

export default function WebHeader({
  initialCategories = [],
  platformName = 'CEGAE RIBEYRO',
  platformSlogan = 'Te acompañamos en tu perfeccionamiento profesional',
}: WebHeaderProps) {
  void initialCategories
  void platformName
  void platformSlogan

  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()
  const configs = useConfig()

  void (configs.COLOR_PRIMARIO || '#02115C') // primaryColor reserved

  // ── Scroll-reveal: oculto en el top, visible al primer scroll ──
  const [visible, setVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Si la página ya no está en el top al montar (ej. reload con scroll), mostrar inmediatamente
    if (window.scrollY > 10) {
      setHasScrolled(true)
      setVisible(true)
    }

    const onScroll = () => {
      if (window.scrollY > 10 && !hasScrolled) {
        setHasScrolled(true)
        setVisible(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [hasScrolled])

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 'var(--navbar-height)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group no-underline">
        <Logo />
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link
          href="/"
          className="no-underline text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Inicio
        </Link>
        <Link
          href="/cursos"
          className="no-underline text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Cursos
        </Link>
        <Link
          href="/nosotros"
          className="no-underline text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Nosotros
        </Link>
        <Link
          href="/verificar-certificado"
          className="no-underline text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Certificados
        </Link>
        <Link
          href="/contacto"
          className="no-underline text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Contáctanos
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <CartIcon />
        {session ? (
          <UserDropdown />
        ) : (
          <>
            <Button
              onClick={() => openLogin()}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#02115C', fontFamily: 'Montserrat, sans-serif' }}
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => openRegister()}
              variant="contained"
              size="small"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '0.7rem',
                borderRadius: '8px',
                backgroundColor: '#1D71CA',
                color: '#FFFFFF',
                border: '1px solid #1D71CA',
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': { backgroundColor: '#2DA194', borderColor: '#2DA194' },
              }}
            >
              Registrarse
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
