import axios from 'axios'
import type { AxiosStatic } from 'axios'

import { getBaseURL } from '@/utils/env'
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Curso } from '../entity/Curso'
import type { CrearCursoDto, ActualizarCursoDto, CambiarEstadoCursoDto } from '@/schemas/curso.schema'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosCurso extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    const baseURL = getBaseURL()

    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${baseURL}/api/cursos`,
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

  async reorderCursos(items: { id: string; orden: number }[]): Promise<any> {
    try {
      const payload = await this.iPatch(`/reordenar`, { items })

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

  async updateModulo(
    cursoId: string,
    moduloId: string,
    data: { titulo?: string; descripcion?: string | null }
  ): Promise<any> {
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

  async createLeccion(
    cursoId: string,
    moduloId: string,
    data: { titulo: string; contenido?: string | null; duracion?: number | null; enlace_reunion?: string | null }
  ): Promise<any> {
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

  async reorderExamenesModulo(cursoId: string, moduloId: string, items: { id: string; orden: number }[]): Promise<any> {
    try {
      const payload = await this.iPatch(`/${cursoId}/modulos/${moduloId}/examenes/reordenar`, { items })

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getComentarios(cursoId: string, estado?: string): Promise<{ comentarios: any[] }> {
    try {
      const qs = estado ? `?estado=${estado}` : ''
      const payload = await this.iGet<{ comentarios: any[] }>(`/${cursoId}/comentarios${qs}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async moderarComentario(comentarioId: string, estado: 'APROBADO' | 'RECHAZADO'): Promise<void> {
    try {
      await axios.patch(`/api/admin/comentarios/${comentarioId}`, { estado })
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async eliminarComentario(comentarioId: string): Promise<void> {
    try {
      await axios.delete(`/api/admin/comentarios/${comentarioId}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getValoraciones(cursoId: string): Promise<{ promedio: number; total: number; valoraciones: any[] }> {
    try {
      const payload = await this.iGet<{ promedio: number; total: number; valoraciones: any[] }>(`/${cursoId}/valoraciones`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  // ===================== EXÁMENES (plural) =====================

  async getExamenes(cursoId: string): Promise<{ examenes: any[] }> {
    try {
      const payload = await this.iGet<{ examenes: any[] }>(`/${cursoId}/examenes`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getExamenById(cursoId: string, examenId: string): Promise<{ examen: any }> {
    try {
      const payload = await this.iGet<{ examen: any }>(`/${cursoId}/examenes/${examenId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createExamen(cursoId: string, data: any): Promise<{ examen: any }> {
    try {
      const payload = await this.iPost<{ examen: any }>(`/${cursoId}/examenes`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updateExamen(cursoId: string, examenId: string, data: any): Promise<{ examen: any }> {
    try {
      const payload = await this.iPatch<{ examen: any }>(`/${cursoId}/examenes/${examenId}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deleteExamen(cursoId: string, examenId: string): Promise<{ message: string }> {
    try {
      const payload = await this.iDelete<{ message: string }>(`/${cursoId}/examenes/${examenId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createPreguntaExamen(cursoId: string, examenId: string, data: any): Promise<{ pregunta: any }> {
    try {
      const payload = await this.iPost<{ pregunta: any }>(`/${cursoId}/examenes/${examenId}/preguntas`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updatePreguntaExamen(cursoId: string, examenId: string, preguntaId: string, data: any): Promise<{ pregunta: any }> {
    try {
      const payload = await this.iPatch<{ pregunta: any }>(`/${cursoId}/examenes/${examenId}/preguntas/${preguntaId}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deletePreguntaExamen(cursoId: string, examenId: string, preguntaId: string): Promise<{ message: string }> {
    try {
      const payload = await this.iDelete<{ message: string }>(`/${cursoId}/examenes/${examenId}/preguntas/${preguntaId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  // ===================== EXÁMENES (legacy singular) =====================

  async getExamen(cursoId: string): Promise<{ examen: any | null }> {
    try {
      const payload = await this.iGet<{ examen: any | null }>(`/${cursoId}/examen`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async saveExamen(cursoId: string, data: any): Promise<{ examen: any }> {
    try {
      const payload = await this.iPost<{ examen: any }>(`/${cursoId}/examen`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createPregunta(cursoId: string, data: any): Promise<{ pregunta: any }> {
    try {
      const payload = await this.iPost<{ pregunta: any }>(`/${cursoId}/examen/preguntas`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updatePregunta(cursoId: string, preguntaId: string, data: any): Promise<{ pregunta: any }> {
    try {
      const payload = await this.iPatch<{ pregunta: any }>(`/${cursoId}/examen/preguntas/${preguntaId}`, data)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deletePregunta(cursoId: string, preguntaId: string): Promise<{ message: string }> {
    try {
      const payload = await this.iDelete<{ message: string }>(`/${cursoId}/examen/preguntas/${preguntaId}`)

      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  // ===================== ACTIVIDADES =====================

  async getActividades(cursoId: string): Promise<{ actividades: any[] }> {
    try {
      return await this.iGet<{ actividades: any[] }>(`/${cursoId}/actividades`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getActividadById(cursoId: string, actId: string): Promise<{ actividad: any }> {
    try {
      return await this.iGet<{ actividad: any }>(`/${cursoId}/actividades/${actId}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createActividad(cursoId: string, data: any): Promise<{ actividad: any }> {
    try {
      return await this.iPost<{ actividad: any }>(`/${cursoId}/actividades`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updateActividad(cursoId: string, actId: string, data: any): Promise<{ actividad: any }> {
    try {
      return await this.iPatch<{ actividad: any }>(`/${cursoId}/actividades/${actId}`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deleteActividad(cursoId: string, actId: string): Promise<{ message: string }> {
    try {
      return await this.iDelete<{ message: string }>(`/${cursoId}/actividades/${actId}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async createPreguntaActividad(cursoId: string, actId: string, data: any): Promise<{ pregunta: any }> {
    try {
      return await this.iPost<{ pregunta: any }>(`/${cursoId}/actividades/${actId}/preguntas`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async updatePreguntaActividad(cursoId: string, actId: string, pregId: string, data: any): Promise<{ pregunta: any }> {
    try {
      return await this.iPatch<{ pregunta: any }>(`/${cursoId}/actividades/${actId}/preguntas/${pregId}`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async deletePreguntaActividad(cursoId: string, actId: string, pregId: string): Promise<{ message: string }> {
    try {
      return await this.iDelete<{ message: string }>(`/${cursoId}/actividades/${actId}/preguntas/${pregId}`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getEntregasActividad(cursoId: string, actId: string): Promise<{ entregas: any[]; pendientes: any[]; actividad?: any }> {
    try {
      return await this.iGet<{ entregas: any[]; pendientes: any[]; actividad?: any }>(`/${cursoId}/actividades/${actId}/entregas`)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async calificarEntregaActividad(cursoId: string, actId: string, entId: string, data: { nota: number | null; comentario_docente?: string }): Promise<{ entrega: any }> {
    try {
      return await this.iPatch<{ entrega: any }>(`/${cursoId}/actividades/${actId}/entregas/${entId}`, data)
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async reorderActividadesModulo(cursoId: string, moduloId: string, items: { id: string; orden: number }[]): Promise<any> {
    try {
      return await this.iPatch(`/${cursoId}/modulos/${moduloId}/actividades/reordenar`, { items })
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
