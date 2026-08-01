export type FiltroCategoria = {
  id: string
  nombre: string
}

export type HistorialNotaItem = {
  inscripcion_id: string
  curso_id: string
  codigo: string
  curso: string
  periodo: string
  anio_academico: number
  grupo: string
  seccion: string
  promedio: number
  fecha: string
  fecha_iso: string
  modalidad: string
  docente: string
  categoria_id: string | null
  categoria: string
  total_evaluaciones: number
  evaluaciones_realizadas: number
}

export type EvaluacionNotaDetalle = {
  numero: number
  examen_id: string
  descripcion: string
  peso: number
  nota: number
}

export type DetalleNotasCurso = {
  curso_id: string
  codigo: string
  curso: string
  periodo: string
  promedio: number
  fecha: string
  modalidad: string
  docente: string
  evaluaciones: EvaluacionNotaDetalle[]
}

export type MisNotasResponse = {
  filtros: {
    anios: number[]
    categorias: FiltroCategoria[]
  }
  registros: HistorialNotaItem[]
}
