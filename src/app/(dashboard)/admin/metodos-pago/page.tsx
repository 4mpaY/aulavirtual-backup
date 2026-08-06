import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import MetodosPagoPage from '@/features/admin/metodos-pago/pages/MetodosPagoPage'

export const metadata = {
  title: 'Métodos de Pago Manual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <MetodosPagoPage />
}
