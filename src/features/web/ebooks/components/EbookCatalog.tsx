'use client'

import { Box, Container, Grid, Typography } from '@mui/material'

import EbookCard from './EbookCard'

interface Ebook {
  id: string
  titulo: string
  slug: string
  miniatura?: string | null
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  autor?: string | null
  paginas?: number | null
  genero?: string | null
  categoria?: { nombre: string } | null
}

interface Props {
  ebooks: Ebook[]
  adquiridosIds: string[]
}

export default function EbookCatalog({ ebooks, adquiridosIds }: Props) {
  const adquiridosSet = new Set(adquiridosIds)

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, px: { xs: 2, md: 4 } }}>
      <Container maxWidth='xl'>
        {ebooks.length === 0 ? (
          <Box textAlign='center' py={10}>
            <Typography variant='h6' color='text.secondary'>
              No hay ebooks disponibles por el momento.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {ebooks.map(ebook => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={ebook.id}>
                <EbookCard
                  {...ebook}
                  adquirido={adquiridosSet.has(ebook.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
