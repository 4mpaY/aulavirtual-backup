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

export interface EscuelaPublic {
  id: string
  nombre: string
  slug: string
  estado: string
}

interface WebHeaderProps {
  initialCategories?: Category[]
  initialEscuelas?: EscuelaPublic[]
  platformName?: string
  platformSlogan?: string
}

export default function WebHeader({ initialCategories = [], initialEscuelas = [], platformName = 'Aula Virtual', platformSlogan }: WebHeaderProps) {
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
        <div className="w-full px-5 lg:px-12 flex items-center justify-between h-full">
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
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-10" style={{ fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Link
              href="/cursos"
              style={{
                color: pathname.startsWith('/cursos') ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              className="hover:text-[var(--agenda-primary)] group"
            >
              Capacitaciones
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: 'var(--agenda-primary)',
                  borderRadius: '99px',
                  transition: 'width 0.25s',
                  width: pathname.startsWith('/cursos') ? '100%' : '0',
                }}
                className="group-hover:!w-full"
              />
            </Link>

            {/* Escuelas Dropdown */}
            <div className="relative group py-2 cursor-pointer">
              <span
                style={{
                  color: pathname.startsWith('/escuelas') ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.25s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
                className="hover:text-[var(--agenda-primary)]"
              >
                Escuelas
                <i className="tabler-chevron-down text-[14px]" />
              </span>
              <div
                className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[rgba(0,111,101,0.08)] py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50"
                style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.96)' }}
              >
                {initialEscuelas.map((esc) => (
                  <Link
                    key={esc.id}
                    href={`/escuelas/${esc.slug}`}
                    className="flex flex-col px-5 py-2.5 hover:bg-[rgba(0,111,101,0.04)] transition-colors text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1A1A1A', textTransform: 'none' }}>
                      {esc.nombre}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: esc.estado === 'DISPONIBLE' ? 'var(--agenda-primary)' : '#64748B', marginTop: '2px', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: esc.estado === 'DISPONIBLE' ? '#10B981' : esc.estado === 'PROXIMAMENTE' ? '#F59E0B' : '#64748B', display: 'inline-block' }} />
                      {esc.estado === 'DISPONIBLE' ? 'Disponible' : esc.estado === 'PROXIMAMENTE' ? 'Próximamente' : esc.estado === 'MEDIANTE_ALIANZAS' ? 'Mediante alianzas' : 'En desarrollo'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/empleabilidad"
              style={{
                color: pathname === '/empleabilidad' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              className="hover:text-[var(--agenda-primary)] group"
            >
              Empleabilidad
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: 'var(--agenda-primary)',
                  borderRadius: '99px',
                  transition: 'width 0.25s',
                  width: pathname === '/empleabilidad' ? '100%' : '0',
                }}
                className="group-hover:!w-full"
              />
            </Link>

            <Link
              href="/certificacion"
              style={{
                color: pathname === '/certificacion' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              className="hover:text-[var(--agenda-primary)] group"
            >
              Certificación
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: 'var(--agenda-primary)',
                  borderRadius: '99px',
                  transition: 'width 0.25s',
                  width: pathname === '/certificacion' ? '100%' : '0',
                }}
                className="group-hover:!w-full"
              />
            </Link>

            <Link
              href="/nosotros"
              style={{
                color: pathname === '/nosotros' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              className="hover:text-[var(--agenda-primary)] group"
            >
              Nosotros
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: 'var(--agenda-primary)',
                  borderRadius: '99px',
                  transition: 'width 0.25s',
                  width: pathname === '/nosotros' ? '100%' : '0',
                }}
                className="group-hover:!w-full"
              />
            </Link>

            <Link
              href="/contacto"
              style={{
                color: pathname === '/contacto' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.65)',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              className="hover:text-[var(--agenda-primary)] group"
            >
              Contacto
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: 'var(--agenda-primary)',
                  borderRadius: '99px',
                  transition: 'width 0.25s',
                  width: pathname === '/contacto' ? '100%' : '0',
                }}
                className="group-hover:!w-full"
              />
            </Link>
          </nav>

          {/* Auth + cart */}
          <div className="flex items-center gap-3">
            <CartIcon />
            {session ? (
              <UserDropdown />
            ) : (
              <div className="hidden lg:flex items-center rounded-full p-1" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
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
          <nav className="w-full px-5 py-6 flex flex-col gap-4">
            <Link
              href="/cursos"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname.startsWith('/cursos') ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Capacitaciones
            </Link>

            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', padding: '0.5rem 0 0.2rem' }}>
              Escuelas
            </div>
            {initialEscuelas.map((esc) => (
              <Link
                key={esc.id}
                href={`/escuelas/${esc.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none', color: pathname === `/escuelas/${esc.slug}` ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.75)', textDecoration: 'none', padding: '0.3rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: esc.estado === 'DISPONIBLE' ? '#10B981' : esc.estado === 'PROXIMAMENTE' ? '#F59E0B' : '#64748B' }} />
                {esc.nombre}
              </Link>
            ))}

            <Link
              href="/empleabilidad"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname === '/empleabilidad' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Empleabilidad
            </Link>

            <Link
              href="/certificacion"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname === '/certificacion' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Certificación
            </Link>

            <Link
              href="/nosotros"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname === '/nosotros' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Nosotros
            </Link>

            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pathname === '/contacto' ? 'var(--agenda-primary)' : 'rgba(26,26,26,0.7)', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Contacto
            </Link>

            {!session && (
              <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(0,111,101,0.1)] mt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    openLogin()
                  }}
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', padding: '0.75rem 1.1rem', borderRadius: '9999px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'color 0.2s, background 0.2s' }}
                  className="hover:bg-white hover:text-black"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    openRegister()
                  }}
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', padding: '0.75rem 1.1rem', borderRadius: '9999px', background: 'var(--agenda-gradient-brand)', border: 'none', cursor: 'pointer' }}
                >
                  Registro
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
