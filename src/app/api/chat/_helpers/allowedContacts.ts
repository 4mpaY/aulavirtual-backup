import prisma from '@/utils/libs/prisma'

export async function getAllowedContactIds(userId: string, rol: string): Promise<string[]> {
  const ids = new Set<string>()

  if (rol === 'ADMIN') {
    const todos = await prisma.usuario.findMany({
      where: { esta_activo: true, id: { not: userId } },
      select: { id: true }
    })

    todos.forEach(u => ids.add(u.id))
  }

  if (rol === 'PROFESOR') {
    const cursos = await prisma.curso.findMany({
      where: { profesor_id: userId },
      select: { id: true }
    })

    const inscripciones = await prisma.inscripcion.findMany({
      where: { curso_id: { in: cursos.map(c => c.id) } },
      select: { usuario_id: true }
    })

    inscripciones.forEach(i => ids.add(i.usuario_id))

    const admins = await prisma.usuario.findMany({
      where: { rol: 'ADMIN', esta_activo: true },
      select: { id: true }
    })

    admins.forEach(a => ids.add(a.id))
  }

  if (rol === 'ESTUDIANTE') {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuario_id: userId },
      include: { curso: { select: { profesor_id: true } } }
    })

    inscripciones.forEach(i => ids.add(i.curso.profesor_id))

    const admins = await prisma.usuario.findMany({
      where: { rol: 'ADMIN', esta_activo: true },
      select: { id: true }
    })

    admins.forEach(a => ids.add(a.id))

    const { getConfig } = await import('@/utils/libs/config')
    const chatEntreAlumnos = await getConfig('chat_entre_alumnos', 'false')

    if (chatEntreAlumnos === 'true') {
      const alumnos = await prisma.usuario.findMany({
        where: { rol: 'ESTUDIANTE', esta_activo: true, id: { not: userId } },
        select: { id: true }
      })

      alumnos.forEach(a => ids.add(a.id))
    }
  }

  ids.delete(userId)

  return Array.from(ids)
}
