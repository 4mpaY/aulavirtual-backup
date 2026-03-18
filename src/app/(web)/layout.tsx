import React from 'react'

import { Box } from '@mui/material'

import WebHeader from '@/utils/components/layout/web/WebHeader'
import WebFooter from '@/utils/components/layout/web/WebFooter'

const WebLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <WebHeader />
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

