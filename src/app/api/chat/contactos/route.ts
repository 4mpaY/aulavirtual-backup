export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getAllowedContactIds } from '../_helpers/allowedContacts'

async function getCursosCompartidos(
  userId: string,
  rol: string
): Promise<Map<string, { id: string; titulo: string }[]>> {
  const mapa = new Map<string, { id: string; titulo: string }[]>()

  if (rol === 'PROFESOR') {
    const cursos = await prisma.curso.findMany({
      where: { profesor_id: userId },
      select: {
        id: true,
        titulo: true,
        inscripciones: { select: { usuario_id: true } }
      }
    })

    for (const curso of cursos) {
      for (const insc of curso.inscripciones) {
        const entrada = mapa.get(insc.usuario_id) ?? []

        entrada.push({ id: curso.id, titulo: curso.titulo })
        mapa.set(insc.usuario_id, entrada)
      }
    }
  }

  if (rol === 'ESTUDIANTE') {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuario_id: userId },
      include: { curso: { select: { id: true, titulo: true, profesor_id: true } } }
    })

    for (const insc of inscripciones) {
      const pid = insc.curso.profesor_id
      const entrada = mapa.get(pid) ?? []

      entrada.push({ id: insc.curso.id, titulo: insc.curso.titulo })
      mapa.set(pid, entrada)
    }
  }

  return mapa
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const allowedIds = await getAllowedContactIds(auth.user.id, auth.user.rol)

    if (allowedIds.length === 0) {
      return ApiResponse.success(request, [])
    }

    const [usuarios, cursosMap, conversaciones] = await Promise.all([
      prisma.usuario.findMany({
        where: { id: { in: allowedIds }, esta_activo: true },
        select: { id: true, nombre: true, apellido: true, avatar: true, rol: true }
      }),
      getCursosCompartidos(auth.user.id, auth.user.rol),
      prisma.conversacion.findMany({
        where: { participantes: { some: { usuario_id: auth.user.id } } },
        include: { participantes: { select: { usuario_id: true } } }
      })
    ])

    const contactos = usuarios.map(u => {
      const conv = conversaciones.find(
        c => c.participantes.length === 2 && c.participantes.some(p => p.usuario_id === u.id)
      )

      return {
        ...u,
        cursos: cursosMap.get(u.id) ?? [],
        conversacion_id: conv?.id ?? null
      }
    })

    return ApiResponse.success(request, contactos)
  } catch (error) {
    return handleApiError(error, request)
  }
}
