import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { MetodoPagoManual } from '../entity/MetodoPagoManual'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMetodosPago extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: params.baseURL ?? `${baseURL}/api/admin/metodos-pago`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<MetodoPagoManual[]> {
    try {
      const res = await this.iGet<{ metodos: MetodoPagoManual[] }>('')

      return res?.metodos || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: Partial<MetodoPagoManual>): Promise<MetodoPagoManual> {
    try {
      const res = await this.iPost<{ metodo: MetodoPagoManual }>('', data)

      return res.metodo
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: Partial<MetodoPagoManual>): Promise<MetodoPagoManual> {
    try {
      const res = await this.iPut<{ metodo: MetodoPagoManual }>(`/${id}`, data)

      return res.metodo
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      return await this.iDelete<{ message: string }>(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
