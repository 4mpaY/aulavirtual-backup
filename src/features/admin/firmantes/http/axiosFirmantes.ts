import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Firmante } from '../entity/Firmante'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosFirmantes extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: params.baseURL ?? `${baseURL}/api/admin/firmantes`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<Firmante[]> {
    try {
      const res = await this.iGet<{ firmantes: Firmante[] }>('')

      return res?.firmantes || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getOne(id: string): Promise<Firmante> {
    try {
      const res = await this.iGet<{ firmante: Firmante }>(`/${id}`)

      return res.firmante
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: Partial<Firmante>): Promise<Firmante> {
    try {
      const res = await this.iPost<{ firmante: Firmante }>('', data)

      return res.firmante
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: Partial<Firmante>): Promise<Firmante> {
    try {
      const res = await this.iPatch<{ firmante: Firmante }>(`/${id}`, data)

      return res.firmante
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
