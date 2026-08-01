import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosWebCursos extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/web`,
      getAuthToken: params.getAuthToken
    })
  }

  async getCatalog(tipo?: 'CURSO' | 'DIPLOMADO' | 'ESPECIALIZACION'): Promise<{ courses: any[], categories: any[] }> {
    try {
      const query = tipo ? `?tipo=${tipo}` : ''
      const payload = await this.iGet<{ courses: any[], categories: any[] }>(`/catalogo${query}`)

      return {
        courses: payload?.courses || [],
        categories: payload?.categories || []
      }
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getCourseBySlug(slug: string): Promise<any | null> {
    try {
      const payload = await this.iGet<{ course: any }>(`/cursos/${slug}`)

      return payload?.course || null
    } catch (err: any) {
      if (err?.statusCode === 404) return null
      throw err?.response?.data ?? err
    }
  }
}
