'use client'

import { useRouter } from 'next/navigation'

import { Grid, Typography, Box, Alert, CircularProgress } from '@mui/material'

import { useMiSuscripcion, usePlanesPublicos } from '../hooks/useSuscripcion'
import PlanCard from '../components/PlanCard'
import SuscripcionCard from '../components/SuscripcionCard'

export function SuscripcionPage() {
  const router = useRouter()
  const { data: suscripcion, isLoading: loadingSub } = useMiSuscripcion()
  const { data: planes = [], isLoading: loadingPlanes } = usePlanesPublicos()
  const planActualId = suscripcion?.plan?.id

  const isLoading = loadingSub || loadingPlanes

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mb: 0.5 }}>
          Suscripciones
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
          Accede a múltiples cursos con un plan de suscripción recurrente
        </Typography>
      </Box>

      {suscripcion && (
        <Box mb={5.5}>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='tabler-shield-check' style={{ color: 'var(--web-primary,#25927F)', fontSize: 20 }} />
            Tu suscripción actual
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={10} lg={9}>
              <SuscripcionCard suscripcion={suscripcion} />
            </Grid>
          </Grid>
        </Box>
      )}

      {planes.length === 0 ? (
        <Alert severity='info' sx={{ borderRadius: '16px' }}>No hay planes de suscripción disponibles en este momento.</Alert>
      ) : (
        <Box>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#1e293b', mb: 2.5, mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='tabler-layout-grid' style={{ color: 'var(--web-primary,#25927F)', fontSize: 20 }} />
            {suscripcion ? 'Otros planes disponibles' : 'Planes disponibles'}
          </Typography>
          <Grid container spacing={3}>
            {planes.map(plan => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <PlanCard
                  plan={plan}
                  onSuscribirse={p => router.push(`/suscripciones/checkout/${p.id}`)}
                  suscritoActualmente={planActualId === plan.id && suscripcion?.estado === 'ACTIVA'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    </Box>
  )
}
