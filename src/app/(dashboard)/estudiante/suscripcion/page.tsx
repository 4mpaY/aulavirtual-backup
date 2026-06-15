import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { SuscripcionPage } from '@/features/estudiante/suscripciones/pages/SuscripcionPage'

export const metadata = {
  title: 'Mi Suscripción | Aula Virtual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <SuscripcionPage />
}
