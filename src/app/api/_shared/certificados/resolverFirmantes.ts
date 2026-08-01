import prisma from '@/utils/libs/prisma'

import type { SignatarioData } from './generators/types'

type FirmanteCursoSelect = {
  nombre: string
  cargo: string | null
  firma: string | null
  sello: string | null
} | null

/**
 * Resuelve Firmante 1 / Firmante 2 para la plantilla de certificado personalizada.
 * Prioridad: override del curso (`curso.firmante_1`/`firmante_2`) > firmante global
 * por defecto (`CERTIFICADO_FIRMANTE_1_ID`/`_2_ID` en Configuración) > ninguno.
 *
 * Es una función completamente aparte de la resolución de "gerente general" /
 * "docente" (usadas por las 5 plantillas fijas): no reutiliza ni modifica esa
 * lógica en absoluto.
 */
export async function resolverFirmantes(opts: {
  cursoFirmante1: FirmanteCursoSelect
  cursoFirmante2: FirmanteCursoSelect
  configs: Record<string, string>
}): Promise<{ firmante1: SignatarioData | null; firmante2: SignatarioData | null }> {
  const { cursoFirmante1, cursoFirmante2, configs } = opts

  const idsAResolver: string[] = []

  if (!cursoFirmante1 && configs.CERTIFICADO_FIRMANTE_1_ID) idsAResolver.push(configs.CERTIFICADO_FIRMANTE_1_ID)
  if (!cursoFirmante2 && configs.CERTIFICADO_FIRMANTE_2_ID) idsAResolver.push(configs.CERTIFICADO_FIRMANTE_2_ID)

  const defaults = idsAResolver.length
    ? await prisma.firmante.findMany({
        where: { id: { in: idsAResolver } },
        select: { id: true, nombre: true, cargo: true, firma: true, sello: true }
      })
    : []

  const porId = new Map(defaults.map(f => [f.id, f]))

  const firmante1 = cursoFirmante1 ?? porId.get(configs.CERTIFICADO_FIRMANTE_1_ID || '') ?? null
  const firmante2 = cursoFirmante2 ?? porId.get(configs.CERTIFICADO_FIRMANTE_2_ID || '') ?? null

  return {
    firmante1: firmante1 ? { nombre: firmante1.nombre, cargo: firmante1.cargo, firma: firmante1.firma, sello: firmante1.sello } : null,
    firmante2: firmante2 ? { nombre: firmante2.nombre, cargo: firmante2.cargo, firma: firmante2.firma, sello: firmante2.sello } : null
  }
}
