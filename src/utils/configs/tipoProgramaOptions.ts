import type { TipoPrograma } from '@/utils/configs/tipoPrograma'
import { TIPO_PROGRAMA_CONFIG } from '@/utils/configs/tipoPrograma'

export const TIPO_PROGRAMA_OPTIONS = (Object.keys(TIPO_PROGRAMA_CONFIG) as TipoPrograma[]).map(value => ({
  value,
  label: TIPO_PROGRAMA_CONFIG[value].label
}))

export function getTipoProgramaLabel(tipo?: string | null) {
  if (
    tipo === 'DIPLOMADO' ||
    tipo === 'ESPECIALIZACION' ||
    tipo === 'CURSO' ||
    tipo === 'SEMINARIO' ||
    tipo === 'TALLER'
  ) {
    return TIPO_PROGRAMA_CONFIG[tipo].label
  }

  return TIPO_PROGRAMA_CONFIG.CURSO.label
}

export function getTipoProgramaColor(tipo?: string | null): 'primary' | 'secondary' | 'warning' | 'info' | 'success' {
  if (tipo === 'DIPLOMADO') return 'secondary'
  if (tipo === 'ESPECIALIZACION') return 'warning'
  if (tipo === 'SEMINARIO') return 'info'
  if (tipo === 'TALLER') return 'success'

  return 'primary'
}
