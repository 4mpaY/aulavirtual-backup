'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, X, Phone } from 'lucide-react'

import { Button } from '@sout/components/ui/button'
import { cn } from '@sout/lib/utils'
import logo from '@sout/assets/logo.jpeg'
import SoutUserMenu from '@sout/components/auth/SoutUserMenu'
import SoutCartButton from '@sout/components/cart/SoutCartButton'

const PHONE_DISPLAY = '+51 977 959 001'
const PHONE_HREF = 'tel:+51977959001'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Quiénes Somos', href: '/nosotros' },
  { name: 'Cursos', href: '/cursos' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isContactActive = pathname === '/contacto'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    
return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        data-scrolled={isScrolled}
        className="sout-header fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      >
        {/* Toolbar — teléfono */}
        <div className="sout-header-toolbar">
          <div className="section-container h-full">
            <div className="flex h-full items-center justify-end">
              <a
                href={PHONE_HREF}
                className="sout-toolbar-phone inline-flex items-center gap-2 font-heading font-semibold transition-opacity hover:opacity-90"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra principal */}
        <div className="sout-header-main bg-white shadow-md">
          <div className="section-container h-full">
            <nav className="sout-header-bar flex items-center gap-3 lg:gap-4">
              <Link href="/" className="sout-header-logo-link flex shrink-0 items-center group">
                <img
                  src={logo.src}
                  alt="SOUT Training Center"
                  className="sout-header-logo object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="hidden lg:flex flex-1 items-center justify-center gap-1 min-w-0">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'sout-header-link px-4 py-1.5 font-heading font-semibold rounded-lg transition-colors duration-300 hover:bg-primary/10',
                      pathname === item.href ? 'text-primary' : 'text-gray-800 hover:text-primary'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/contacto">
                  <Button
                    variant="hero"
                    className={cn('sout-header-cta ml-1', isContactActive && 'ring-2 ring-primary/30')}
                  >
                    Contáctanos
                  </Button>
                </Link>
              </div>

              {/* Carrito y usuario — extremo derecho */}
              <div className="sout-header-actions flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
                <SoutCartButton />
                <SoutUserMenu />

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(open => !open)}
                  className="lg:hidden p-1.5 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors duration-300"
                  aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="sout-mobile-menu fixed inset-x-0 z-40 lg:hidden">
          <div className="section-container pt-[var(--sout-header-height)]">
            <div className="bg-background rounded-xl shadow-xl p-4 space-y-1 border border-border">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 font-heading text-sm font-medium rounded-lg transition-colors duration-300',
                    pathname === item.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block pt-2"
              >
                <Button variant="hero" className="w-full sout-header-cta">
                  Contáctanos
                </Button>
              </Link>

              <SoutUserMenu variant="mobile" onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Header
