import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMisSimulacros extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/estudiante/mis-simulacros`,
      getAuthToken: params.getAuthToken,
    })
  }

  async getAll(): Promise<any[]> {
    try {
      const payload = await this.iGet<{ simulacros: any[] }>('')

      return payload?.simulacros || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
