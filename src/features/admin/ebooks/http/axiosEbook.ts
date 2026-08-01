import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Ebook, CreateEbookDto, UpdateEbookDto } from '../entity/Ebook'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosEbook extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/admin/ebooks`,
      getAuthToken: params.getAuthToken,
    })
  }

  async getAll(params?: { buscar?: string; estado?: string }): Promise<Ebook[]> {
    try {
      const query = new URLSearchParams()

      if (params?.buscar) query.set('buscar', params.buscar)
      if (params?.estado) query.set('estado', params.estado)
      const qs = query.toString() ? `?${query.toString()}` : ''

      const { ebooks } = await this.iGet<{ ebooks: Ebook[] }>(`${qs}`)

      return ebooks
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Ebook> {
    try {
      const { ebook } = await this.iGet<{ ebook: Ebook }>(`/${id}`)

      return ebook
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(payload: CreateEbookDto): Promise<Ebook> {
    try {
      const { ebook } = await this.iPost<{ ebook: Ebook }>('', payload)

      return ebook
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, payload: UpdateEbookDto): Promise<Ebook> {
    try {
      const { ebook } = await this.iPut<{ ebook: Ebook }>(`/${id}`, payload)

      return ebook
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.iDelete(`/${id}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
