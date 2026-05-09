import React from 'react'

import { Box } from '@mui/material'

import { AuthModalProvider } from '@/contexts/AuthModalContext'
import WebFooter from '@/utils/components/layout/web/WebFooter'
import WebHeader from '@/utils/components/layout/web/WebHeader'
import FloatingContactButtons from '@/utils/components/layout/web/FloatingContactButtons'

const WebLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthModalProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <WebHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',

            // Compensar el header fijo: h-16 (64px) + barra nav mobile (~36px) = ~100px; md+ solo h-20 (80px)
            paddingTop: { xs: '100px', md: '80px' },
          }}
        >
          {children}
        </Box>
        <WebFooter />
        <FloatingContactButtons />
      </Box>
    </AuthModalProvider>
  )
}

export default WebLayout
