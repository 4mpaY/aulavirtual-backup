import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'


import { CuponesPage } from '@/features/admin/cupones/pages/CuponesPage'
import { AxiosCupon } from '@/features/admin/cupones/http/axiosCupon'


export const metadata = {
  title: 'Gestión de Cupones | Aula Virtual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosCupon = new AxiosCupon({
    getAuthToken: () => token
  })

  let initialData: any[] = []

  try {
    initialData = await axiosCupon.getAll()
  } catch (error) {
    console.error('Error fetching cupones:', error)
  }

  return <CuponesPage initialData={initialData} />
}
