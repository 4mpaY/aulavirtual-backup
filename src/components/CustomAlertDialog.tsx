import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material'

import { blockDialogCloseWhile } from '@/utils/functions/dialogClose'

interface CustomAlertDialogProps {
  open: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  confirmText?: string
  cancelText?: string
  color?: 'primary' | 'error' | 'warning' | 'info' | 'success'
}

const CustomAlertDialog = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  color = 'primary'
}: CustomAlertDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={blockDialogCloseWhile(loading, onClose)}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={onClose} disabled={loading} color='inherit'>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color={color}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color='inherit' /> : null}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CustomAlertDialog
