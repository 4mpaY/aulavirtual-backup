import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosMedia extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/media`,
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

  async upload(file: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      const formData = new FormData()

      formData.append('file', file)

      const payload = await this.iPost<any>('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            onProgress(percentCompleted)
          }
        }
      })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const payload = await this.iDelete<any>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
