import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCupon extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/cupones`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(buscar: string = ''): Promise<any[]> {
    try {
      const query = buscar ? `?buscar=${buscar}` : ''
      const res = await this.iGet<any>(query)
      
      return res.cupones || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: any): Promise<any> {
    try {
      return await this.iPost<any>('', data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      return await this.iPatch<any>(`/${id}`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.iDelete<any>(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
