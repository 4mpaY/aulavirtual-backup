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

export interface PlantillaCertificado {
  id: string
  nombre: string
  cara_frente_url: string
  cara_reverso_url: string | null
  reverso_activo: boolean
  campos: CampoPlantillaPersonalizada[]
  activo: boolean
  creado_en: string
  actualizado_en: string
}
