'use client'

import { useState } from 'react'

import { Box, Button, Checkbox, FormControlLabel, styled, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { Icon } from '@iconify/react'

import AppModal from '@/utils/components/AppModal'


import { useDeleteCategoria } from '../hooks/useCategorias'

type DeleteCategoriaModalProps = {
  open: boolean
  handleClose: () => void
  categoria: {
    id: string
    nombre: string
    slug: string
  } | null
  onSuccess?: () => void
}

const ContentWrapper = styled(Box)(() => ({
  padding: '16px 0'
}))

const WarningBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#FFF4E5' : '#3E2723',
  border: `1px solid ${theme.palette.mode === 'light' ? '#FFB74D' : '#5D4037'}`,
  marginBottom: 24
}))

const InfoBox = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#424242',
  marginBottom: 24
}))

export const DeleteCategoriaModal = ({ open, handleClose, categoria, onSuccess }: DeleteCategoriaModalProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const [confirmed, setConfirmed] = useState(false)
  const deleteCategoriaMutation = useDeleteCategoria()

  const handleDelete = async () => {
    if (!categoria || !confirmed) return

    try {
      await deleteCategoriaMutation.mutateAsync(categoria.id)

      enqueueSnackbar('Categoría eliminada exitosamente', { variant: 'success' })
      setConfirmed(false)
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Error al eliminar categoría'

      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  const handleCloseModal = () => {
    if (!deleteCategoriaMutation.isPending) {
      setConfirmed(false)
      handleClose()
    }
  }

  if (!categoria) return null

  return (
    <AppModal open={open} handleClose={handleCloseModal}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Eliminar Categoría
      </Typography>

      <ContentWrapper>
        <WarningBox>
          <Icon icon='mdi:alert-circle' fontSize={32} color='#F57C00' />
          <Box>
            <Typography variant='subtitle1' fontWeight={600}>
              ¡Advertencia!
            </Typography>
            <Typography variant='body2'>
              Esta acción no se puede deshacer. Las subcategorías se desvincularan y los cursos perderán su categorización.
            </Typography>
          </Box>
        </WarningBox>

        <Typography variant='body1' sx={{ mb: 2 }}>
          Estás a punto de eliminar la siguiente categoría:
        </Typography>

        <InfoBox>
          <Typography variant='body2' sx={{ mb: 1 }}>
            <strong>Nombre:</strong> {categoria.nombre}
          </Typography>
          <Typography variant='body2'>
            <strong>Slug:</strong> {categoria.slug}
          </Typography>
        </InfoBox>

        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              disabled={deleteCategoriaMutation.isPending}
              color='error'
            />
          }
          label={
            <Typography variant='body2'>
              Confirmo que deseo eliminar esta categoría de forma permanente
            </Typography>
          }
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant='outlined' onClick={handleCloseModal} disabled={deleteCategoriaMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDelete}
            disabled={!confirmed || deleteCategoriaMutation.isPending}
            startIcon={<Icon icon='mdi:delete' />}
          >
            {deleteCategoriaMutation.isPending ? 'Eliminando...' : 'Eliminar Categoría'}
          </Button>
        </Box>
      </ContentWrapper>
    </AppModal>
  )
}

