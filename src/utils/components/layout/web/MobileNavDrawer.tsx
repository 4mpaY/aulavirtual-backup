'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { Drawer, Box, IconButton, Divider } from '@mui/material'
import { X, User, LogIn, Download } from 'lucide-react'

import Logo from '@/utils/components/layout/shared/Logo'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { usePWAInstall } from '@/utils/hooks/usePWAInstall'
import PWAInstallTip from '@/utils/components/shared/PWAInstallTip'
import { isFeatureEnabled } from '@/utils/configs/projectFeatures'

const ALL_NAV_ITEMS = [
  { title: 'Inicio', url: '/', key: 'inicio' },
  { title: 'Cursos', url: '/cursos', key: 'cursos' },
  ...(isFeatureEnabled('simulacros') ? [{ title: 'Simulacros', url: '/simulacros', key: 'simulacros' as const }] : []),
  ...(isFeatureEnabled('ebooks') ? [{ title: 'Ebooks', url: '/ebooks', key: 'ebooks' as const }] : []),
  ...(isFeatureEnabled('rutas') ? [{ title: 'Rutas', url: '/rutas', key: 'rutas' as const }] : []),
  { title: 'Empresas', url: '/empresas', key: 'empresas' },
  ...(isFeatureEnabled('suscripciones') ? [{ title: 'Suscripciones', url: '/suscripciones', key: 'suscripciones' as const }] : []),
  { title: 'Nosotros', url: '/nosotros', key: 'nosotros' },
  { title: 'Certificado', url: '/verificar-certificado', key: 'certificado' },
]

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
  empresasHabilitado?: boolean
}

export default function MobileNavDrawer({ open, onClose, empresasHabilitado = true }: MobileNavDrawerProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const { canInstall, hasNativePrompt, install } = usePWAInstall()
  const [showInstallTip, setShowInstallTip] = useState(false)

  const navItems = ALL_NAV_ITEMS.filter(item => item.key !== 'empresas' || empresasHabilitado)

  const isActive = (url: string) => (url === '/' ? pathname === '/' : pathname.startsWith(url))

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 300 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 6, pt: 3, pb: 2 }}>
          <div style={{ transform: 'scale(1.05)', transformOrigin: 'left center' }}>
            <Logo />
          </div>
          <IconButton
            onClick={onClose}
            aria-label="Cerrar menú"
            sx={{ bgcolor: 'rgba(37,146,127,0.08)', borderRadius: '10px', width: 40, height: 40 }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        <Divider />

        {/* Nav sections */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 6, py: 3 }}>
          {navItems.map(item => {
            const active = isActive(item.url)

            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={onClose}
                className="no-underline block"
                style={{
                  padding: '12px 0',
                  color: active ? 'var(--web-primary, #25927F)' : '#0f2e0f',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                }}
              >
                {item.title}
              </Link>
            )
          })}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ px: 6, pb: 4, pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative' }}>
          {session?.user ? (
            <Link
              href="/perfil"
              onClick={onClose}
              className="no-underline flex items-center justify-center gap-2"
              style={{
                height: '52px',
                borderRadius: '999px',
                border: '2px solid var(--web-primary, #25927F)',
                color: 'var(--web-primary, #25927F)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <User size={18} />
              Mi Cuenta
            </Link>
          ) : (
            <button
              onClick={() => {
                onClose()
                openLogin()
              }}
              className="flex items-center justify-center gap-2 cursor-pointer bg-transparent"
              style={{
                height: '52px',
                borderRadius: '999px',
                border: '2px solid var(--web-primary, #25927F)',
                color: 'var(--web-primary, #25927F)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <LogIn size={18} />
              Iniciar Sesión
            </button>
          )}

          {canInstall && (
            <>
              <button
                onClick={() => (hasNativePrompt ? install() : setShowInstallTip(t => !t))}
                className="flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  height: '52px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: 'var(--web-light, #BDD962)',
                  color: '#0A0A0A',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                <Download size={18} />
                Instalar App
              </button>

              {showInstallTip && !hasNativePrompt && (
                <PWAInstallTip
                  onClose={() => setShowInstallTip(false)}
                  style={{ position: 'absolute', bottom: 'calc(100% + 8px)', top: 'auto', left: 24, right: 24, width: 'auto' }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
