// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ResetPassword from '@/features/shared/pages/ResetPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña',
  description: 'Ingresa tu nuevo código y contraseña'
}

const ResetPasswordPage = () => {
  // Vars
  const mode = getServerMode()

  return <ResetPassword mode={mode} />
}

export default ResetPasswordPage
