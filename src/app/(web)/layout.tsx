import React from 'react'

import { unstable_cache } from 'next/cache'

import { Box } from '@mui/material'

import WebHeader from '@/utils/components/layout/web/WebHeader'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import FloatingContactButtons from '@/utils/components/layout/web/FloatingContactButtons'
import prisma from '@/utils/libs/prisma'
import { AuthModalProvider } from '@/contexts/AuthModalContext'

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
  const categories = await getCategorias()

  return (
    <AuthModalProvider>
      <Box className="web-layout" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <WebHeader initialCategories={categories} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Espaciador para el header fijo */}
          <Box sx={{ height: '80px', flexShrink: 0 }} />
          {children}
        </Box>
        <WebFooter />
        <FloatingContactButtons />
      </Box>
    </AuthModalProvider>
  )
}

export default WebLayout
