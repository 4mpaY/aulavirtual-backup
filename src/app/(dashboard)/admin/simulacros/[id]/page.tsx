import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { SimulacroFormPage } from '@/features/admin/simulacros/pages/SimulacroFormPage'
import { getAuthSession } from '@/utils/libs/auth-helpers'

export const metadata: Metadata = {
  title: 'Editar Simulacro',
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getAuthSession()
  if (!session) redirect('/login')
  return <SimulacroFormPage mode='edit' simulacroId={params.id} />
}
