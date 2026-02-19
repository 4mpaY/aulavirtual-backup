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

  // ===================== MÓDULOS =====================

  async createModulo(cursoId: string, data: { titulo: string; descripcion?: string | null }): Promise<any> {
    try {
      const payload = await this.iPost(`/${cursoId}/modulos`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updateModulo(cursoId: string, moduloId: string, data: { titulo?: string; descripcion?: string | null }): Promise<any> {
    try {
      const payload = await this.iPatch(`/${cursoId}/modulos/${moduloId}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deleteModulo(cursoId: string, moduloId: string): Promise<any> {
    try {
      const payload = await this.iDelete(`/${cursoId}/modulos/${moduloId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async reorderModulos(cursoId: string, items: { id: string; orden: number }[]): Promise<any> {
    try {
      const payload = await this.iPatch(`/${cursoId}/modulos/reordenar`, { items })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  // ===================== LECCIONES =====================

  async createLeccion(cursoId: string, moduloId: string, data: { titulo: string; contenido?: string | null; duracion?: number | null; enlace_reunion?: string | null }): Promise<any> {
    try {
      const payload = await this.iPost(`/${cursoId}/modulos/${moduloId}/lecciones`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updateLeccion(cursoId: string, moduloId: string, leccionId: string, data: any): Promise<any> {
    try {
      const payload = await this.iPatch(`/${cursoId}/modulos/${moduloId}/lecciones/${leccionId}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deleteLeccion(cursoId: string, moduloId: string, leccionId: string): Promise<any> {
    try {
      const payload = await this.iDelete(`/${cursoId}/modulos/${moduloId}/lecciones/${leccionId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async reorderLecciones(cursoId: string, moduloId: string, items: { id: string; orden: number }[]): Promise<any> {
    try {
      const payload = await this.iPatch(`/${cursoId}/modulos/${moduloId}/lecciones/reordenar`, { items })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
