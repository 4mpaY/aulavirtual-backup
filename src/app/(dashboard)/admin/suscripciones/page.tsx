import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { SuscripcionesAdminPage } from '@/features/admin/suscripciones/pages/SuscripcionesAdminPage'

export const metadata = {
  title: 'Suscripciones | Aula Virtual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <SuscripcionesAdminPage />
}
