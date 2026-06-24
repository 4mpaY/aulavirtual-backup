import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Simulacro, CrearSimulacroDto, ActualizarSimulacroDto, CambiarEstadoSimulacroDto } from '../entity/Simulacro'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosSimulacro extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/simulacros`,
      getAuthToken: params.getAuthToken,
    })
  }

  async searchAll(query?: Record<string, any>): Promise<{ simulacros: Simulacro[]; pagination: any }> {
    try {
      const qs = query ? '?' + new URLSearchParams(query as any).toString() : ''

      return await this.iGet(qs)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Simulacro> {
    try {
      return await this.iGet(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(dto: CrearSimulacroDto): Promise<Simulacro> {
    try {
      return await this.iPost('', dto)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, dto: ActualizarSimulacroDto): Promise<Simulacro> {
    try {
      return await this.iPatch(`/${id}`, dto)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.iDelete(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async cambiarEstado(id: string, dto: CambiarEstadoSimulacroDto): Promise<Simulacro> {
    try {
      return await this.iPatch(`/${id}/estado`, dto)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
