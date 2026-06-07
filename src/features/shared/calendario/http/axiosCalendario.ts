import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCalendario extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/calendario`,
      getAuthToken: params.getAuthToken
    })
  }

  async getEventos(desde?: string, hasta?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams()

      if (desde) params.set('desde', desde)
      if (hasta) params.set('hasta', hasta)

      const qs = params.toString() ? `?${params.toString()}` : ''

      return await this.iGet<any[]>(qs)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
