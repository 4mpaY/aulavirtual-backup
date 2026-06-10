import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

export interface EbookPublico {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  autor?: string | null
  miniatura?: string | null
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  paginas?: number | null
  genero?: string | null
}

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosWebEbooks extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/ebooks`,
      getAuthToken: params.getAuthToken,
    })
  }

  async getCatalog(params?: { buscar?: string; categoria_id?: string }): Promise<{ ebooks: EbookPublico[]; categorias: { id: string; nombre: string }[] }> {
    try {
      const query = new URLSearchParams()

      if (params?.buscar) query.set('buscar', params.buscar)
      if (params?.categoria_id) query.set('categoria_id', params.categoria_id)
      const qs = query.toString() ? `?${query.toString()}` : ''

      return await this.iGet<{ ebooks: EbookPublico[]; categorias: { id: string; nombre: string }[] }>(qs)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getBySlug(slug: string): Promise<EbookPublico> {
    try {
      const { ebook } = await this.iGet<{ ebook: EbookPublico }>(`/${slug}`)

      return ebook
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
