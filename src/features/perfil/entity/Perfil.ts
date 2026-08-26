export interface Perfil {
  id: string
  nombre: string
  apellido: string
  correo: string
  numero_documento: string
  celular?: string | null
  biografia?: string | null
  avatar?: string | null
  rol: string
  cargo?: string | null
  firma?: string | null
  licencia?: string | null
  equipo_opera?: string | null
  empresa?: string | null
  ciudad?: string | null
  pais?: string | null
  codigo_instructor_nsc?: string | null
}
