import { Box, Typography } from '@mui/material'

import ClientOnly from '@/utils/components/ClientOnly'

import CalendarioView from '../components/CalendarioView'


export function CalendarioPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' fontWeight={700}>Calendario de Actividades</Typography>
        <Typography variant='body2' color='text.secondary'>
          Clases en vivo, exámenes y fechas importantes de tus cursos
        </Typography>
      </Box>
      <ClientOnly>
        <CalendarioView />
      </ClientOnly>
    </Box>
  )
}

export default CalendarioPage


