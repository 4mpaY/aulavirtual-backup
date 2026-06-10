'use client'

import { Typography, Box } from '@mui/material'

import { MisEbooksList } from '../components/MisEbooksList'

interface MiEbook {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  autor?: string | null
  miniatura?: string | null
  paginas?: number | null
}

export const MisEbooksPage = ({ ebooks }: { ebooks: MiEbook[] }) => {
  return (
    <Box>
      <Typography variant='h4' fontWeight={700} mb={1}>
        Mis Ebooks
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={4}>
        Accede a todos los ebooks que has adquirido.
      </Typography>
      <MisEbooksList ebooks={ebooks} />
    </Box>
  )
}
