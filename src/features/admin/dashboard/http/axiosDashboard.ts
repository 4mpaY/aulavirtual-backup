import axios from 'axios'

import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { DashboardData } from '../entity/Dashboard'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosDashboard extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/admin/dashboard`,
      getAuthToken: params.getAuthToken
    })
  }

  async getResumen(): Promise<DashboardData> {
    try {
      return await this.iGet<any>('')
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
