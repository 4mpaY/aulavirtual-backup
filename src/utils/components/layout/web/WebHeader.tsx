'use client'

import { useState, useRef, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { ChevronDown, Stethoscope, ClipboardList, Eye, Shield, BookOpen, Activity, CheckSquare, FileText } from 'lucide-react'

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

const SERVICES = [
  { title: 'Salud Ocupacional', desc: 'Programas integrales de salud', icon: Stethoscope, href: '/contacto' },
  { title: 'Exámenes Médicos', desc: 'Preocupacionales y periódicos', icon: ClipboardList, href: '/contacto' },
  { title: 'Vigilancia Médica', desc: 'Seguimiento continuo de la salud', icon: Eye, href: '/contacto' },
  { title: 'Seguridad y Salud (SST)', desc: 'Gestión de riesgos laborales', icon: Shield, href: '/contacto' },
  { title: 'Capacitación', desc: 'Cursos y formación especializada', icon: BookOpen, href: '/cursos' },
  { title: 'Monitoreo Ambiental', desc: 'Ocupacional y de medio ambiente', icon: Activity, href: '/contacto' },
  { title: 'Homologaciones', desc: 'ISO 9001 · 45001 · 14001', icon: CheckSquare, href: '/contacto' },
  { title: 'Gestión Documental', desc: 'Administración y cumplimiento', icon: FileText, href: '/contacto' },
]

const NAV_LINKS = [
  { title: 'Inicio', href: '/' },
  { title: 'Cursos', href: '/cursos' },
  { title: 'Empresas', href: '/empresas' },
  { title: 'Nosotros', href: '/nosotros' },
  { title: 'Contacto', href: '/contacto' },
]

export default function WebHeader({ initialCategories = [], platformName = 'Aula Virtual', platformSlogan = 'Aprende sin límites' }: WebHeaderProps) {
  void initialCategories
  void platformName
  void platformSlogan
  const { data: session } = useSession()
  const { openLogin, openRegister } = useAuthModal()
  const configs = useConfig()
  const primaryColor = configs.COLOR_PRIMARIO || '#02115C'
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-50 flex items-center justify-between px-6 md:px-10"
      style={{ height: 'var(--navbar-height)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group no-underline">
        <Logo />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {/* Servicios dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setServicesOpen(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: servicesOpen ? 'var(--web-primary, #25927F)' : '#334155',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--web-primary, #25927F)' }}
            onMouseLeave={e => { if (!servicesOpen) (e.currentTarget as HTMLButtonElement).style.color = '#334155' }}
          >
            Servicios
            <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {servicesOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid hsl(214,20%,91%)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                padding: '0.75rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                width: '420px',
                zIndex: 100,
              }}
            >
              {SERVICES.map(s => (
                <Link
                  key={s.title}
                  href={s.href}
                  onClick={() => setServicesOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(var(--web-primary-rgb, 37,146,127),0.07)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(var(--web-primary-rgb, 37,146,127),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.icon size={16} color="var(--web-primary, #25927F)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#0A0A0A', lineHeight: 1.2 }}>{s.title}</div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{s.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: isActive(link.href) ? 'var(--web-primary, #25927F)' : '#334155',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--web-primary, #25927F)' }}
            onMouseLeave={e => { if (!isActive(link.href)) (e.currentTarget as HTMLAnchorElement).style.color = '#334155' }}
          >
            {link.title}
          </Link>
        ))}
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
                backgroundColor: primaryColor,
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': { backgroundColor: primaryColor, opacity: 0.85 },
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
