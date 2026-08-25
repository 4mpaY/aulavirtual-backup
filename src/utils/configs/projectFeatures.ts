/**
 * Módulos visibles en la plataforma.
 * Cambiar a `true` para habilitar un módulo en menús y secciones públicas.
 */
export const PROJECT_FEATURES = {
  ebooks: false,
  suscripciones: false,
  calendario: false,
  simulacros: false,
  rutas: false,
} as const

export type ProjectFeature = keyof typeof PROJECT_FEATURES

export function isFeatureEnabled(feature: ProjectFeature): boolean {
  return PROJECT_FEATURES[feature]
}
