import React from 'react'

import { unstable_cache } from 'next/cache'

import { AuthModalProvider } from '@/contexts/AuthModalContext'
import { getConfigs } from '@/utils/libs/config'
import prisma from '@/utils/libs/prisma'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import WebHeader from '@/utils/components/layout/web/WebHeader'
import ScrollAnimations from '@/utils/components/layout/web/ScrollAnimations'
import PWAInstalledToast from '@/features/web/home/components/PWAInstalledToast'
import SplashScreen from '@/utils/components/layout/web/SplashScreen'
import FloatingContactButtons from '@/utils/components/layout/web/FloatingContactButtons'

const getCategorias = unstable_cache(
  () =>
    prisma.categoria.findMany({
      where: { esta_activo: true },
      select: { id: true, nombre: true, slug: true },
      orderBy: { orden: 'asc' }
    }),
  ['web-categorias'],
  { revalidate: 300 }
)

const getEscuelas = unstable_cache(
  () =>
    prisma.escuela.findMany({
      orderBy: { orden: 'asc' }
    }),
  ['web-escuelas'],
  { revalidate: 300 }
)

const WebLayout = async ({ children }: { children: React.ReactNode }) => {
  const [categories, escuelas, configs] = await Promise.all([getCategorias(), getEscuelas(), getConfigs()])

  const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
  const platformSlogan = configs.TEMPLATE_SLOGAN || 'Aprende sin límites'

  return (
    <AuthModalProvider>
      <div className="web-layout min-h-screen bg-white flex flex-col">
        <WebHeader initialCategories={categories} initialEscuelas={escuelas} platformName={platformName} platformSlogan={platformSlogan} />
        <div className="flex flex-1" style={{ paddingTop: 'var(--navbar-height)' }}>
          <main className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0">
            <div className="flex-1">
              {children}
            </div>
            <WebFooter platformName={platformName} />
          </main>
        </div>
        <ScrollAnimations />
        <PWAInstalledToast />
        <FloatingContactButtons />
        <SplashScreen platformName={platformName} platformSlogan={platformSlogan} logoUrl={configs.TEMPLATE_LOGO || '/images/agenda/logo-sin-fondo.png'} />
      </div>
    </AuthModalProvider>
  )
}

export default WebLayout
