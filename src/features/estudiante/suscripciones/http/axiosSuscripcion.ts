import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Suscripcion, PlanPublico } from '../entity/Suscripcion'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosSuscripcion extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/estudiante/suscripciones`,
      getAuthToken: params.getAuthToken
    })
  }

  async getMiSuscripcion(): Promise<Suscripcion | null> {
    try {
      const res = await this.iGet<{ suscripcion: Suscripcion | null }>('')

      return res?.suscripcion ?? null
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async suscribirse(data: { planId: string; tokenId: string }): Promise<Suscripcion> {
    try {
      const res = await this.iPost<{ suscripcion: Suscripcion }>('', data)

      return res.suscripcion
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
}

export class AxiosPlanesSuscripcion extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/planes-suscripcion`,
      getAuthToken: params.getAuthToken
    })
  }

  async getPlanes(): Promise<PlanPublico[]> {
    try {
      const res = await this.iGet<{ planes: PlanPublico[] }>('')

      return res?.planes ?? []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
