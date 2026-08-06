import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import FirmantesPage from '@/features/admin/firmantes/pages/FirmantesPage'

export const metadata = {
  title: 'Firmantes'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <FirmantesPage />
}
