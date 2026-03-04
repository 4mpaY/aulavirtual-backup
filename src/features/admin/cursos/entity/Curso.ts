export interface CursoProfesor {
  id: string
  nombre: string
  apellido: string
  avatar: string | null
}

export interface CursoCategoria {
  id: string
  nombre: string
}

export interface CursoLeccionResumen {
  id: string
  titulo: string
  orden: number
  duracion: number | null
  video_url: string | null
  recursos: any[]
  estado: 'BORRADOR' | 'PUBLICADO'
}

export interface CursoModulo {
  id: string
  titulo: string
  descripcion: string | null
  orden: number
  creado_en: string
  actualizado_en: string
  lecciones: CursoLeccionResumen[]
}

export interface Curso {
  id: string
  titulo: string
  slug: string
  descripcion: string | null
  miniatura: string | null
  video_presentacion: string | null
  duracion: string | null
  tipo_emision: 'SINCRONO' | 'ASINCRONO'
  estado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO'
  es_gratis: boolean
  precio: number
  moneda: string
  creado_en: string
  actualizado_en: string
  profesor_id: string
  profesor: CursoProfesor
  categoria_id: string | null
  categoria: CursoCategoria | null
  modulos: CursoModulo[]
  objetivos: string[]
  metodologia: any[]
  beneficios: any[]
  incluye: any[]
  _count: {
    modulos: number
    lecciones: number
    inscripciones: number
  }
}
