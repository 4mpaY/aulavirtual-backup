import { redirect, notFound } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { SuscripcionesAdminPage } from '@/features/admin/suscripciones/pages/SuscripcionesAdminPage'

export const metadata = {
  title: 'Suscripciones | Abeja Smart'
}

export default async function Page() {
  notFound()
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <SuscripcionesAdminPage />
}
