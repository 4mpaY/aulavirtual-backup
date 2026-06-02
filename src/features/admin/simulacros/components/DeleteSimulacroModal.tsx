'use client'

import { useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, styled, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Icon } from '@iconify/react'
import AppModal from '@/utils/components/AppModal'
import { useDeleteSimulacro } from '../hooks/useSimulacros'
import type { Simulacro } from '../entity/Simulacro'

type Props = {
  open: boolean
  handleClose: () => void
  simulacro: Pick<Simulacro, 'id' | 'titulo' | 'slug' | 'estado'> | null
  onSuccess?: () => void
}

const WarningBox = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#FFF4E5' : '#3E2723',
  border: `1px solid ${theme.palette.mode === 'light' ? '#FFB74D' : '#5D4037'}`,
  marginBottom: 24,
}))

const InfoBox = styled(Box)(({ theme }) => ({
  padding: 16, borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#424242',
  marginBottom: 24,
}))

export default function DeleteSimulacroModal({ open, handleClose, simulacro, onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [confirmed, setConfirmed] = useState(false)
  const deleteMutation = useDeleteSimulacro()

  if (!simulacro) return null
  const noBorrador = simulacro.estado !== 'BORRADOR'

  const handleDelete = async () => {
    if (!confirmed) return
    try {
      await deleteMutation.mutateAsync(simulacro.id)
      enqueueSnackbar('Simulacro eliminado exitosamente', { variant: 'success' })
      setConfirmed(false)
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Error al eliminar el simulacro', { variant: 'error' })
    }
  }

  const handleCloseModal = () => {
    if (!deleteMutation.isPending) { setConfirmed(false); handleClose() }
  }

  return (
    <AppModal open={open} handleClose={handleCloseModal}>
      <Typography variant='h5' sx={{ mb: 2 }}>Eliminar Simulacro</Typography>
      <Box sx={{ py: 2 }}>
        <WarningBox>
          <Icon icon='mdi:alert-circle' fontSize={32} color='#F57C00' />
          <Box>
            <Typography variant='subtitle1' fontWeight={600}>¡Advertencia!</Typography>
            <Typography variant='body2'>
              {noBorrador
                ? 'Solo se pueden eliminar simulacros en estado Borrador.'
                : 'Esta acción eliminará el simulacro permanentemente.'}
            </Typography>
          </Box>
        </WarningBox>
        <InfoBox>
          <Typography variant='body2' sx={{ mb: 1 }}><strong>Título:</strong> {simulacro.titulo}</Typography>
          <Typography variant='body2'><strong>Slug:</strong> {simulacro.slug}</Typography>
        </InfoBox>
        {!noBorrador && (
          <FormControlLabel
            control={<Checkbox checked={confirmed} onChange={e => setConfirmed(e.target.checked)} color='error' />}
            label={<Typography variant='body2'>Confirmo que deseo eliminar este simulacro</Typography>}
          />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant='outlined' onClick={handleCloseModal} disabled={deleteMutation.isPending}>Cancelar</Button>
          <Button variant='contained' color='error' onClick={handleDelete}
            disabled={noBorrador || !confirmed || deleteMutation.isPending}
            startIcon={<Icon icon='mdi:delete' />}>
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}
