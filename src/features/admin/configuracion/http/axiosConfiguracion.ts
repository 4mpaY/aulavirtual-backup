import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Configuracion } from '../entity/Configuracion'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosConfiguracion extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/configuracion`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<Configuracion[]> {
    try {
      return await this.iGet<any[]>('')
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async save(configuraciones: any[]): Promise<any> {
    try {
      return await this.iPost<any>('', { configuraciones })
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
