import React from 'react'

import { Box } from '@mui/material'

import WebHeader from '@/utils/components/layout/web/WebHeader'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import prisma from '@/utils/libs/prisma'

const WebLayout = async ({ children }: { children: React.ReactNode }) => {
  const categories = await prisma.categoria.findMany({
    where: { esta_activo: true },
    select: { id: true, nombre: true, slug: true },
    orderBy: { orden: 'asc' }
  })

  
return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <WebHeader initialCategories={categories} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',

          // Compensar el header fijo (80px mobile, 96px desktop)
          paddingTop: { xs: '80px', lg: '96px' },
        }}
      >
        {children}
      </Box>
      <WebFooter />
    </Box>
  )
}

export default WebLayout

