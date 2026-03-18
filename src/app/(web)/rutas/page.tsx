import React from 'react'

import { Container, Typography, Grid, Box, Stack } from '@mui/material'

import prisma from '@/utils/libs/prisma'
import RutaCard from '@/features/web/home/components/RutaCard'

async function getRutas() {
  const rutasRaw = await prisma.rutaAprendizaje.findMany({
    where: { esta_activo: true },
    include: {
      cursos: {
        orderBy: { orden: 'asc' },
        include: {
          curso: {
            select: { titulo: true, miniatura: true }
          }
        }
      },
      _count: {
        select: { cursos: true }
      }
    },
    orderBy: { creado_en: 'desc' }
  })

  return rutasRaw.map(ruta => ({
    ...ruta,
    total_cursos: ruta._count.cursos,
    cursos: ruta.cursos.map(rc => rc.curso)
  }))
}

export default async function RutasIndexPage() {
  const rutas = await getRutas()

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: 3,
              display: 'block'
            }}
          >
            CATÁLOGO COMPLETO
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Nuestras <span style={{ color: 'var(--mui-palette-primary-main)' }}>Rutas</span> de Aprendizaje
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Explora nuestros caminos de aprendizaje especializados, diseñados para llevarte paso a paso hacia el dominio de nuevas habilidades y tecnologías.
          </Typography>
        </Stack>

        {rutas.length > 0 ? (
          <Grid container spacing={6}>
            {rutas.map((ruta) => (
              <Grid item xs={12} sm={6} lg={4} key={ruta.id}>
                <RutaCard {...(ruta as any)} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">
              Próximamente tendremos nuevas rutas para ti.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}
