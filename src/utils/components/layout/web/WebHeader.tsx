'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { createPortal } from 'react-dom'
import { Menu, X, ArrowRight, Phone, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@mui/material'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'

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

// ─── Navegación ARM ───────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    label: 'Proyectos',
    href: '/proyectos',
    children: [
      { label: 'Gerencia de proyectos', href: '/proyectos#gerencia' },
      { label: 'Supervisión técnica', href: '/proyectos#supervision' },
      { label: 'Interventoría y control', href: '/proyectos#interventoria' },
      { label: 'Puesta en marcha', href: '/proyectos#comisionamiento' },
    ],
  },
  {
    label: 'Mantenimiento',
    href: '/mantenimiento',
    children: [
      { label: 'Mantenimiento predictivo', href: '/mantenimiento#predictivo' },
      { label: 'Mantenimiento proactivo', href: '/mantenimiento#proactivo' },
      { label: 'Gestión de Mantenimiento', href: '/mantenimiento#gestion' },
    ],
  },
  {
    label: 'Consultoría',
    href: '/consultoria',
    children: [
      { label: 'Gestión de Activos (ISO 55000)', href: '/consultoria#gestion-activos' },
      { label: 'Optimización de Mantenimiento', href: '/consultoria#optimizacion' },
      { label: 'RCM / FMEA', href: '/consultoria#rcm-fmea' },
      { label: 'Auditorías y Diagnósticos', href: '/consultoria#auditorias' },
    ],
  },
  {
    label: 'Capacitación',
    href: '/cursos',
    children: [
      { label: 'Catálogo de Cursos', href: '/cursos' },
    ],
  }
]

interface NavDrawerProps {
  open: boolean
  onClose: () => void
  openDropdown: string | null
  setOpenDropdown: (v: string | null) => void
  navItems: NavItem[]
}

// ─── Drawer (via Portal para evitar restricciones del header) ────────────────
function NavDrawer({
  open,
  onClose,
  openDropdown,
  setOpenDropdown,
  navItems,
}: NavDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(2, 17, 92, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 1200,
            }}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '384px',
              backgroundColor: '#ffffff',
              zIndex: 1300,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}
          >
            {/* Botón circular de cierre — borde derecho */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                right: '-32px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '64px',
                height: '64px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#02115C',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '1px solid #f1f5f9',
                cursor: 'pointer',
                zIndex: 1400,
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2231A'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.color = '#02115C'
              }}
            >
              <X size={32} />
            </button>

            {/* Header del drawer: Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                borderBottom: '1px solid #f8fafc',
                backgroundColor: '#ffffff',
                minHeight: '140px',
                flexShrink: 0,
              }}
            >
              <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
                <Logo />
              </div>
            </div>

            {/* Navegación — scrollable */}
            <nav
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 32px',
                minHeight: 0,
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {navItems.map((item) => (
                  <li key={item.label} style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => !item.children && onClose()}
                        className="font-display"
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: '#0f172a',
                          textDecoration: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.025em',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#E2231A' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a' }}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === item.label ? null : item.label)
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#94a3b8',
                            display: 'flex',
                          }}
                        >
                          <ArrowRight
                            size={20}
                            style={{
                              transform: openDropdown === item.label ? 'rotate(90deg)' : 'rotate(0deg)',
                              color: openDropdown === item.label ? '#E2231A' : '#94a3b8',
                              transition: 'transform 0.2s, color 0.2s',
                            }}
                          />
                        </button>
                      )}
                    </div>

                    {/* Submenú */}
                    <AnimatePresence>
                      {item.children && openDropdown === item.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            marginTop: '12px',
                            borderLeft: '2px solid #f1f5f9',
                            marginLeft: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          {item.children.map((child: NavItem) => (
                            <li key={child.label} style={{ marginBottom: '8px' }}>
                              <Link
                                href={child.href}
                                onClick={() => onClose()}
                                style={{
                                  display: 'block',
                                  paddingLeft: '20px',
                                  paddingTop: '4px',
                                  paddingBottom: '4px',
                                  fontSize: '0.95rem',
                                  color: '#64748b',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#E2231A' }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
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

              {/* Utilidades al pie */}
              <div
                style={{
                  marginTop: '40px',
                  paddingTop: '32px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <Link
                  href="/contacto"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: '#0f172a',
                    textDecoration: 'none',
                    marginBottom: '24px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#E2231A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a' }}
                >
                  <div
                    style={{
                      padding: '8px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '50%',
                      display: 'flex',
                    }}
                  >
                    <Phone size={16} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      }}
                  >
                    Contactos
                  </span>
                </Link>

                <a
                  href="https://armingenieria.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: '#64748b',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
                >
                  <div
                    style={{
                      padding: '8px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '50%',
                      display: 'flex',
                    }}
                  >
                    <Globe size={16} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      }}
                  >
                    Sitio web internacional
                  </span>
                </a>
              </div>
            </nav>

            {/* Footer del drawer */}
            <div
              style={{
                padding: '32px',
                backgroundColor: '#f8fafc',
                color: '#94a3b8',
                fontSize: '0.5625rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.2em',
                borderTop: '1px solid #f1f5f9',
                flexShrink: 0,
              }}
            >
              ARM Asset Reliability Management © {new Date().getFullYear()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(drawer, document.body)
}

interface WebHeaderProps {
  initialCategories?: Category[]
}

// ─── WebHeader ────────────────────────────────────────────────────────────────
export default function WebHeader({ initialCategories = [] }: WebHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Generar navItems dinámicamente con las categorías apuntando a /cursos
  const dynamicNavItems = navItems.map(item => {
    if (item.label === 'Capacitación') {
      return {
        ...item,
        children: [
          { label: 'Catálogo de Cursos', href: '/cursos' },
          ...initialCategories.map(cat => ({
            label: cat.nombre,
            href: `/cursos?categoria=${cat.slug}`
          })),
          // { label: 'Rutas de aprendizaje', href: '/rutas' },
        ]
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

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between ${scrolled
          ? 'bg-white shadow-lg border-b border-slate-100'
          : 'bg-white/95 backdrop-blur-sm'
          }`}
        style={{ zIndex: 1100 }}
      >
        {/* ── LEFT: Hamburger + Desktop Nav ─────── */}
        <div className="flex items-center gap-3 lg:gap-8 flex-1">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full transition-all duration-300 bg-[#02115C]/5 text-[#02115C] hover:bg-[#02115C]/10"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 ml-2">
            {dynamicNavItems.map((item) => (

              <Link
                key={item.label}
                href={item.href}
                className={`text-[10px] font-black uppercase tracking-[0.25em] py-4 transition-colors ${pathname.startsWith(item.href)
                  ? 'text-[#E2231A]'
                  : 'text-[#02115C] hover:text-[#E2231A]'
                  }`}
              >
                {item.label}
              </Link>


            ))}
          </nav>
        </div>

        {/* ── CENTER: Logo ─────────────────────── */}
        <div className="flex-shrink-0 px-2 flex items-center justify-center transform scale-125 origin-center">
          <Logo />
        </div>

        {/* ── RIGHT: Rutas + Cart + User ────────── */}
        <div className="flex items-center justify-end gap-2 lg:gap-4 flex-1">
          <CartIcon />
          {session ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                component={Link}
                href="/login"
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#02115C', fontFamily: 'Inter, sans-serif' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                href="/register"
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
      </header>

      {/* Drawer renderizado vía Portal directamente en <body> */}
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
