import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { EventoExterno } from '../entity/EventoExterno'
import type { CrearEventoExternoDto, ActualizarEventoExternoDto } from '@/schemas/eventoExterno.schema'

type Params = {
  axiosLib?: AxiosStatic
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosEventoExterno extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${getBaseURL()}/api/eventos-externos`,
      getAuthToken: params.getAuthToken
    })
  }

  async create(evento: CrearEventoExternoDto): Promise<{ evento: EventoExterno }> {
    try {
      const payload = await this.iPost<{ evento: EventoExterno }>('', evento)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, evento: ActualizarEventoExternoDto): Promise<{ evento: EventoExterno }> {
    try {
      const payload = await this.iPatch<{ evento: EventoExterno }>(`/${id}`, evento)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const payload = await this.iDelete<{ message: string }>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
