import { Rol } from '@prisma/client'

export interface Usuario {
  id: string
  correo: string
  nombre: string
  apellido: string
  numero_documento: string
  avatar: string | null
  biografia: string | null
  celular: string | null
  rol: Rol
  esta_activo: boolean
  creado_en: string
  actualizado_en: string
}

export interface UsuarioListItem {
  id: string
  correo: string
  nombre: string
  apellido: string
  nombre_completo: string
  numero_documento: string
  avatar: string | null
  rol: Rol
  esta_activo: boolean
  creado_en: string
}
