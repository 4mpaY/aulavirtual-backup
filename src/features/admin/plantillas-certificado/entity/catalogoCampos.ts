import type { CampoKeyImagen, CampoKeyTexto, CampoTipo } from './PlantillaCertificado'

export interface CatalogoCampoItem {
  key: CampoKeyTexto | CampoKeyImagen
  tipo: CampoTipo
  label: string
  icon: string
}

export const CATALOGO_CAMPOS: CatalogoCampoItem[] = [
  { key: 'nombreCompleto', tipo: 'texto', label: 'Nombre del alumno', icon: 'tabler-user' },
  { key: 'cursoTitulo', tipo: 'texto', label: 'Título del curso', icon: 'tabler-book' },
  { key: 'cursoDuracion', tipo: 'texto', label: 'Duración del curso', icon: 'tabler-clock' },
  { key: 'fechaEmision', tipo: 'texto', label: 'Fecha de emisión', icon: 'tabler-calendar' },
  { key: 'fechaInicio', tipo: 'texto', label: 'Fecha de inicio', icon: 'tabler-calendar-event' },
  { key: 'fechaFin', tipo: 'texto', label: 'Fecha de fin', icon: 'tabler-calendar-event' },
  { key: 'fechaVigencia', tipo: 'texto', label: 'Fecha de vigencia', icon: 'tabler-calendar-due' },
  { key: 'codigoVerificacion', tipo: 'texto', label: 'Código de verificación', icon: 'tabler-hash' },
  { key: 'notaFinal', tipo: 'texto', label: 'Nota final', icon: 'tabler-star' },
  { key: 'firmaDocenteNombre', tipo: 'texto', label: 'Nombre del docente', icon: 'tabler-signature' },
  { key: 'firmaDocenteCargo', tipo: 'texto', label: 'Cargo del docente', icon: 'tabler-briefcase' },
  { key: 'firmaGerenteNombre', tipo: 'texto', label: 'Nombre del gerente', icon: 'tabler-signature' },
  { key: 'firmaGerenteCargo', tipo: 'texto', label: 'Cargo del gerente', icon: 'tabler-briefcase' },
  { key: 'logoInstitucion', tipo: 'imagen', label: 'Logo institución', icon: 'tabler-photo' },
  { key: 'firmaDocenteImagen', tipo: 'imagen', label: 'Firma del docente', icon: 'tabler-writing' },
  { key: 'firmaGerenteImagen', tipo: 'imagen', label: 'Firma del gerente', icon: 'tabler-writing' },
  { key: 'qr', tipo: 'qr', label: 'Código QR', icon: 'tabler-qrcode' }
]
