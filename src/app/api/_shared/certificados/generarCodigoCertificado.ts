import prisma from '@/utils/libs/prisma'

/**
 * Formatea el código de verificación de un certificado: {codigoCurso}-{YYMMDD}-{NNNNNN}.
 * NNNNNN es un contador secuencial (base 1) de certificados emitidos para ese curso,
 * con padding a 6 dígitos.
 */
export function formatearCodigoCertificado(codigoCurso: string, fecha: Date, numeroSecuencial: number) {
  const fechaStr = fecha.toISOString().slice(2, 10).replace(/-/g, '')
  const numero = String(numeroSecuencial).padStart(6, '0')

  return `${codigoCurso}-${fechaStr}-${numero}`
}

export async function contarCertificadosCurso(cursoId: string) {
  return prisma.certificado.count({ where: { curso_id: cursoId } })
}
