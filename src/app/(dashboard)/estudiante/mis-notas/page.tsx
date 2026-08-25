import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import MisNotasPage from '@/features/estudiante/mis-notas/components/MisNotasPage'

export const metadata: Metadata = {
  title: 'Mis Notas',
  description: 'Historial de calificaciones del estudiante'
}

export default async function MisNotasRoute() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.rol !== 'ESTUDIANTE') {
    redirect('/login')
  }

  return <MisNotasPage />
}
