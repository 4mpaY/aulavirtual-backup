'use client'

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Divider,
  Stack
} from '@mui/material'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import HydratedDate from '@/utils/components/HydratedDate'
import { useCancelarSuscripcion } from '../hooks/useSuscripcion'
import type { Suscripcion } from '../entity/Suscripcion'
import { INTERVALO_LABELS } from '../entity/Suscripcion'

const ESTADO_CONFIG: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'secondary' | 'info' }> = {
  ACTIVA:    { label: 'Activa', color: 'success' },
  EN_PRUEBA: { label: 'En Prueba', color: 'info' },
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  VENCIDA:   { label: 'Vencida', color: 'error' },
  CANCELADA: { label: 'Cancelada', color: 'secondary' }
}

interface SuscripcionCardProps {
  suscripcion: Suscripcion
}

const SuscripcionCard = ({ suscripcion }: SuscripcionCardProps) => {
  const cancelar = useCancelarSuscripcion()
  const estadoConfig = ESTADO_CONFIG[suscripcion.estado] ?? { label: suscripcion.estado, color: 'secondary' as const }

  const handleCancelar = async () => {
    const result = await Swal.fire({
      title: '¿Cancelar suscripción?',
      text: 'Perderás el acceso a los cursos del plan al finalizar el período actual. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Mantener suscripción'
    })

    if (result.isConfirmed) {
      try {
        await cancelar.mutateAsync(suscripcion.id)
        toast.success('Suscripción cancelada')
      } catch (error: any) {
        toast.error(error?.message || 'Error al cancelar la suscripción')
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant='h6' fontWeight={700}>{suscripcion.plan.nombre}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {INTERVALO_LABELS[suscripcion.plan.intervalo]} · {suscripcion.plan.moneda === 'PEN' ? 'S/' : '$'} {Number(suscripcion.plan.precio).toFixed(2)}
            </Typography>
          </Box>
          <Chip label={estadoConfig.label} color={estadoConfig.color} size='small' />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          {suscripcion.fecha_inicio && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' color='text.secondary'>Inicio:</Typography>
              <Typography variant='body2'>
                <HydratedDate date={suscripcion.fecha_inicio} format='date' />
              </Typography>
            </Box>
          )}
          {suscripcion.fecha_proximo_cobro && suscripcion.estado === 'ACTIVA' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' color='text.secondary'>Próximo cobro:</Typography>
              <Typography variant='body2'>
                <HydratedDate date={suscripcion.fecha_proximo_cobro} format='date' />
              </Typography>
            </Box>
          )}
          {suscripcion.fecha_cancelacion && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' color='text.secondary'>Cancelada el:</Typography>
              <Typography variant='body2'>
                <HydratedDate date={suscripcion.fecha_cancelacion} format='date' />
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant='subtitle2' fontWeight={600} mb={1}>
          Cursos incluidos:
        </Typography>
        <Stack spacing={0.5}>
          {suscripcion.plan.cursos.map(c => (
            <Typography key={c.curso_id} variant='body2' color='text.secondary'>
              · {c.curso.titulo}
            </Typography>
          ))}
        </Stack>

        {suscripcion.estado === 'ACTIVA' && (
          <Box mt={3}>
            <Button
              variant='tonal'
              color='error'
              size='small'
              onClick={handleCancelar}
              disabled={cancelar.isPending}
            >
              Cancelar suscripción
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SuscripcionCard
