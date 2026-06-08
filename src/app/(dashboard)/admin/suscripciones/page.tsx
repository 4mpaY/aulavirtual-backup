import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'

export const metadata = {
  title: 'Suscripciones | Aula Virtual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  redirect('/admin/dashboard')
}
