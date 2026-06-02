import axios from '@/utils/libs/axios'
import type { Simulacro, CrearSimulacroDto, ActualizarSimulacroDto, CambiarEstadoSimulacroDto } from '../entity/Simulacro'

interface AuthConfig { getAuthToken: () => string | null }

export class AxiosSimulacro {
  private token: string | null

  constructor({ getAuthToken }: AuthConfig) {
    this.token = getAuthToken()
  }

  private headers() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
  }

  async searchAll(params?: Record<string, any>) {
    const { data } = await axios.get('/api/simulacros', { params, headers: this.headers() })
    return data.data as { simulacros: Simulacro[]; pagination: any }
  }

  async getById(id: string) {
    const { data } = await axios.get(`/api/simulacros/${id}`, { headers: this.headers() })
    return data.data as Simulacro
  }

  async create(dto: CrearSimulacroDto) {
    const { data } = await axios.post('/api/simulacros', dto, { headers: this.headers() })
    return data.data as Simulacro
  }

  async update(id: string, dto: ActualizarSimulacroDto) {
    const { data } = await axios.patch(`/api/simulacros/${id}`, dto, { headers: this.headers() })
    return data.data as Simulacro
  }

  async delete(id: string) {
    const { data } = await axios.delete(`/api/simulacros/${id}`, { headers: this.headers() })
    return data.data
  }

  async cambiarEstado(id: string, dto: CambiarEstadoSimulacroDto) {
    const { data } = await axios.patch(`/api/simulacros/${id}/estado`, dto, { headers: this.headers() })
    return data.data as Simulacro
  }
}
