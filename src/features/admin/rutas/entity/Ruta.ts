export interface Benefit {
  title: string
  desc: string
  icon: string
}

export interface RutaSeccion {
  id: string
  titulo: string
  orden: number
}

export interface CursoEnRuta {
  id: string
  titulo: string
  slug: string
  miniatura?: string
  descripcion?: string
  orden: number
  seccion_id?: string | null
}

export interface Ruta {
  id: string
  titulo: string
  slug: string
  descripcion?: string
  miniatura?: string
  beneficios?: Benefit[]
  secciones?: RutaSeccion[]
  esta_activo: boolean
  creado_en: string
  actualizado_en: string
  total_cursos?: number
  cursos: CursoEnRuta[]
}

export interface CreateRutaDto {
  titulo: string
  slug: string
  descripcion: string
  miniatura: string
  beneficios?: Benefit[]
  secciones?: RutaSeccion[]
  esta_activo: boolean
}
