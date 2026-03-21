// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPassword from '@/features/shared/pages/ForgotPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña',
  description: 'Solicita un código para restablecer tu contraseña'
}

const ForgotPasswordPage = () => {
  // Vars
  const mode = getServerMode()

  return <ForgotPassword mode={mode} />
}

export default ForgotPasswordPage
