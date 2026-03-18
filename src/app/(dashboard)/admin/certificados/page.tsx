import React from 'react'

import { Box, Typography } from '@mui/material'

import { CertificadosTable } from '@/features/admin/certificados/components/CertificadosTable'

export const metadata = {
  title: 'Gestión de Certificados - Admin',
  description: 'Visualizar y gestionar certificados emitidos a los estudiantes'
}

export default function CertificadosAdminPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 800 }}>
          Certificados
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Supervisa todos los certificados de finalización emitidos en la plataforma
        </Typography>
      </Box>

      <CertificadosTable />
    </Box>
  )
}
