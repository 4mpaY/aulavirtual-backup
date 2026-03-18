import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import type { CertificadosResponse } from '../entity/Certificado'

export const useCertificados = (params: { page: number; limit: number; buscar: string }) => {
  return useQuery({
    queryKey: ['admin-certificados', params],
    queryFn: async () => {
      const { data } = await axios.get<CertificadosResponse>('/api/admin/certificados', {
        params
      })

      return data.result
    },
    placeholderData: previousData => previousData
  })
}
