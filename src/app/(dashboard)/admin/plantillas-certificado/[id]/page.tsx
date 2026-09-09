import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import PlantillaCertificadoEditorPage from '@/features/admin/plantillas-certificado/pages/PlantillaCertificadoEditorPage'

export const metadata: Metadata = {
  title: 'Editor de Plantilla de Certificado',
  description: 'Diseña la cara 1 y cara 2 de un certificado y posiciona sus campos dinámicos'
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getAuthSession()

  if (!session) redirect('/login')

  return <PlantillaCertificadoEditorPage plantillaId={params.id} />
}
