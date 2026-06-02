import axios from '@/utils/libs/axios'
import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

export async function getSimulacrosPublicos(): Promise<Simulacro[]> {
  try {
    const { data } = await axios.get('/api/simulacros', { params: { estado: 'PUBLICADO', limit: 100 } })
    return data.data?.simulacros ?? []
  } catch {
    return []
  }
}

export async function getSimulacroBySlug(slug: string): Promise<Simulacro | null> {
  try {
    const { data } = await axios.get('/api/simulacros', { params: { buscar: slug, limit: 50 } })
    const simulacros: Simulacro[] = data.data?.simulacros ?? []
    return simulacros.find(s => s.slug === slug) ?? null
  } catch {
    return null
  }
}
