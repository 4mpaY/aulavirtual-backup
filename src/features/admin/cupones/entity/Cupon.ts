export interface CursoEnCupon {
  curso_id: string
  curso: {
    id: string
    titulo: string
  }
}

export interface CursoOpcion {
  id: string
  titulo: string
  estado?: string
}

export interface Cupon {
  id: string
  codigo: string
  valor: number
  tipo: 'PORCENTAJE' | 'MONTO_FIJO'
  usos_actuales: number
  limite_uso: number | null
  fecha_expiracion: string | null
  esta_activo: boolean
  creado_en: string
  actualizado_en: string
  cursos: CursoEnCupon[]
}

export interface CuponPayload {
  codigo: string
  valor: number
  tipo: 'PORCENTAJE' | 'MONTO_FIJO'
  limite_uso: number | null
  fecha_expiracion: string | null
  esta_activo: boolean
  cursoIds: string[]
}
