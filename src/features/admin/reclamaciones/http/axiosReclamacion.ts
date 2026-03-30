import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Reclamacion } from '../entity/Reclamacion'
import type { UpdateReclamacionDto } from '@/schemas/reclamacion.schema'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosReclamacion extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/reclamaciones`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(query?: Record<string, string>): Promise<{ reclamaciones: Reclamacion[]; paginacion: any }> {
    try {
      const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
      const payload = await this.iGet<{ reclamaciones: Reclamacion[]; paginacion: any }>(queryString)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updateReclamacion(id: string, data: UpdateReclamacionDto): Promise<{ message: string; data: Reclamacion }> {
    try {
      const payload = await this.iPatch<{ message: string; data: Reclamacion }>(`/${id}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
