'use client'

import { Typography, Box } from '@mui/material'

import { MisEbooksList } from '../components/MisEbooksList'

export const MisEbooksPage = () => {
  return (
    <Box>
      <Typography variant='h4' fontWeight={700} mb={1}>
        Mis Ebooks
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={4}>
        Accede a todos los ebooks que has adquirido.
      </Typography>
      <MisEbooksList />
    </Box>
  )
}
