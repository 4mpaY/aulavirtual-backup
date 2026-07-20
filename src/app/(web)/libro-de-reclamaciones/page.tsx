import React from 'react'

import { Box, Container } from '@mui/material'

import { getConfigs } from '@/utils/libs/config'
import LibroReclamacionesForm from '@/features/web/legal/components/LibroReclamacionesForm'

export const metadata = {
  title: 'Libro de Reclamaciones',
  description: 'Libro de reclamaciones virtual para el registro de quejas y reclamos conforme a la ley peruana.',
}

export default async function LibroReclamacionesPage() {
  const configs = await getConfigs()

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <LibroReclamacionesForm
          intro={configs.LEGAL_RECLAMOS_INTRO}
          proveedor={configs.LEGAL_RECLAMOS_PROVEEDOR}
          ruc={configs.LEGAL_RECLAMOS_RUC}
          domicilio={configs.LEGAL_RECLAMOS_DOMICILIO}
        />
      </Container>
    </Box>
  )
}
