import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPerfil extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/perfil`,
      getAuthToken: params.getAuthToken
    })
  }

  async get(): Promise<any> {
    try {
      return await this.iGet<any>('')
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(payload: any): Promise<any> {
    try {
      return await this.iPut<any>('', payload)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
