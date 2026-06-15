import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

export interface MiEbook {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  autor?: string | null
  miniatura?: string | null
  paginas?: number | null
  genero?: string | null
}

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMisEbooks extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/estudiante/ebooks`,
      getAuthToken: params.getAuthToken,
    })
  }

  async getMisEbooks(): Promise<MiEbook[]> {
    try {
      const { ebooks } = await this.iGet<{ ebooks: MiEbook[] }>('')

      return ebooks
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
