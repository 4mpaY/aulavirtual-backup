export interface MetodoPagoManual {
  id: string
  nombre: string
  nombre_banco?: string | null
  numero_cuenta: string
  cci?: string | null
  ruc?: string | null
  descripcion?: string | null
  imagen_url?: string | null
  orden: number
  estado: boolean
  creado_en: string
  actualizado_en: string
}
