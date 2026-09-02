export interface Escuela {
  id: string
  nombre: string
  slug: string
  descripcion?: string | null
  imagen?: string | null
  estado: string // 'DISPONIBLE' | 'PROXIMAMENTE' | 'MEDIANTE_ALIANZAS' | 'EN_DESARROLLO'
  orden: number
  creado_en: string
  actualizado_en: string
}

export interface CreateEscuelaDto {
  nombre: string
  slug: string
  descripcion: string
  imagen: string
  estado: string
  orden: number
}
