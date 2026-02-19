import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Usuario } from '../entity/Usuario'
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '@/schemas/usuario.schema'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosUsuario extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(): Promise<Usuario[]> {
    try {
      const payload = await this.iGet<Usuario[]>()

      return payload || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Usuario> {
    try {
      const payload = await this.iGet<Usuario>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(usuario: CrearUsuarioDto): Promise<{ id: string }> {
    try {
      const payload = await this.iPost<{ id: string }>('', usuario)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, usuario: ActualizarUsuarioDto): Promise<Usuario> {
    try {
      const payload = await this.iPatch<Usuario>(`/${id}`, usuario)

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

  async toggleStatus(id: string, esta_activo: boolean): Promise<Usuario> {
    try {
      const payload = await this.iPatch<Usuario>(`/${id}`, { esta_activo })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
