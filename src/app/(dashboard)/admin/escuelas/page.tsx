import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { EscuelasPage } from '@/features/admin/escuelas'
import { AxiosEscuela } from '@/features/admin/escuelas/http/axiosEscuela'
import type { Escuela } from '@/features/admin/escuelas/entity/Escuela'

export const metadata = {
  title: 'Gestión de Escuelas | Aula Virtual'
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosEscuela = new AxiosEscuela({
    getAuthToken: () => token
  })

  let initialData: Escuela[] = []

  try {
    initialData = await axiosEscuela.getAll()
  } catch (error) {
    console.error('Error fetching escuelas:', error)
  }

  return <EscuelasPage initialData={initialData} />
}
