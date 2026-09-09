import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'


import { CourseBuilderPage } from '@/features/admin/cursos/pages/CourseBuilderPage'


export const metadata = {
  title: 'Editor de Curso | Profesor',
  description: 'Edita el contenido de tu curso'
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const profesores = [{
    id: session.user.id,
    nombre: session.user.name || 'Yo',
    apellido: ''
  }]

  return <CourseBuilderPage cursoId={params.id} profesores={profesores} />
}
