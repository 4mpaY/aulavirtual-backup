export type EstadoSuscripcion = 'ACTIVA' | 'CANCELADA' | 'VENCIDA' | 'PENDIENTE' | 'EN_PRUEBA'

export interface PlanResumen {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  moneda: string
  intervalo: 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'
  dias_prueba: number
  beneficios: string[]
  cursos: {
    plan_id: string
    curso_id: string
    curso: { id: string; titulo: string; miniatura: string | null }
  }[]
}

export interface PagoSuscripcion {
  id: string
  monto: number
  moneda: string
  estado: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO'
  culqi_cargo_id: string | null
  periodo_inicio: string | null
  periodo_fin: string | null
  creado_en: string
}

export interface Suscripcion {
  id: string
  usuario_id: string
  plan_id: string
  estado: EstadoSuscripcion
  fecha_inicio: string | null
  fecha_fin: string | null
  fecha_proximo_cobro: string | null
  fecha_cancelacion: string | null
  cancelado_por_usuario: boolean
  creado_en: string
  plan: PlanResumen
  pagos: PagoSuscripcion[]
}

export interface PlanPublico {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  moneda: string
  intervalo: 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'
  dias_prueba: number
  esta_activo: boolean
  beneficios: string[]
  cursos: {
    plan_id: string
    curso_id: string
    curso: { id: string; titulo: string; miniatura: string | null; estado: string }
  }[]
  _count: { suscripciones: number }
}

export const INTERVALO_LABELS: Record<string, string> = {
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual'
}
