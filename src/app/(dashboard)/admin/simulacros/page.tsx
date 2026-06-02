import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { SimulacrosPage } from '@/features/admin/simulacros/pages/SimulacrosPage'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { AxiosSimulacro } from '@/features/admin/simulacros/http/axiosSimulacro'
import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

export const metadata: Metadata = {
  title: 'Gestión de Simulacros',
  description: 'Administra los simulacros de la plataforma',
}

export default async function Page() {
  const session = await getAuthSession()
  if (!session) redirect('/login')

  const token = session.user?.accessToken ?? null
  const axios = new AxiosSimulacro({ getAuthToken: () => token })

  let initialData: Simulacro[] = []
  try {
    const res = await axios.searchAll({ limit: 100 })
    initialData = res.simulacros
  } catch (e) {
    console.error('Error fetching simulacros:', e)
  }

  return <SimulacrosPage initialData={initialData} />
}
