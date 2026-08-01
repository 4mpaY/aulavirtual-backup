export interface Firmante {
  id: string
  nombre: string
  cargo: string | null
  firma: string | null
  sello: string | null
  activo: boolean
  creado_en: string
  actualizado_en: string
}
