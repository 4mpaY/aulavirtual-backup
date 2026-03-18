import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosRuta extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(): Promise<any[]> {
    try {
      const payload = await this.iGet<any>('/rutas')

      return payload?.result ?? []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getBySlug(slug: string): Promise<any> {
    try {
      const payload = await this.iGet<{ result: any }>(`/rutas/${slug}`)

      return payload?.result ?? null
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
