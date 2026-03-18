import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { CertificadosResponse } from '../entity/Certificado'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCertificado extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/certificados`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(params: { page: number; limit: number; buscar: string }): Promise<CertificadosResponse['result']> {
    try {
      return await this.iGet<CertificadosResponse['result']>('', { params })
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async downloadPdf(id: string): Promise<Blob> {
    try {
      const res = await this.client.get(`/${id}/download`, {
        responseType: 'blob'
      })

      return res.data
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
