'use client'

import { Box, Button, Checkbox, FormControlLabel, styled, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { type FC, useState } from 'react'
import AppModal from '@/utils/components/AppModal'
import { Icon } from '@iconify/react'
import { useDeleteUsuario } from '../hooks/useUsuarios'

type DeleteUsuarioModalProps = {
  open: boolean
  handleClose: () => void
  usuario: {
    id: string
    nombre: string
    apellido: string
    correo: string
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

const UserInfoBox = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#424242',
  marginBottom: 24
}))

const DeleteUsuarioModal: FC<DeleteUsuarioModalProps> = ({ open, handleClose, usuario, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [confirmed, setConfirmed] = useState(false)
  const deleteUsuarioMutation = useDeleteUsuario()

  const handleDelete = async () => {
    if (!usuario || !confirmed) return

    try {
      await deleteUsuarioMutation.mutateAsync(usuario.id)

      enqueueSnackbar('Usuario eliminado exitosamente', { variant: 'success' })
      setConfirmed(false)
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Error al eliminar usuario'
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  const handleCloseModal = () => {
    if (!deleteUsuarioMutation.isPending) {
      setConfirmed(false)
      handleClose()
    }
  }

  if (!usuario) return null

  return (
    <AppModal open={open} handleClose={handleCloseModal}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Eliminar Usuario
      </Typography>

      <ContentWrapper>
        <WarningBox>
          <Icon icon='mdi:alert-circle' fontSize={32} color='#F57C00' />
          <Box>
            <Typography variant='subtitle1' fontWeight={600}>
              ¡Advertencia!
            </Typography>
            <Typography variant='body2'>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </Typography>
          </Box>
        </WarningBox>

        <Typography variant='body1' sx={{ mb: 2 }}>
          Estás a punto de eliminar al siguiente usuario:
        </Typography>

        <UserInfoBox>
          <Typography variant='body2' sx={{ mb: 1 }}>
            <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
          </Typography>
          <Typography variant='body2' sx={{ mb: 1 }}>
            <strong>Correo:</strong> {usuario.correo}
          </Typography>
          <Typography variant='body2'>
            <strong>ID:</strong> {usuario.id}
          </Typography>
        </UserInfoBox>

        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              disabled={deleteUsuarioMutation.isPending}
              color='error'
            />
          }
          label={
            <Typography variant='body2'>
              Confirmo que deseo eliminar este usuario de forma permanente
            </Typography>
          }
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant='outlined' onClick={handleCloseModal} disabled={deleteUsuarioMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDelete}
            disabled={!confirmed || deleteUsuarioMutation.isPending}
            startIcon={<Icon icon='mdi:delete' />}
          >
            {deleteUsuarioMutation.isPending ? 'Eliminando...' : 'Eliminar Usuario'}
          </Button>
        </Box>
      </ContentWrapper>
    </AppModal>
  )
}

export default DeleteUsuarioModal
