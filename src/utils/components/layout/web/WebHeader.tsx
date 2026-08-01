'use client'

import { useState } from 'react'

import { Button, IconButton } from '@mui/material'
import { useSession } from 'next-auth/react'
import { Menu } from 'lucide-react'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'
import MobileNavDrawer from '@/utils/components/layout/web/MobileNavDrawer'
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
  empresasHabilitado?: boolean
}

export default function WebHeader({ initialCategories = [], platformName = 'Aula Virtual', platformSlogan = 'Aprende sin límites', empresasHabilitado = true }: WebHeaderProps) {
  void initialCategories
  void platformName
  void platformSlogan
  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()
  const configs = useConfig()
  const primaryColor = configs.COLOR_PRIMARIO || '#02115C'
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-50 flex items-center justify-between px-6 md:px-10"
      style={{ height: 'var(--navbar-height)' }}
    >
      {/* Logo */}
      <Logo />

      {/* Right side */}
      <div className="flex items-center gap-3">

        <CartIcon />
        {session ? (
          <UserDropdown />
        ) : (
          <>
            <Button
              onClick={() => openLogin()}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700, fontSize: '0.9rem', color: '#02115C', fontFamily: 'Inter, sans-serif' }}
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => openRegister()}
              variant="contained"
              size="small"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: '8px',
                backgroundColor: primaryColor,
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': { backgroundColor: primaryColor, opacity: 0.85 },
              }}
            >
              Registrarse
            </Button>
          </>
        )}

        <IconButton
          onClick={() => setNavOpen(true)}
          aria-label="Abrir menú"
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
            color: '#02115C',
          }}
        >
          <Menu size={26} />
        </IconButton>
      </div>

      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)} empresasHabilitado={empresasHabilitado} />
    </header>
  )
}
