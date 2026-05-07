import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import MisCertificadosPage from '@/features/estudiante/certificados/components/MisCertificadosPage'
import { AxiosMisCertificados } from '@/features/estudiante/certificados/http/axiosMisCertificados'

export default async function MisCertificadosPageRoute() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null
  const client = new AxiosMisCertificados({ getAuthToken: () => token })

  let certificados: any[] = []

  try {
    certificados = await client.getAll()
  } catch (error) {
    console.error('Error fetching certificates:', error)
  }

  return <MisCertificadosPage initialCertificados={certificados} />
}
