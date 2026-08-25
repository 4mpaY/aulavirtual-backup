export interface DashboardResumen {
  ingresos: number
  ingresosMesActual: number
  crecimientoIngresos: number
  ticketPromedio: number
  estudiantes: number
  profesores: number
  cursos: number
  cursosPublicados: number
  pedidosPendientes: number
  certificadosEmitidos: number
}

export interface DashboardVentaMes {
  mes: string
  total: number
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
  precio: number
  moneda: string
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
  ventasPorMes: DashboardVentaMes[]
  pedidosRecientes: DashboardPedido[]
  cursosPopulares: DashboardCursoPopular[]
  inscripcionesRecientes: DashboardInscripcion[]
}
