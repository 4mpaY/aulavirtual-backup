import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { PlanSuscripcion, PlanPayload } from '../entity/PlanSuscripcion'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPlanSuscripcion extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: params.baseURL ?? `${baseURL}/api/admin/planes-suscripcion`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(buscar: string = ''): Promise<{ planes: PlanSuscripcion[]; total: number }> {
    try {
      const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ''
      const res = await this.iGet<{ planes: PlanSuscripcion[]; total: number }>(query)

      return res ?? { planes: [], total: 0 }
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: PlanPayload): Promise<PlanSuscripcion> {
    try {
      const res = await this.iPost<{ plan: PlanSuscripcion }>('', data)

      return res.plan
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: Partial<PlanPayload>): Promise<PlanSuscripcion> {
    try {
      const res = await this.iPatch<{ plan: PlanSuscripcion }>(`/${id}`, data)

      return res.plan
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
