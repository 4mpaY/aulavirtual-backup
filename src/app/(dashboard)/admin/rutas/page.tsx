import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { RutasPage } from '@/features/admin/rutas'
import { AxiosRuta } from '@/features/admin/rutas/http/axiosRuta'
import { authOptions } from '@/utils/configs/auth'
import type { Ruta } from '@/features/admin/rutas/entity/Ruta'

export const metadata = {
  title: 'Gestión de Rutas | Aula Virtual'
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosRuta = new AxiosRuta({
    getAuthToken: () => token
  })

  let initialData: Ruta[] = []

  try {
    initialData = await axiosRuta.getAll()
  } catch (error) {
    console.error('Error fetching rutas:', error)
  }

  return <RutasPage initialData={initialData} />
}
