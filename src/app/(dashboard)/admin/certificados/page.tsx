import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { CertificadosTable } from '@/features/admin/certificados/components/CertificadosTable'
import { AxiosCertificado } from '@/features/admin/certificados/http/axiosCertificado'
import { authOptions } from '@/utils/configs/auth'
import type { CertificadosResponse } from '@/features/admin/certificados/entity/Certificado'

export const metadata = {
  title: 'Gestión de Certificados | Aula Virtual'
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosCertificado = new AxiosCertificado({
    getAuthToken: () => token
  })

  let initialData: CertificadosResponse | null = null

  try {
    initialData = await axiosCertificado.getAll({ page: 1, limit: 10, buscar: '' })
  } catch (error) {
    console.error('Error fetching certificados:', error)
  }

  return <CertificadosTable initialData={initialData} />
}
