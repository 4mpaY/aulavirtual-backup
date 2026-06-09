import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { SuscripcionAdmin } from '../entity/Suscripcion'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosSuscripcionAdmin extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/admin/suscripciones`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(params: Record<string, string> = {}): Promise<{ suscripciones: SuscripcionAdmin[]; total: number }> {
    try {
      const query = new URLSearchParams(params).toString()
      const res = await this.iGet<{ suscripciones: SuscripcionAdmin[]; total: number }>(query ? `?${query}` : '')

      return res ?? { suscripciones: [], total: 0 }
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async cancelar(id: string): Promise<{ message: string }> {
    try {
      return await this.iDelete<{ message: string }>(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async sync(): Promise<{ revisadas: number; pagosNuevos: number; estadosActualizados: number; errores: number }> {
    try {
      return await this.iPost('/sync')
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
