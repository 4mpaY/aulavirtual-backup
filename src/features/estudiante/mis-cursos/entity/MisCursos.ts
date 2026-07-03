export interface MisCursoItem {
  id: string
  titulo: string
  slug: string
  miniatura?: string
  profesor: {
    nombre: string
    apellido: string
    avatar?: string
  }
  progreso: number
  categoria?: string
  tieneAcceso: boolean
  origen?: 'COMPRA' | 'SUSCRIPCION'
}

export interface MisCursosResponse {
  courses: MisCursoItem[]
}
