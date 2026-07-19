import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { PlantillaCertificado } from '../entity/PlantillaCertificado'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPlantillaCertificado extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: params.baseURL ?? `${baseURL}/api/admin/plantillas-certificado`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<PlantillaCertificado[]> {
    try {
      const res = await this.iGet<{ plantillas: PlantillaCertificado[] }>('')

      return res?.plantillas || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getOne(id: string): Promise<PlantillaCertificado> {
    try {
      const res = await this.iGet<{ plantilla: PlantillaCertificado }>(`/${id}`)

      return res.plantilla
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(data: Partial<PlantillaCertificado>): Promise<PlantillaCertificado> {
    try {
      const res = await this.iPost<{ plantilla: PlantillaCertificado }>('', data)

      return res.plantilla
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, data: Partial<PlantillaCertificado>): Promise<PlantillaCertificado> {
    try {
      const res = await this.iPatch<{ plantilla: PlantillaCertificado }>(`/${id}`, data)

      return res.plantilla
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
