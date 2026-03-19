import { Container, Typography, Box, Stack } from '@mui/material'

import { AxiosRuta } from '@/features/web/rutas/http/axiosRuta'
import RutasCatalog from '@/features/web/rutas/components/RutasCatalog'

async function getRutas() {
  const axiosRuta = new AxiosRuta()

  try {
    return await axiosRuta.searchAll()
  } catch (err) {
    console.error('Error fetching routes:', err)

    return []
  }
}

export default async function RutasIndexPage() {
  const rutas = await getRutas()

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 8, textAlign: 'center', alignItems: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: 3,
              display: 'block',
              width: '100%'
            }}
          >
            CATÁLOGO COMPLETO
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textAlign: 'center',
              width: '100%'
            }}
          >
            Nuestras <span style={{ color: 'var(--mui-palette-primary-main)' }}>Rutas</span> de Aprendizaje
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: 'center',
              width: '100%'
            }}
          >
            Explora nuestros caminos de aprendizaje especializados, diseñados para llevarte paso a paso hacia el dominio de nuevas habilidades y tecnologías.
          </Typography>
        </Stack>

        <RutasCatalog initialRutas={rutas} />
      </Container>
    </Box>
  )
}
