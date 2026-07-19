export interface EventoExterno {
  id: string
  titulo: string
  descripcion: string | null
  fecha_inicio: string
  fecha_fin: string | null
  todo_el_dia: boolean
  color: string | null
  usuario_id: string
  creado_en: string
  actualizado_en: string
}
