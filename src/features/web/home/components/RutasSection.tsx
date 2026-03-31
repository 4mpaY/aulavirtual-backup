'use client'


import { Container, Typography, Grid, Box, Stack } from '@mui/material'

import RutaCard from './RutaCard'

interface RutasSectionProps {
  rutas: any[]

  /** Cuando es true omite el wrapper/título propio (la home provee el suyo) */
  embedded?: boolean
}

const RutasSection = ({ rutas, embedded = false }: RutasSectionProps) => {
  if (!rutas || rutas.length === 0) return null

  const grid = (
    <Grid container spacing={4}>
      {rutas.map((ruta) => (
        <Grid item xs={12} sm={6} lg={4} key={ruta.id}>
          <RutaCard {...ruta} />
        </Grid>
      ))}
    </Grid>
  )

  if (embedded) return grid

  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2, display: 'block' }}
          >
            Especialízate
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, color: '#1e293b', fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            Rutas de Aprendizaje
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Colecciones curadas de cursos diseñadas para llevarte de principiante a experto en una tecnología o rol específico.
          </Typography>
        </Stack>
        {grid}
      </Container>
    </Box>
  )
}

export default RutasSection
