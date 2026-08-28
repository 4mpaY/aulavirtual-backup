// Component Imports
import Providers from '@/utils/components/providers/Providers'
import BlankLayout from '@layouts/BlankLayout'
import Unauthorized from '@/features/shared/pages/Unauthorized'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Acceso No Autorizado',
  description: 'No tienes los permisos necesarios para acceder a esta página.'
}

const UnauthorizedPage = () => {
  // Vars
  const direction = 'ltr'
  const mode = getServerMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <Unauthorized mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default UnauthorizedPage
