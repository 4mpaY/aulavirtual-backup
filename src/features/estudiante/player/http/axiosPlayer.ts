import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPlayer extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/estudiante/cursos`,
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
