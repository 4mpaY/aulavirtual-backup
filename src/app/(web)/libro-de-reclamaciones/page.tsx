import React from 'react'

import { Box, Container } from '@mui/material'

import LibroReclamacionesForm from '@/features/web/legal/components/LibroReclamacionesForm'
import PageHeader from '@/utils/components/layout/web/PageHeader'

export const metadata = {
  title: 'Libro de Reclamaciones - SSMAT',
  description: 'Libro de reclamaciones virtual para el registro de quejas y reclamos conforme a la ley peruana.',
}

export default function LibroReclamacionesPage() {
  return (
    <>
      <PageHeader
        label="Atención al Cliente"
        title="Libro de Reclamaciones"
        description="Registra tu queja o reclamo conforme a la normativa peruana. Te responderemos en el plazo establecido por ley."
        imageSrc="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
      />
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <LibroReclamacionesForm />
        </Container>
      </Box>
    </>
  )
}
