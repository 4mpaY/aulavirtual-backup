'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { createPortal } from 'react-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@mui/material'

import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'
import { useAuthModal } from '@/contexts/AuthModalContext'

export interface Category {
  id: string
  nombre: string
  slug: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ─── Navegación TerraMett ──────────────────────────────────────────────────
const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Blogs', href: '/blogs' },
  {
    label: 'Cursos',
    href: '/cursos',
    children: [
      { label: 'Catálogo de Cursos', href: '/cursos' },
    ],
  },
]

// ─── Drawer ────────────────────────────────────────────────────────────────
interface NavDrawerProps {
  open: boolean
  onClose: () => void
  openDropdown: string | null
  setOpenDropdown: (v: string | null) => void
  navItems: NavItem[]
}

function NavDrawer({ open, onClose, openDropdown, setOpenDropdown, navItems }: NavDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(17, 119, 171, 0.35)',
              backdropFilter: 'blur(4px)',
              zIndex: 1200,
            }}
          />
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '85%', maxWidth: '360px',
              backgroundColor: '#ffffff', zIndex: 1300,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column', height: '100vh',
            }}
          >
            {/* Botón cierre */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', right: '-32px', top: '50%',
                transform: 'translateY(-50%)', width: '64px', height: '64px',
                backgroundColor: '#ffffff', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1177AB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '1px solid #e8f4fb', cursor: 'pointer', zIndex: 1400,
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1177AB'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1177AB' }}
            >
              <X size={28} />
            </button>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '28px 32px', borderBottom: '1px solid #EBF5FB', minHeight: '120px', flexShrink: 0 }}>
              <Image src="/assets/terramett/logo.png" alt="Terramett" width={140} height={44} style={{ height: '44px', width: 'auto' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                <span className="font-display font-bold text-lg text-[#1177AB] tracking-widest uppercase">
                  TERRAMETT
                </span>
                <span className="text-[10px] uppercase text-[#88C7E6] font-semibold tracking-tight">
                  Ingeniería que transforma
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', minHeight: 0 }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {navItems.map((item) => (
                  <li key={item.label} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Link
                        href={item.href}
                        onClick={() => !item.children && onClose()}
                        className="font-display"
                        style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D3A52', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '-0.02em', transition: 'color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#1177AB' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#0D3A52' }}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#88C7E6', display: 'flex' }}
                        >
                          <ArrowRight
                            size={18}
                            style={{
                              transform: openDropdown === item.label ? 'rotate(90deg)' : 'rotate(0deg)',
                              color: openDropdown === item.label ? '#1177AB' : '#88C7E6',
                              transition: 'transform 0.2s, color 0.2s',
                            }}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {item.children && openDropdown === item.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: '10px', borderLeft: '2px solid #EBF5FB', marginLeft: '4px', overflow: 'hidden' }}
                        >
                          {item.children.map((child: NavItem) => (
                            <li key={child.label} style={{ marginBottom: '6px' }}>
                              <Link
                                href={child.href}
                                onClick={() => onClose()}
                                style={{ display: 'block', paddingLeft: '20px', paddingTop: '4px', paddingBottom: '4px', fontSize: '0.9rem', color: '#4d6b7d', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#1177AB' }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#4d6b7d' }}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #EBF5FB' }}>
                <Link
                  href="/contacto"
                  onClick={onClose}
                  className="btn-accent"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none', borderRadius: '8px' }}
                >
                  Contáctanos
                </Link>
              </div>
            </nav>

            {/* Footer drawer */}
            <div style={{ padding: '24px 32px', backgroundColor: '#EBF5FB', color: '#4d6b7d', fontSize: '0.55rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.2em', borderTop: '1px solid #d4eaf4', flexShrink: 0 }}>
              TERRAMETT SAC © {new Date().getFullYear()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(drawer, document.body)
}

// ─── WebHeader ─────────────────────────────────────────────────────────────
interface WebHeaderProps {
  initialCategories?: Category[]
}

export default function WebHeader({ initialCategories = [] }: WebHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()

  const dynamicNavItems = navItems.map(item => {
    if (item.label === 'Cursos') {
      return {
        ...item,
        children: [
          { label: 'Catálogo de Cursos', href: '/cursos' },
          ...initialCategories.map(cat => ({
            label: cat.nombre,
            href: `/cursos?categoria=${cat.slug}`,
          })),
        ],
      }
    }

    return item
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 h-20 px-4 lg:px-8 flex items-center justify-between ${scrolled ? 'bg-white shadow-lg border-b border-[#EBF5FB]' : 'bg-white'
          }`}
        style={{ zIndex: 1100, height: '80px', minHeight: '80px' }}
      >
        {/* Logo izquierda */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/terramett/logo.png"
              alt="Terramett SAC"
              width={140}
              height={44}
              style={{ height: '44px', width: 'auto' }}
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-[#1177AB] tracking-widest uppercase">
                TERRAMETT
              </span>
              <span className="text-[8px] uppercase text-[#88C7E6] font-semibold tracking-tight">
                Ingeniería que transforma
              </span>
            </div>
          </Link>
        </div>

        {/* Nav centro/derecha desktop */}
        <nav className="hidden lg:flex items-center gap-7">
          {dynamicNavItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[11px] font-black uppercase tracking-[0.22em] py-4 transition-colors ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                ? 'text-[#1177AB]'
                : 'text-[#0D3A52] hover:text-[#1177AB]'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="btn-accent text-xs px-5 py-2.5 rounded-lg"
          >
            Contáctanos
          </Link>
        </nav>

        {/* Hamburger + Cart + User derecha */}
        <div className="flex items-center gap-2 lg:gap-3">
          <CartIcon />
          {session ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                onClick={() => openLogin()}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#1177AB', fontFamily: 'Inter, sans-serif' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => openRegister()}
                variant="contained"
                size="small"
                sx={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.7rem',
                  borderRadius: '8px', backgroundColor: '#1177AB',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { backgroundColor: '#2892C7' },
                }}
              >
                Registrarse
              </Button>
            </>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#1177AB]/10 text-[#1177AB] hover:bg-[#1177AB]/20 transition-all cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <NavDrawer
        open={mobileOpen}
        onClose={() => { setMobileOpen(false); setOpenDropdown(null) }}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        navItems={dynamicNavItems}
      />
    </>
  )
}
