export interface CategoriaHijo {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  esta_activo: boolean
  orden: number
  creado_en: string
  actualizado_en: string
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoria_padre_id: string | null
  esta_activo: boolean
  orden: number
  creado_en: string
  actualizado_en: string
  padre: {
    id: string
    nombre: string
  } | null
  hijos: CategoriaHijo[]
  _count: {
    hijos: number
    cursos: number
  }
}
