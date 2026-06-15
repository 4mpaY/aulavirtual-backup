import { redirect, notFound } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { EbooksPage } from '@/features/admin/ebooks/pages/EbooksPage'

export const metadata = {
  title: 'Gestión de Ebooks | Abeja Smart',
}

export default async function Page() {
  notFound()
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <EbooksPage />
}
