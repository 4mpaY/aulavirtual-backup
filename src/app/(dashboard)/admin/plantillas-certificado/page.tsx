import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import PlantillasCertificadoPage from '@/features/admin/plantillas-certificado/pages/PlantillasCertificadoPage'

export const metadata = {
  title: 'Plantillas de Certificado'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <PlantillasCertificadoPage />
}
