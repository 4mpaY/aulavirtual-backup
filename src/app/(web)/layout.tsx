import React from 'react'

import prisma from '@/utils/libs/prisma'
import WebHeader from '@/utils/components/layout/web/WebHeader'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import LeftSidebar from '@/utils/components/layout/web/LeftSidebar'
import MobileBottomNav from '@/utils/components/layout/web/MobileBottomNav'

const WebLayout = async ({ children }: { children: React.ReactNode }) => {
  const categories = await prisma.categoria.findMany({
    where: { esta_activo: true },
    select: { id: true, nombre: true, slug: true },
    orderBy: { orden: 'asc' }
  })

  return (
    <div className="web-layout min-h-screen bg-background flex flex-col">
      <WebHeader initialCategories={categories} />
      <div className="flex flex-1" style={{ paddingTop: 'var(--navbar-height)' }}>
        {/* Sidebar: visible solo en sm+ */}
        <div className="hidden sm:block">
          <LeftSidebar />
        </div>
        <main
          className="flex-1 flex flex-col min-w-0"
          style={{ paddingLeft: 'var(--sidebar-width)' }}
        >
          {/* padding-left del sidebar solo en sm+ */}
          <style>{`@media (max-width: 639px) { main { padding-left: 0 !important; padding-bottom: 64px; } }`}</style>
          <div className="flex-1">
            {children}
          </div>
          <WebFooter />
        </main>
      </div>
      {/* Bottom nav: visible solo en mobile */}
      <MobileBottomNav />
    </div>
  )
}

export default WebLayout
