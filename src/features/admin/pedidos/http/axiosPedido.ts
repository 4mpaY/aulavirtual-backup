import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Pedido } from '../entity/Pedido'
import type { CrearPedidoManualDto } from '@/schemas/pedido.schema'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosPedido extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/pedidos`,
      getAuthToken: params.getAuthToken
    })
  }

  async getAll(query?: Record<string, string>): Promise<{ pedidos: Pedido[]; paginacion: any }> {
    try {
      const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
      const payload = await this.iGet<{ pedidos: Pedido[]; paginacion: any }>(queryString)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createManual(pedido: CrearPedidoManualDto): Promise<{ message: string; data: any }> {
    try {
      const payload = await this.iPost<{ message: string; data: any }>('/manual', pedido)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
