export type TipoPrograma = 'CURSO' | 'DIPLOMADO' | 'ESPECIALIZACION'

export const TIPO_PROGRAMA_CONFIG = {
  CURSO: {
    label: 'Curso',
    labelPlural: 'Cursos',
    adminBasePath: '/admin/cursos',
    webPath: '/cursos',
    catalogTitle: 'Catálogo de Cursos',
    catalogDescription: 'Explora nuestra selección de cursos y comienza a aprender hoy.',
    catalogSectionTitle: 'Nuestros Cursos',
    catalogSectionSubtitle: 'Aprende de expertos y potencia tu carrera profesional con nuestra selección premium.',
    catalogEmptySearch: 'No encontramos cursos que coincidan con tu búsqueda.',
    searchPlaceholder: 'Buscar curso por título o descripción...',
    homeTitle: 'Cursos destacados',
    homeSubtitle: 'Descubre nuestros cursos más recientes',
    emptyMessage: 'Próximamente habrá cursos disponibles.',
    nuevoLabel: 'Nuevo Curso',
    gestionTitle: 'Gestión de Cursos',
    buscarPlaceholder: 'Buscar curso',
    cargandoLabel: 'Cargando cursos...'
  },
  DIPLOMADO: {
    label: 'Diplomado',
    labelPlural: 'Diplomados',
    adminBasePath: '/admin/diplomados',
    webPath: '/diplomados',
    catalogTitle: 'Catálogo de Diplomados',
    catalogDescription: 'Programas formativos de mayor profundidad para potenciar tu perfil profesional.',
    catalogSectionTitle: 'Nuestros Diplomados',
    catalogSectionSubtitle: 'Programas integrales diseñados para fortalecer tu perfil profesional.',
    catalogEmptySearch: 'No encontramos diplomados que coincidan con tu búsqueda.',
    searchPlaceholder: 'Buscar diplomado por título o descripción...',
    homeTitle: 'Diplomados destacados',
    homeSubtitle: 'Programas integrales para tu desarrollo profesional',
    emptyMessage: 'Próximamente habrá diplomados disponibles.',
    nuevoLabel: 'Nuevo Diplomado',
    gestionTitle: 'Gestión de Diplomados',
    buscarPlaceholder: 'Buscar diplomado',
    cargandoLabel: 'Cargando diplomados...'
  },
  ESPECIALIZACION: {
    label: 'Especialización',
    labelPlural: 'Especializaciones',
    adminBasePath: '/admin/especializaciones',
    webPath: '/especializaciones',
    catalogTitle: 'Catálogo de Especializaciones',
    catalogDescription: 'Especialízate en áreas clave con programas diseñados para expertos.',
    catalogSectionTitle: 'Nuestras Especializaciones',
    catalogSectionSubtitle: 'Profundiza en las áreas más demandadas con programas orientados a expertos.',
    catalogEmptySearch: 'No encontramos especializaciones que coincidan con tu búsqueda.',
    searchPlaceholder: 'Buscar especialización por título o descripción...',
    homeTitle: 'Especializaciones destacadas',
    homeSubtitle: 'Profundiza en las áreas más demandadas del mercado',
    emptyMessage: 'Próximamente habrá especializaciones disponibles.',
    nuevoLabel: 'Nueva Especialización',
    gestionTitle: 'Gestión de Especializaciones',
    buscarPlaceholder: 'Buscar especialización',
    cargandoLabel: 'Cargando especializaciones...'
  }
} as const

export function getTipoProgramaConfig(tipo: TipoPrograma) {
  return TIPO_PROGRAMA_CONFIG[tipo]
}
