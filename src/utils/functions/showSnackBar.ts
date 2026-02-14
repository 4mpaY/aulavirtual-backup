import type { OptionsObject } from 'notistack'

// Tipos para variantes de snackbar

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info'

export const showSnackbar = (
  enqueueSnackbar: (message: string, options?: OptionsObject) => void,
  message: string,
  variant: SnackbarVariant,
  duration = 3000
) => {
  enqueueSnackbar(message, {
    variant: variant,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    autoHideDuration: duration
  })
}
