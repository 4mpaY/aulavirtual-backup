'use client'

import dynamic from 'next/dynamic'

import { Box, CircularProgress, Typography } from '@mui/material'

const CalendarioView = dynamic(
  () => import('../components/CalendarioView').then(m => ({ default: m.CalendarioView })),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }
)

export function CalendarioPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' fontWeight={700}>Calendario de Actividades</Typography>
        <Typography variant='body2' color='text.secondary'>
          Clases en vivo, exámenes y fechas importantes de tus cursos
        </Typography>
      </Box>
      <CalendarioView />
    </Box>
  )
}
