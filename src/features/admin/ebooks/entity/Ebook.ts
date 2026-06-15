export type EstadoEbook = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO'

export interface Ebook {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  autor?: string | null
  miniatura?: string | null
  archivo_pdf: string
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  paginas?: number | null
  genero?: string | null
  estado: EstadoEbook
  categoria_id?: string | null
  categoria?: { id: string; nombre: string } | null
  creado_en: string
  actualizado_en: string
  _count?: { accesos: number }
}

export interface CreateEbookDto {
  titulo: string
  descripcion?: string
  autor?: string
  miniatura?: string
  archivo_pdf: string
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  paginas?: number
  genero?: string
  categoria_id?: string
  estado: EstadoEbook
}

export type UpdateEbookDto = Partial<CreateEbookDto>
