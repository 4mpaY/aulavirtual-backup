import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Ruta } from '../entity/Ruta'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosRuta extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/admin/rutas`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<Ruta[]> {
    try {
      const payload = await this.iGet<Ruta[]>('')

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Ruta> {
    try {
      const payload = await this.iGet<Ruta>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(payload: any): Promise<any> {
    try {
      const result = await this.iPost<any>('', payload)

      return result
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, payload: any): Promise<any> {
    try {
      const result = await this.iPut<any>(`/${id}`, payload)

      return result
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const result = await this.iDelete<any>(`/${id}`)

      return result
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async manageCursos(id: string, payload: { cursos: any[]; secciones: any[] }): Promise<any> {
    try {
      const result = await this.iPost<any>(`/${id}/cursos`, payload)

      return result
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
