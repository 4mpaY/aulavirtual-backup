import React from 'react'

import { Box, Container, Typography } from '@mui/material'

import LibroReclamacionesForm from '@/features/web/legal/components/LibroReclamacionesForm'

export const metadata = {
  title: 'Libro de Reclamaciones | VISIONA PERU',
  description: 'Libro de reclamaciones virtual de VISIONA PERU SAFETY SOLUTIONS S.A.C para el registro de quejas y reclamos conforme a la ley peruana.',
}

export default function LibroReclamacionesPage() {
  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--web-dark, #025E44)' }} mb={2}>
            Libro de Reclamaciones Virtual
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="800px" mx="auto">
            Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, 
            esta institución cuenta con un Libro de Reclamaciones Virtual a su disposición.
          </Typography>
        </Box>

        <LibroReclamacionesForm />

      </Container>
    </Box>
  )
}
