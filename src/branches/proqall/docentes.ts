/** Docentes estáticos — rama proqall (public/images/docentes) */

export type ProqallDocente = {
  id: string
  nombre: string
  apellido: string
  slug: string
  avatar: string
  cargo: string | null
  biografia: string | null
  _count: { cursos_dictados: number }
}

function buildBio(titulo: string, formacion: string) {
  const payload = {
    titulo,
    descripcion: '',
    especificaciones: formacion,
    formacion_complementaria: [] as { titulo: string; institucion?: string; anio?: string }[],
  }

  return `<!--PROFESOR_BIO_JSON:${JSON.stringify(payload)}-->`
}

export const PROQALL_DOCENTES: ProqallDocente[] = [
  {
    id: 'proqall-d-cajachagua',
    nombre: 'Diego Ricardo',
    apellido: 'Cajachagua Guerreros',
    slug: 'diego-ricardo-cajachagua-guerreros',
    avatar: '/images/docentes/D.%20CAJACHAGUA/D_CAJACHAGUA.png',
    cargo: 'Master en gestión integral de la edificación con mención en construcción sostenible',
    biografia: buildBio(
      'Ing. Civil',
      'Master en gestión integral de la edificación con mención en construcción sostenible'
    ),
    _count: { cursos_dictados: 0 },
  },
  {
    id: 'proqall-m-rivera',
    nombre: 'Michael Cristhian',
    apellido: 'Rivera Rojas',
    slug: 'michael-cristhian-rivera-rojas',
    avatar: '/images/docentes/M.RIVERA/M.RIVERA.png',
    cargo: 'Maestría en Ingeniería Biomédica',
    biografia: buildBio('Ing. Mecatrónico', 'Maestría en Ingeniería Biomédica'),
    _count: { cursos_dictados: 0 },
  },
  {
    id: 'proqall-s-del-carpio',
    nombre: 'Sliver',
    apellido: 'Del Carpio Ramirez',
    slug: 'sliver-del-carpio-ramirez',
    avatar: '/images/docentes/S.%20DEL%20CARPIO/S.%20DEL%20CARPIO.png',
    cargo: 'Maestría en Diseño y gestión del mantenimiento',
    biografia: buildBio('Ing. Mecatrónico', 'Maestría en Diseño y gestión del mantenimiento'),
    _count: { cursos_dictados: 0 },
  },
]

export function getProqallDocenteBySlug(slug: string) {
  const docente = PROQALL_DOCENTES.find(d => d.slug === slug || d.id === slug)

  if (!docente) return null

  return {
    ...docente,
    cursos_dictados: [] as [],
  }
}
