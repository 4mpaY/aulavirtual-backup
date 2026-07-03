export type ModuleItemType = 'leccion' | 'examen' | 'actividad'

export function getModuleItems(
  module: { id: string; lecciones?: any[]; actividades?: any[] },
  examenes: any[] = []
) {
  return [
    ...(module.lecciones || []).map((l: any) => ({
      ...l,
      tipo: 'leccion' as const,
      orden: l.orden || 0
    })),
    ...(examenes || [])
      .filter((ex: any) => ex.modulo_id === module.id && ex.tipo === 'INTERMEDIO')
      .map((ex: any) => ({
        ...ex,
        tipo: 'examen' as const,
        orden: ex.orden || 0
      })),
    ...(module.actividades || []).map((a: any) => ({
      ...a,
      tipo: 'actividad' as const,
      orden: a.orden || 0
    }))
  ].sort((a, b) => (a.orden || 0) - (b.orden || 0))
}
