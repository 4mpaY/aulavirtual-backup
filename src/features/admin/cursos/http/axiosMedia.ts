import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMedia extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/media`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(): Promise<any[]> {
    try {
      const payload = await this.iGet<any[]>('')

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async upload(file: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const payload = await this.iPost<any>('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
