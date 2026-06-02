export type IntervaloSuscripcion = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'

export interface CursoEnPlan {
  plan_id: string
  curso_id: string
  curso: {
    id: string
    titulo: string
    estado: string
  }
}

export interface PlanSuscripcion {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  moneda: string
  intervalo: IntervaloSuscripcion
  culqi_interval_unit: number
  culqi_interval_count: number
  dias_prueba: number
  esta_activo: boolean
  culqi_plan_id: string | null
  culqi_short_name: string | null
  creado_en: string
  actualizado_en: string
  cursos: CursoEnPlan[]
  _count?: {
    suscripciones: number
    cursos: number
  }
}

export interface PlanPayload {
  nombre: string
  descripcion?: string | null
  precio: number
  moneda: string
  intervalo: IntervaloSuscripcion
  dias_prueba: number
  esta_activo: boolean
  cursoIds: string[]
}

export const INTERVALO_LABELS: Record<IntervaloSuscripcion, string> = {
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual'
}
