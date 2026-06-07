import prisma from './prisma'

type Razon = 'ADMIN' | 'PROFESOR' | 'INSCRIPCION' | 'SUSCRIPCION' | 'SIN_ACCESO'

export async function puedeAccederCurso(
  usuarioId: string,
  cursoId: string,
  rol: string,
  profesorId?: string | null
): Promise<{ acceso: boolean; razon: Razon }> {
  if (rol === 'ADMIN') return { acceso: true, razon: 'ADMIN' }
  if (rol === 'PROFESOR' && profesorId && profesorId === usuarioId) return { acceso: true, razon: 'PROFESOR' }

  // Verificar inscripción directa activa con vigencia
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { usuario_id_curso_id: { usuario_id: usuarioId, curso_id: cursoId } },
    include: { curso: { select: { vigencia_meses: true } } }
  })

  if (inscripcion && inscripcion.estado === 'ACTIVO') {
    const vigencia = inscripcion.curso.vigencia_meses ?? 0

    if (vigencia === 0) return { acceso: true, razon: 'INSCRIPCION' }

    const expira = new Date(inscripcion.inscrito_en)

    expira.setMonth(expira.getMonth() + vigencia)
    if (expira > new Date()) return { acceso: true, razon: 'INSCRIPCION' }
  }

  // Verificar suscripción activa que incluya el curso
  const suscripcion = await prisma.suscripcion.findFirst({
    where: {
      usuario_id: usuarioId,
      estado: { in: ['ACTIVA', 'EN_PRUEBA'] },
      plan: { cursos: { some: { curso_id: cursoId } } }
    }
  })

  if (suscripcion) return { acceso: true, razon: 'SUSCRIPCION' }

  return { acceso: false, razon: 'SIN_ACCESO' }
}
