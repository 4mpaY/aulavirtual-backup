'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { Menu, X, Home, BookOpen, Users, Award, Building2, LogIn, UserPlus } from 'lucide-react'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'
import CurrencyToggle from '@components/layout/shared/CurrencyToggle'
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

const MOBILE_NAV_ITEMS = [
  { title: 'Inicio', url: '/', icon: Home, key: 'inicio' },
  { title: 'Cursos', url: '/cursos', icon: BookOpen, key: 'cursos' },
  { title: 'Nosotros', url: '/nosotros', icon: Users, key: 'nosotros' },
  { title: 'Certificado', url: '/verificar-certificado', icon: Award, key: 'certificado' },
  { title: 'Empresas', url: '/empresas', icon: Building2, key: 'empresas' },
]

export default function WebHeader({
  initialCategories = [],
  platformName = 'Aula Virtual',
  platformSlogan = 'Aprende sin límites',
  empresasHabilitado = true,
}: WebHeaderProps) {
  void initialCategories
  void platformName
  void platformSlogan
  const { openLogin, openRegister } = useAuthModal()
  const { data: session } = useSession()
  const configs = useConfig()
  const multiMonedaHabilitado = configs.WEB_MULTIMONEDA_HABILITADO === 'true'
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = MOBILE_NAV_ITEMS.filter(item => item.key !== 'empresas' || empresasHabilitado)

  const isActive = (url: string) => {
    if (url === '/') return pathname === '/'

    return pathname.startsWith(url)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 shadow-sm z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--web-dark, #025E44)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Left side: hamburger (mobile only) + Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMobileMenuOpen(true)}
          className="sm:hidden flex items-center justify-center"
          style={{ width: '36px', height: '36px', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
        <Logo enlargeSquare />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {multiMonedaHabilitado && (
          <div className="hidden sm:flex">
            <CurrencyToggle />
          </div>
        )}
        <CartIcon />
        <UserDropdown
          dark
          showCurrencyToggle={multiMonedaHabilitado}
          onLoginClick={() => openLogin()}
          onRegisterClick={() => openRegister()}
        />
      </div>

      {/* Mobile menu: backdrop + slide-in panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 60 }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '78%',
              maxWidth: '300px',
              backgroundColor: 'var(--web-dark, #025E44)',
              zIndex: 61,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
            }}
          >
            <div
              className="flex items-center justify-between px-4"
              style={{ height: 'var(--navbar-height)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Logo enlargeSquare />
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: '36px', height: '36px', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col py-3">
              {navItems.map(item => {
                const active = isActive(item.url)

                return (
                  <Link
                    key={item.key}
                    href={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className="no-underline flex items-center gap-3 px-4"
                    style={{
                      height: '52px',
                      color: active ? 'var(--web-light, #BDD962)' : '#ffffff',
                      fontWeight: active ? 700 : 500,
                      backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >
                    <item.icon size={20} />
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>{item.title}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Cuenta: login/registro o dropdown de usuario */}
            <div
              style={{
                marginTop: 'auto',
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {session ? (
                <div className="flex items-center justify-center">
                  <UserDropdown dark />
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openLogin()
                    }}
                    className="flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                    style={{
                      height: '48px',
                      borderRadius: '999px',
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      color: '#ffffff',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    <LogIn size={17} />
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openRegister()
                    }}
                    className="flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      height: '48px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: 'var(--web-light, #BDD962)',
                      color: '#0A0A0A',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    <UserPlus size={17} />
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
