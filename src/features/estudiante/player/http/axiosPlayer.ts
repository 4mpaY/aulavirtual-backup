import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPlayer extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/estudiante/cursos`,
      getAuthToken: params.getAuthToken
    })
  }

  async getPlayerData(slug: string): Promise<{ course: any }> {
    try {
      const payload = await this.iGet<{ course: any }>(`/${slug}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
