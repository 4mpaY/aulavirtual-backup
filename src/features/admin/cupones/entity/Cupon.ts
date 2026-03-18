export interface Cupon {
  id: string
  codigo: string
  valor: number
  tipo: 'PORCENTAJE' | 'FIJO'
  usos_actuales: number
  limite_uso: number | null
  fecha_expiracion: string | null
  esta_activo: boolean
  creado_en: string
  actualizado_en: string
}
