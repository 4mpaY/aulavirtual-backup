'use client'

import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'
import { useAuthModal } from '@/contexts/AuthModalContext'

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

const NAV = [
  { href: '/cursos', label: 'Capacitaciones' },
  { href: '/empleabilidad', label: 'Empleabilidad' },
  { href: '/certificacion', label: 'Certificación' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function WebHeader({ initialCategories = [], platformName = 'Aula Virtual', platformSlogan }: WebHeaderProps) {
  void initialCategories
  void platformSlogan
  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className="glass-agenda fixed top-0 left-0 right-0 z-50 border-b"
        style={{ height: 'var(--navbar-height)', borderColor: 'rgba(0,111,101,0.1)' }}
      >
        <div className="container-page flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/agenda/logo-sin-fondo.png"
              alt={platformName}
              width={120}
              height={40}
              style={{ objectFit: 'contain', height: '40px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7" style={{ fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href === '/cursos' && pathname.startsWith('/cursos'))
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    color: active ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                    position: 'relative',
                    paddingBottom: '4px',
                    transition: 'color 0.2s',
                    textDecoration: 'none',
                  }}
                  className="hover:text-[var(--agenda-primary)] group"
                >
                  {n.label}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '2px',
                      background: 'var(--agenda-primary)',
                      borderRadius: '99px',
                      transition: 'width 0.25s',
                      width: active ? '100%' : '0',
                    }}
                    className="group-hover:!w-full"
                  />
                </Link>
              )
            })}
          </nav>

          {/* Auth + cart */}
          <div className="flex items-center gap-3">
            <CartIcon />
            {session ? (
              <UserDropdown />
            ) : (
              <div className="flex items-center rounded-full p-1" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <button
                  onClick={() => openLogin()}
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', padding: '0.5rem 1.1rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s, background 0.2s' }}
                  className="hover:bg-white hover:text-black"
                >
                  Login
                </button>
                <button
                  onClick={() => openRegister()}
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', padding: '0.5rem 1.1rem', borderRadius: '9999px', background: 'var(--agenda-gradient-brand)', border: 'none', cursor: 'pointer' }}
                >
                  Registro
                </button>
              </div>
            )}
            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl"
              style={{ background: 'rgba(0,111,101,0.06)', border: 'none', cursor: 'pointer', color: 'var(--agenda-primary)' }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 z-40 shadow-xl"
          style={{ top: 'var(--navbar-height)', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,111,101,0.1)' }}
        >
          <nav className="container-page py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname === n.href ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
