import type { ModalProps } from '@mui/material'

type CloseReason = Parameters<NonNullable<ModalProps['onClose']>>[1]

export function blockDialogCloseWhile(blocked: boolean, onClose: () => void) {
  return (_event: object, reason?: CloseReason) => {
    if (blocked) return
    if (reason === 'backdropClick' || reason === 'escapeKeyDown' || reason === undefined) {
      onClose()
    }
  }
}
