/**
 * Datos del firmante (gerente general o docente)
 */
export interface SignatarioData {
  nombre: string
  apellido?: string
  cargo?: string | null
  firma?: string | null
  sello?: string | null
}

/**
 * Datos de una lección dentro de un módulo
 */
export interface LeccionData {
  id: string
  titulo: string
  orden: number
  duracion?: number | null
}

/**
 * Datos de un módulo del curso
 */
export interface ModuloData {
  id: string
  titulo: string
  orden: number
  lecciones: LeccionData[]
}

/**
 * Objeto completo que recibe cualquier generador de certificado.
 * Las rutas de descarga (admin y estudiante) construyen este objeto
 * y lo pasan al generador seleccionado por la configuración CERTIFICADO_PLANTILLA.
 */
export interface CertificadoData {

  // ── Branding ──
  colorPrimario: string // hex, ej: '#131FF2'
  pr: number // R del color primario (0-255)
  pg: number // G del color primario (0-255)
  pb: number // B del color primario (0-255)
  logoBuffer: Buffer | null
  logoUrl: string
  base64Logo: string | null
  nombreInstitucion: string
  slogan: string
  disclaimer: string
  institutionUrl: string

  // ── Alumno ──
  nombreCompleto: string
  avatarBuffer: Buffer | null

  // ── Curso ──
  cursoTitulo: string
  cursoDuracion: string | null
  cursoModalidad: string
  modulos: ModuloData[]

  // ── Fechas (ya formateadas para render) ──
  fechaEmisionVal: Date | string
  fechaInicioVal: Date | string | null
  fechaFinVal: Date | string | null
  vigenciaHastaVal: Date | string | null

  // ── Firmas ──
  gerenteGeneral: SignatarioData | null
  profesorSnapshot: SignatarioData | null
  mostrarFirmaDocente: boolean

  // ── Firmantes (catálogo reutilizable, solo usado por la plantilla personalizada) ──
  firmante1: SignatarioData | null
  firmante2: SignatarioData | null

  // ── Verificación ──
  codigoVerificacion: string
  qrDataUrl: string
  verifyUrl: string

  // ── Rendimiento ──
  notaFinal: number | null
  notasPorModulo: Record<string, { puntaje: number; count: number }>
  intentosExamen: Array<{
    puntaje: number | null
    examen: { modulo_id: string | null; peso: number }
  }>
  notaInscripcion: number | null

  // ── Flags ──
  previewFlag: boolean
}

/**
 * Tipo de función que genera el PDF y devuelve el ArrayBuffer.
 */
export type GeneratorFn = (data: CertificadoData) => Promise<ArrayBuffer>

/**
 * Definición de un campo posicionable dentro de una plantilla de certificado
 * personalizada (diseño subido por el admin). Ver generators/personalizado.ts.
 */
export type CampoTipo = 'texto' | 'texto_libre' | 'imagen' | 'qr' | 'tabla_modulos'
export type CampoPagina = 'frente' | 'reverso'
export type CampoAlign = 'left' | 'center' | 'right'
export type CampoVAlign = 'top' | 'middle' | 'bottom'
export type CampoVarianteTablaModulos = 'lista' | 'compacta' | 'tarjetas' | 'tabla'
export type CampoFontFamily =
  | 'helvetica'
  | 'times'
  | 'courier'
  | 'montserrat'
  | 'playfair'
  | 'poppins'
  | 'nunito'
  | 'dancingscript'

export type CampoKeyTexto =
  | 'nombreCompleto'
  | 'cursoTitulo'
  | 'cursoDuracion'
  | 'fechaEmision'
  | 'fechaInicio'
  | 'fechaFin'
  | 'fechaVigencia'
  | 'codigoVerificacion'
  | 'notaFinal'
  | 'firmaDocenteNombre'
  | 'firmaDocenteCargo'
  | 'firmaGerenteNombre'
  | 'firmaGerenteCargo'
  | 'firmante1Nombre'
  | 'firmante1Cargo'
  | 'firmante2Nombre'
  | 'firmante2Cargo'

export type CampoKeyImagen =
  | 'logoInstitucion'
  | 'firmaDocenteImagen'
  | 'firmaGerenteImagen'
  | 'firmante1Firma'
  | 'firmante1Sello'
  | 'firmante2Firma'
  | 'firmante2Sello'
  | 'qr'

export interface CampoPlantillaPersonalizada {
  id: string
  tipo: CampoTipo
  pagina: CampoPagina
  key: CampoKeyTexto | CampoKeyImagen | null
  texto?: string
  xPct: number
  yPct: number
  widthPct?: number
  heightPct?: number
  maxWidthPct?: number
  fontSize?: number
  fontFamily?: CampoFontFamily
  color?: string
  bold?: boolean
  italic?: boolean
  align?: CampoAlign
  vAlign?: CampoVAlign
  variante?: CampoVarianteTablaModulos
}
