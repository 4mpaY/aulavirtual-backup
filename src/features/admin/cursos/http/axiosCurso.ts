import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Curso } from '../entity/Curso'
import type { CrearCursoDto, ActualizarCursoDto, CambiarEstadoCursoDto } from '@/schemas/curso.schema'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCurso extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/cursos`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(query?: Record<string, string>): Promise<{ cursos: Curso[]; paginacion: any }> {
    try {
      const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
      const payload = await this.iGet<{ cursos: Curso[]; paginacion: any }>(queryString)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Curso> {
    try {
      const payload = await this.iGet<Curso>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(curso: CrearCursoDto): Promise<{ curso: Curso }> {
    try {
      const payload = await this.iPost<{ curso: Curso }>('', curso)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, curso: ActualizarCursoDto): Promise<{ curso: Curso }> {
    try {
      const payload = await this.iPatch<{ curso: Curso }>(`/${id}`, curso)

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

  async cambiarEstado(id: string, data: CambiarEstadoCursoDto): Promise<{ curso: Curso }> {
    try {
      const payload = await this.iPatch<{ curso: Curso }>(`/${id}/estado`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
