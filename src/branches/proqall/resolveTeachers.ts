import { PROQALL_DOCENTES, type ProqallDocente } from './docentes'
import { isProqallBranch } from './isProqallBranch'

/** Docentes estáticos de public/images/docentes (rama proqall). */
export function resolveProqallTeachers<T extends ProqallDocente>(dbTeachers: T[]): T[] | ProqallDocente[] {
  if (!isProqallBranch()) return dbTeachers

  return PROQALL_DOCENTES
}
