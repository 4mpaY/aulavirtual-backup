import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPerfil extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/perfil`,
      getAuthToken: params.getAuthToken
    })
  }

  async get(token?: string | null): Promise<any> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      
      return await this.iGet<any>('', config)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(payload: any, token?: string | null): Promise<any> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      
      return await this.iPut<any>('', payload, config)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
