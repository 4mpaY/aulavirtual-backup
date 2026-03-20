import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMisCursos extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/estudiante/mis-cursos`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<any[]> {
    try {
      const payload = await this.iGet<{ courses: any[] }>('')

      return payload?.courses || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
