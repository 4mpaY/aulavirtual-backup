export type CampoTipo = 'texto' | 'texto_libre' | 'imagen' | 'qr'
export type CampoPagina = 'frente' | 'reverso'
export type CampoAlign = 'left' | 'center' | 'right'
export type CampoVAlign = 'top' | 'middle' | 'bottom'

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

export type CampoKeyImagen = 'logoInstitucion' | 'firmaDocenteImagen' | 'firmaGerenteImagen' | 'qr'

export interface CampoPlantillaPersonalizada {
  id: string
  tipo: CampoTipo
  pagina: CampoPagina
  key: CampoKeyTexto | CampoKeyImagen | null
  texto?: string
  xPct: number
  yPct: number
  widthPct?: number
  maxWidthPct?: number
  fontSize?: number
  color?: string
  bold?: boolean
  italic?: boolean
  align?: CampoAlign
  vAlign?: CampoVAlign
}

export interface PlantillaCertificado {
  id: string
  nombre: string
  cara_frente_url: string
  cara_reverso_url: string | null
  campos: CampoPlantillaPersonalizada[]
  activo: boolean
  creado_en: string
  actualizado_en: string
}
