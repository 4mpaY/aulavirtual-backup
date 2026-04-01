'use client'

import Link from 'next/link'

import { Button } from '@mui/material'
import { useSession } from 'next-auth/react'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'

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

export default function WebHeader({ initialCategories = [], platformName = 'Aula Virtual', platformSlogan = 'Aprende sin límites' }: WebHeaderProps) {
  void initialCategories
  const { data: session } = useSession()

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-50 flex items-center justify-between px-6 md:px-10"
      style={{ height: 'var(--navbar-height)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group no-underline">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden sm:flex flex-col">
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#0A0A0A',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {platformName}
            </span>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.625rem',
                color: 'var(--web-dark, #025E44)',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              {platformSlogan}
            </span>
          </div>
        </div>
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <CartIcon />
        {session ? (
          <UserDropdown />
        ) : (
          <>
            <Button
              component={Link}
              href="/login"
              variant="text"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#0A0A0A',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'hsl(75, 63%, 62%, 0.2)' },
              }}
            >
              Iniciar sesión
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '0.9375rem',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: 'var(--web-primary, #25927F)',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(var(--web-primary-rgb, 37, 146, 127),0.3)',
                borderBottom: '4px solid rgba(var(--web-dark-rgb, 2, 94, 68),0.3)',
                '&:hover': { backgroundColor: '#1e7a6a' },
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
