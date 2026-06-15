import { redirect, notFound } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { PlanesSuscripcionPage } from '@/features/admin/planes-suscripcion/pages/PlanesSuscripcionPage'
import { AxiosPlanSuscripcion } from '@/features/admin/planes-suscripcion/http/axiosPlanSuscripcion'
import { AxiosCursoAdmin } from '@/features/admin/cursos/http/axiosCursoAdmin'

export const metadata = {
  title: 'Planes de Suscripción | Abeja Smart'
}

export default async function Page() {
  notFound()
  const session = await getAuthSession()

  if (!session) redirect('/login')

  const token = session.user?.accessToken ?? null
  const axiosPlan = new AxiosPlanSuscripcion({ getAuthToken: () => token })
  const axiosCurso = new AxiosCursoAdmin({ getAuthToken: () => token })

  let initialData: any[] = []
  let cursosInitialData: any[] = []

  const [planesResult, cursosResult] = await Promise.allSettled([
    axiosPlan.getAll(),
    axiosCurso.getLista()
  ])

  if (planesResult.status === 'fulfilled') initialData = planesResult.value.planes
  if (cursosResult.status === 'fulfilled') cursosInitialData = cursosResult.value

  return <PlanesSuscripcionPage initialData={initialData} cursosInitialData={cursosInitialData} />
}
