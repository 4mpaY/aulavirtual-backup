import type { TipoPrograma } from '@/utils/configs/tipoPrograma'
import { TIPO_PROGRAMA_CONFIG } from '@/utils/configs/tipoPrograma'

export const TIPO_PROGRAMA_OPTIONS = (Object.keys(TIPO_PROGRAMA_CONFIG) as TipoPrograma[]).map(value => ({
  value,
  label: TIPO_PROGRAMA_CONFIG[value].label
}))

export function getTipoProgramaLabel(tipo?: string | null) {
  if (tipo === 'DIPLOMADO' || tipo === 'ESPECIALIZACION' || tipo === 'CURSO') {
    return TIPO_PROGRAMA_CONFIG[tipo].label
  }

  return TIPO_PROGRAMA_CONFIG.CURSO.label
}

export function getTipoProgramaColor(tipo?: string | null): 'primary' | 'secondary' | 'warning' {
  if (tipo === 'DIPLOMADO') return 'secondary'
  if (tipo === 'ESPECIALIZACION') return 'warning'

  return 'primary'
}
