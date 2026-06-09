'use client'

import { useState, useEffect } from 'react'

import {
  Box,
  Typography,
  MenuItem,
  Button,
  Chip,
  Divider
} from '@mui/material'

import { toast } from 'react-toastify'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@/@core/components/mui/TextField'
import { useActualizarSuscripcionAdmin } from '../hooks/useSuscripcionesAdmin'
import type { SuscripcionAdmin, EstadoSuscripcion } from '../entity/Suscripcion'

const ESTADOS: { value: EstadoSuscripcion; label: string; color: 'success' | 'error' | 'warning' | 'secondary' | 'info' }[] = [
  { value: 'ACTIVA', label: 'Activa', color: 'success' },
  { value: 'EN_PRUEBA', label: 'En Prueba', color: 'info' },
  { value: 'PENDIENTE', label: 'Pendiente', color: 'warning' },
  { value: 'VENCIDA', label: 'Vencida', color: 'error' },
  { value: 'CANCELADA', label: 'Cancelada', color: 'secondary' }
]

interface Props {
  open: boolean
  suscripcion: SuscripcionAdmin | null
  handleClose: () => void
}

export function EditarSuscripcionModal({ open, suscripcion, handleClose }: Props) {
  const actualizar = useActualizarSuscripcionAdmin()

  const [estado, setEstado] = useState<EstadoSuscripcion>('PENDIENTE')
  const [fechaProximoCobro, setFechaProximoCobro] = useState('')

  useEffect(() => {
    if (suscripcion) {
      setEstado(suscripcion.estado)
      setFechaProximoCobro(
        suscripcion.fecha_proximo_cobro
          ? suscripcion.fecha_proximo_cobro.slice(0, 10)
          : ''
      )
    }
  }, [suscripcion])

  const handleGuardar = async () => {
    if (!suscripcion) return

    try {
      await actualizar.mutateAsync({
        id: suscripcion.id,
        data: {
          estado,
          fecha_proximo_cobro: fechaProximoCobro || null
        }
      })
      toast.success('Suscripción actualizada')
      handleClose()
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar la suscripción')
    }
  }

  if (!suscripcion) return null

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Box sx={{ p: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
          Editar Suscripción
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {suscripcion.usuario.nombre} {suscripcion.usuario.apellido} — {suscripcion.plan.nombre}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CustomTextField
            select
            fullWidth
            label='Estado'
            value={estado}
            onChange={e => setEstado(e.target.value as EstadoSuscripcion)}
          >
            {ESTADOS.map(e => (
              <MenuItem key={e.value} value={e.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip label={e.label} color={e.color} size='small' sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                </Box>
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            fullWidth
            type='date'
            label='Próximo Cobro'
            value={fechaProximoCobro}
            onChange={e => setFechaProximoCobro(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText='Dejar vacío para borrar la fecha'
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button variant='outlined' color='secondary' onClick={handleClose} disabled={actualizar.isPending}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleGuardar}
            disabled={actualizar.isPending}
            startIcon={actualizar.isPending ? <i className='tabler-loader-2' style={{ animation: 'spin 1s linear infinite' }} /> : <i className='tabler-device-floppy' />}
          >
            {actualizar.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}
