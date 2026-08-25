import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import MisCursosPage from '@/features/estudiante/mis-cursos/components/MisCursosPage'

export const metadata: Metadata = {
  title: 'Mis Cursos',
  description: 'Cursos inscritos del estudiante'
}

export default async function MyCoursesPage() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.rol !== 'ESTUDIANTE') {
    redirect('/login')
  }

  return <MisCursosPage />
}
