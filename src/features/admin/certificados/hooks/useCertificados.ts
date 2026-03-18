import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosCertificado } from '../http/axiosCertificado'
import type { CertificadosResponse } from '../entity/Certificado'

const axiosCertificadoFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosCertificado({ getAuthToken })
}

export const useCertificados = (
  params: { page: number; limit: number; buscar: string },
  initialData?: CertificadosResponse['result']
) => {
  return useQuery({
    queryKey: ['admin-certificados', params],
    queryFn: async () => {
      const axiosCertificado = axiosCertificadoFactory()

      return await axiosCertificado.getAll(params)
    },
    initialData,
    placeholderData: previousData => previousData
  })
}
