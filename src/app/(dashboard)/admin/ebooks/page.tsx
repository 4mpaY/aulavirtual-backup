import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { EbooksPage } from '@/features/admin/ebooks/pages/EbooksPage'

export const metadata = {
  title: 'Gestión de Ebooks',
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <EbooksPage />
}
