import { redirect, notFound } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { SuscripcionPage } from '@/features/estudiante/suscripciones/pages/SuscripcionPage'

export const metadata = {
  title: 'Mi Suscripción | Abeja Smart'
}

export default async function Page() {
  notFound()
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <SuscripcionPage />
}
