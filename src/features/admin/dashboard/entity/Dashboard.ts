export interface DashboardResumen {
  ingresos: number
  estudiantes: number
  profesores: number
  cursos: number
}

export interface DashboardPedido {
  id: string
  numero_pedido: string
  total: number
  moneda: string
  estado: string
  usuario: {
    nombre: string
    apellido: string
  }
}

export interface DashboardCursoPopular {
  id: string
  titulo: string
  miniatura: string | null
  _count: {
    inscripciones: number
  }
}

export interface DashboardInscripcion {
  id: string
  inscrito_en: string
  usuario: {
    nombre: string
    avatar: string | null
  }
  curso: {
    titulo: string
  }
}

export interface DashboardData {
  resumen: DashboardResumen
  pedidosRecientes: DashboardPedido[]
  cursosPopulares: DashboardCursoPopular[]
  inscripcionesRecientes: DashboardInscripcion[]
}
