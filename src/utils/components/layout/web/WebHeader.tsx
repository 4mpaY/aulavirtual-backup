'use client'

import Link from 'next/link'

import { Button } from '@mui/material'
import { useSession } from 'next-auth/react'

import Logo from '@components/layout/shared/Logo'
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
          {/* <div className="hidden sm:flex flex-col">
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
  const { openLogin, openRegister } = useAuthModal()

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
          }))
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
              className="flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full transition-all duration-300 bg-[#02115C]/5 text-[#02115C] hover:bg-[#02115C]/10 cursor-pointer"
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
      </Link>

      {/* ── RIGHT: Rutas + Cart + User ────────── */}
      <div className="flex items-center justify-end gap-2 lg:gap-4 flex-1">
        <CartIcon />
        {session ? (
          <UserDropdown />
        ) : (
          <>
            <Button
              onClick={() => openLogin()}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#02115C', fontFamily: 'Inter, sans-serif' }}
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

      {/* Drawer renderizado vía Portal directamente en <body> */ }
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
