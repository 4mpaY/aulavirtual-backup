import React from 'react'

import { unstable_cache } from 'next/cache'

import { AuthModalProvider } from '@/contexts/AuthModalContext'
import { getConfigs } from '@/utils/libs/config'
import prisma from '@/utils/libs/prisma'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import WebHeader from '@/utils/components/layout/web/WebHeader'
import ScrollAnimations from '@/utils/components/layout/web/ScrollAnimations'
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

const WebLayout = async ({ children }: { children: React.ReactNode }) => {
  const [categories, configs] = await Promise.all([getCategorias(), getConfigs()])

  const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
  const platformSlogan = configs.TEMPLATE_SLOGAN || 'Aprende sin límites'
  const rutasHabilitado = configs.WEB_RUTAS_HABILITADO !== 'false'

  return (
    <AuthModalProvider>
      <div className="web-layout min-h-screen bg-white flex flex-col">
        <WebHeader initialCategories={categories} platformName={platformName} platformSlogan={platformSlogan} />
        <main className="flex-1 flex flex-col" style={{ paddingTop: 'var(--navbar-height)' }}>
          {children}
          <WebFooter platformName={platformName} rutasHabilitado={rutasHabilitado} />
        </main>
        <FloatingContactButtons />
        <ScrollAnimations />
      </div>
    </AuthModalProvider>
  )
}

export default WebLayout
