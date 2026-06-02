'use client'

import { useState } from 'react'

import { Grid, Typography, Box, Alert, CircularProgress } from '@mui/material'

import { useMiSuscripcion, usePlanesPublicos } from '../hooks/useSuscripcion'
import PlanCard from '../components/PlanCard'
import SuscripcionCard from '../components/SuscripcionCard'
import PlanCheckoutModal from '../components/PlanCheckoutModal'
import type { PlanPublico } from '../entity/Suscripcion'

export function SuscripcionPage() {
  const { data: suscripcion, isLoading: loadingSub } = useMiSuscripcion()
  const { data: planes = [], isLoading: loadingPlanes } = usePlanesPublicos()
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanPublico | null>(null)

  const isLoading = loadingSub || loadingPlanes
  const planActualId = suscripcion?.plan?.id

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h5' fontWeight={700} mb={1}>
        Suscripciones
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={4}>
        Accede a múltiples cursos con un plan de suscripción recurrente
      </Typography>

      {suscripcion && (
        <Box mb={5}>
          <Typography variant='h6' fontWeight={600} mb={2}>
            Tu suscripción actual
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SuscripcionCard suscripcion={suscripcion} />
            </Grid>
          </Grid>
        </Box>
      )}

      {planes.length === 0 ? (
        <Alert severity='info'>No hay planes de suscripción disponibles en este momento.</Alert>
      ) : (
        <Box>
          <Typography variant='h6' fontWeight={600} mb={2}>
            {suscripcion ? 'Otros planes disponibles' : 'Planes disponibles'}
          </Typography>
          <Grid container spacing={3}>
            {planes.map(plan => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <PlanCard
                  plan={plan}
                  onSuscribirse={setPlanSeleccionado}
                  suscritoActualmente={planActualId === plan.id && suscripcion?.estado === 'ACTIVA'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <PlanCheckoutModal
        open={!!planSeleccionado}
        handleClose={() => setPlanSeleccionado(null)}
        plan={planSeleccionado}
      />
    </Box>
  )
}
