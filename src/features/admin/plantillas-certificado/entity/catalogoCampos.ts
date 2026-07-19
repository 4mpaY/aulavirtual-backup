import type { CampoKeyImagen, CampoKeyTexto, CampoTipo } from './PlantillaCertificado'

export type CatalogoCampoSeccion =
  | 'Alumno'
  | 'Curso'
  | 'Fechas'
  | 'Evaluación y verificación'
  | 'Firma docente / gerente'
  | 'Firmante 1'
  | 'Firmante 2'
  | 'Institución'

export interface CatalogoCampoItem {
  key: CampoKeyTexto | CampoKeyImagen
  tipo: CampoTipo
  label: string
  icon: string
  seccion: CatalogoCampoSeccion
}

export const CATALOGO_CAMPOS: CatalogoCampoItem[] = [
  { key: 'nombreCompleto', tipo: 'texto', label: 'Nombre del alumno', icon: 'tabler-user', seccion: 'Alumno' },

  { key: 'cursoTitulo', tipo: 'texto', label: 'Título del curso', icon: 'tabler-book', seccion: 'Curso' },
  { key: 'cursoDuracion', tipo: 'texto', label: 'Duración del curso', icon: 'tabler-clock', seccion: 'Curso' },

  { key: 'fechaEmision', tipo: 'texto', label: 'Fecha de emisión', icon: 'tabler-calendar', seccion: 'Fechas' },
  { key: 'fechaInicio', tipo: 'texto', label: 'Fecha de inicio', icon: 'tabler-calendar-event', seccion: 'Fechas' },
  { key: 'fechaFin', tipo: 'texto', label: 'Fecha de fin', icon: 'tabler-calendar-event', seccion: 'Fechas' },
  { key: 'fechaVigencia', tipo: 'texto', label: 'Fecha de vigencia', icon: 'tabler-calendar-due', seccion: 'Fechas' },

  {
    key: 'codigoVerificacion',
    tipo: 'texto',
    label: 'Código de verificación',
    icon: 'tabler-hash',
    seccion: 'Evaluación y verificación'
  },
  { key: 'notaFinal', tipo: 'texto', label: 'Nota final', icon: 'tabler-star', seccion: 'Evaluación y verificación' },
  { key: 'qr', tipo: 'qr', label: 'Código QR', icon: 'tabler-qrcode', seccion: 'Evaluación y verificación' },

  {
    key: 'firmaDocenteNombre',
    tipo: 'texto',
    label: 'Nombre del docente',
    icon: 'tabler-signature',
    seccion: 'Firma docente / gerente'
  },
  {
    key: 'firmaDocenteCargo',
    tipo: 'texto',
    label: 'Cargo del docente',
    icon: 'tabler-briefcase',
    seccion: 'Firma docente / gerente'
  },
  {
    key: 'firmaDocenteImagen',
    tipo: 'imagen',
    label: 'Firma del docente',
    icon: 'tabler-writing',
    seccion: 'Firma docente / gerente'
  },
  {
    key: 'firmaGerenteNombre',
    tipo: 'texto',
    label: 'Nombre del gerente',
    icon: 'tabler-signature',
    seccion: 'Firma docente / gerente'
  },
  {
    key: 'firmaGerenteCargo',
    tipo: 'texto',
    label: 'Cargo del gerente',
    icon: 'tabler-briefcase',
    seccion: 'Firma docente / gerente'
  },
  {
    key: 'firmaGerenteImagen',
    tipo: 'imagen',
    label: 'Firma del gerente',
    icon: 'tabler-writing',
    seccion: 'Firma docente / gerente'
  },

  {
    key: 'firmante1Nombre',
    tipo: 'texto',
    label: 'Firmante 1 - Nombre',
    icon: 'tabler-signature',
    seccion: 'Firmante 1'
  },
  { key: 'firmante1Cargo', tipo: 'texto', label: 'Firmante 1 - Cargo', icon: 'tabler-briefcase', seccion: 'Firmante 1' },
  { key: 'firmante1Firma', tipo: 'imagen', label: 'Firmante 1 - Firma', icon: 'tabler-writing', seccion: 'Firmante 1' },
  {
    key: 'firmante1Sello',
    tipo: 'imagen',
    label: 'Firmante 1 - Sello',
    icon: 'tabler-rubber-stamp',
    seccion: 'Firmante 1'
  },

  {
    key: 'firmante2Nombre',
    tipo: 'texto',
    label: 'Firmante 2 - Nombre',
    icon: 'tabler-signature',
    seccion: 'Firmante 2'
  },
  { key: 'firmante2Cargo', tipo: 'texto', label: 'Firmante 2 - Cargo', icon: 'tabler-briefcase', seccion: 'Firmante 2' },
  { key: 'firmante2Firma', tipo: 'imagen', label: 'Firmante 2 - Firma', icon: 'tabler-writing', seccion: 'Firmante 2' },
  {
    key: 'firmante2Sello',
    tipo: 'imagen',
    label: 'Firmante 2 - Sello',
    icon: 'tabler-rubber-stamp',
    seccion: 'Firmante 2'
  },

  { key: 'logoInstitucion', tipo: 'imagen', label: 'Logo institución', icon: 'tabler-photo', seccion: 'Institución' }
]
