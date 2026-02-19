import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Categoria, CategoriaHijo } from '../entity/Categoria'
import type { CrearCategoriaDto, ActualizarCategoriaDto, CrearSubcategoriaDto } from '@/schemas/categoria.schema'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCategoria extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/categorias`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(): Promise<Categoria[]> {
    try {
      const payload = await this.iGet<{ categorias: Categoria[]; paginacion: any }>()

      return payload?.categorias || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Categoria> {
    try {
      const payload = await this.iGet<Categoria>(`/${id}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(categoria: CrearCategoriaDto): Promise<{ categoria: Categoria }> {
    try {
      const payload = await this.iPost<{ categoria: Categoria }>('', categoria)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, categoria: ActualizarCategoriaDto): Promise<{ categoria: Categoria }> {
    try {
      const payload = await this.iPatch<{ categoria: Categoria }>(`/${id}`, categoria)

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

  async toggleStatus(id: string, esta_activo: boolean): Promise<{ categoria: Categoria }> {
    try {
      const payload = await this.iPatch<{ categoria: Categoria }>(`/${id}`, { esta_activo })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createChild(padreId: string, data: CrearSubcategoriaDto): Promise<{ categoria: CategoriaHijo }> {
    try {
      const payload = await this.iPost<{ categoria: CategoriaHijo }>(`/${padreId}/hijos`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async reorder(padreId: string, items: { id: string; orden: number }[]): Promise<{ hijos: CategoriaHijo[] }> {
    try {
      const payload = await this.iPatch<{ hijos: CategoriaHijo[] }>(`/${padreId}/reordenar`, { items })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
