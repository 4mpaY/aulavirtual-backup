import { PROQALL_CONVENIOS_LOGOS } from './conveniosLogos'
import { isProqallBranch } from './isProqallBranch'

type HomeLogo = { label: string; url: string }

/** Logos de convenios (rama proqall) si no hay configuración en admin. */
export function resolveProqallHomeLogos(configLogos: HomeLogo[]): HomeLogo[] {
  if (!isProqallBranch()) return configLogos

  return configLogos.length > 0 ? configLogos : [...PROQALL_CONVENIOS_LOGOS]
}
