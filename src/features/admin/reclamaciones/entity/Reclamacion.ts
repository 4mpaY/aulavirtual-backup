export enum EstadoReclamacion {
  PENDIENTE = 'PENDIENTE',
  ATENDIDO = 'ATENDIDO'
}

export enum TipoDocumentoReclamo {
  DNI = 'DNI',
  CE = 'CE',
  PASAPORTE = 'PASAPORTE',
  OTRO = 'OTRO'
}

export enum TipoBien {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export enum TipoReclamacion {
  RECLAMO = 'RECLAMO',
  QUEJA = 'QUEJA'
}

export interface Reclamacion {
  id: string
  numero_correlativo: number
  tipo_documento: TipoDocumentoReclamo
  numero_documento: string
  nombre: string
  domicilio: string
  telefono: string
  email: string
  nombre_apoderado: string | null
  bien_contratado_tipo: TipoBien
  monto_reclamado: number
  descripcion_bien: string
  tipo_reclamacion: TipoReclamacion
  detalle: string
  pedido: string
  estado: EstadoReclamacion
  respuesta_proveedor: string | null
  fecha_respuesta: Date | string | null
  creado_en: Date | string
  actualizado_en: Date | string
  moneda: string
}
