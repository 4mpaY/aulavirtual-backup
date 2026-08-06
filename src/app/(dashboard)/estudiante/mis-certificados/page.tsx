import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import MisCertificadosPage from '@/features/estudiante/certificados/components/MisCertificadosPage'
import { getMisCertificados } from '@/features/estudiante/certificados/server/getMisCertificados'

export default async function MisCertificadosPageRoute() {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const certificados = await getMisCertificados(session.user!.id)

  return <MisCertificadosPage initialCertificados={certificados} />
}
