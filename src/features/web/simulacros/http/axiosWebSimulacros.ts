import prisma from '@/utils/libs/prisma'

import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

export async function getSimulacrosPublicos(): Promise<Simulacro[]> {
  try {
    const rows = await prisma.simulacro.findMany({
      where: { estado: 'PUBLICADO' },
      orderBy: { creado_en: 'desc' },
    })

    return rows as unknown as Simulacro[]
  } catch {
    return []
  }
}

export async function getSimulacroBySlug(slug: string): Promise<Simulacro | null> {
  try {
    const row = await prisma.simulacro.findUnique({ where: { slug } })

    return row as unknown as Simulacro | null
  } catch {
    return null
  }
}
