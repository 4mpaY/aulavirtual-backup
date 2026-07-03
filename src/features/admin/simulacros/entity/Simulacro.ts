export type EstadoSimulacro = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO'
export type NivelSimulacro = 'BASICO' | 'INTERMEDIO' | 'AVANZADO'

export interface Simulacro {
  id: string
  titulo: string
  slug: string
  descripcion: string | null
  miniatura: string | null
  estado: EstadoSimulacro
  nivel: NivelSimulacro
  duracion: string | null
  numero_preguntas: number
  area_tematica: string | null
  es_gratis: boolean
  precio: number
  moneda: string
  creado_en: string
  actualizado_en: string
}

export interface CrearSimulacroDto {
  titulo: string
  descripcion?: string | null
  miniatura?: string | null
  nivel?: NivelSimulacro
  duracion?: string | null
  numero_preguntas?: number
  area_tematica?: string | null
  es_gratis?: boolean
  precio?: number
  moneda?: string
}

export type ActualizarSimulacroDto = Partial<CrearSimulacroDto>

export interface CambiarEstadoSimulacroDto {
  estado: EstadoSimulacro
}
