import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Cupon, CuponPayload } from '../entity/Cupon'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCupon extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: params.baseURL ?? `${baseURL}/api/cupones`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(buscar: string = ''): Promise<Cupon[]> {
    try {
      const query = buscar ? `?buscar=${buscar}` : ''
      const res = await this.iGet<{ cupones: Cupon[] }>(query)

      return res?.cupones || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: CuponPayload): Promise<Cupon> {
    try {
      return await this.iPost<Cupon>('', data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: Partial<CuponPayload>): Promise<Cupon> {
    try {
      return await this.iPatch<Cupon>(`/${id}`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      return await this.iDelete<{ message: string }>(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
