import prisma from '@/utils/libs/prisma'

import type { MiCertificado } from '../entity/Certificado'

export async function getMisCertificados(usuarioId: string): Promise<MiCertificado[]> {
  const certificados = await prisma.certificado.findMany({
    where: { usuario_id: usuarioId },
    include: {
      curso: {
        select: {
          id: true,
          titulo: true,
          slug: true,
          miniatura: true,
          duracion: true,
          nivel: true,
          profesor: {
            select: { nombre: true, apellido: true }
          }
        }
      }
    },
    orderBy: { emitido_en: 'desc' }
  })

  return certificados.map(c => ({
    id: c.id,
    codigo_verificacion: c.codigo_verificacion,
    emitido_en: c.emitido_en.toISOString(),
    datos: c.datos,
    curso: c.curso
  }))
}
