import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { DetalleNotasCurso, MisNotasResponse } from '../entity/Notas'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMisNotas extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/estudiante/notas`,
      getAuthToken: params.getAuthToken
    })
  }

  async getHistorial(query?: { anio?: string; categoria_id?: string }): Promise<MisNotasResponse> {
    try {
      const qs = query ? `?${new URLSearchParams(Object.entries(query).filter(([, v]) => v)).toString()}` : ''

      return await this.iGet<MisNotasResponse>(qs)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getDetalleCurso(cursoId: string): Promise<DetalleNotasCurso> {
    try {
      return await this.iGet<DetalleNotasCurso>(`/${cursoId}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
