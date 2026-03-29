import type { EstadoPedido, MetodoPago } from '@prisma/client'

export interface PedidoEstudiante {
  id: string
  numero_pedido: number
  estado: EstadoPedido
  metodo_pago: MetodoPago | null
  total: number
  moneda: string
  creado_en: string
  pagado_en: string | null
  cupon?: {
    codigo: string
  } | null
  detalles: DetallePedidoEstudiante[]
}

export interface DetallePedidoEstudiante {
  id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  total: number
  curso_id: string
  curso: {
    titulo: string
  }
}
