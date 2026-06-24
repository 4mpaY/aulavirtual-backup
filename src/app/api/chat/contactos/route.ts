export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getAllowedContactIds } from '../_helpers/allowedContacts'

const LIMIT_MAX = 100
const LIMIT_DEFAULT = 20

async function getCursosCompartidos(
  userId: string,
  rol: string,
  contactIds: string[]
): Promise<Map<string, { id: string; titulo: string }[]>> {
  const mapa = new Map<string, { id: string; titulo: string }[]>()

  if (rol === 'PROFESOR') {
    const cursos = await prisma.curso.findMany({
      where: { profesor_id: userId },
      select: {
        id: true,
        titulo: true,
        inscripciones: { where: { usuario_id: { in: contactIds } }, select: { usuario_id: true } }
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
      where: { usuario_id: userId, curso: { profesor_id: { in: contactIds } } },
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

    const { searchParams } = new URL(request.url)
    const cursoId = searchParams.get('curso_id') ?? ''
    const buscar = searchParams.get('buscar')?.trim() ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(LIMIT_MAX, Math.max(1, parseInt(searchParams.get('limit') ?? String(LIMIT_DEFAULT), 10)))
    const skip = (page - 1) * limit

    const allowedIds = await getAllowedContactIds(auth.user.id, auth.user.rol)

    if (allowedIds.length === 0) {
      return ApiResponse.success(request, {
        results: [],
        paginacion: { total: 0, page, limit, totalPages: 0 }
      })
    }

    let filteredIds = allowedIds

    if (cursoId) {
      const [inscripciones, curso] = await Promise.all([
        prisma.inscripcion.findMany({
          where: { curso_id: cursoId },
          select: { usuario_id: true }
        }),
        prisma.curso.findUnique({
          where: { id: cursoId },
          select: { profesor_id: true, titulo: true }
        })
      ])

      const enCurso = new Set([
        ...inscripciones.map(i => i.usuario_id),
        ...(curso?.profesor_id ? [curso.profesor_id] : [])
      ])

      filteredIds = allowedIds.filter(id => enCurso.has(id))
    }

    const where = {
      id: { in: filteredIds },
      esta_activo: true,
      ...(buscar
        ? {
          OR: [
            { nombre: { contains: buscar, mode: 'insensitive' as const } },
            { apellido: { contains: buscar, mode: 'insensitive' as const } }
          ]
        }
        : {})
    }

    const [usuarios, total, conversaciones] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: { id: true, nombre: true, apellido: true, avatar: true, rol: true },
        orderBy: [{ nombre: 'asc' }, { apellido: 'asc' }],
        skip,
        take: limit
      }),
      prisma.usuario.count({ where }),
      prisma.conversacion.findMany({
        where: { participantes: { some: { usuario_id: auth.user.id } } },
        include: { participantes: { select: { usuario_id: true } } }
      })
    ])

    const usuarioIds = usuarios.map(u => u.id)

    let cursosMap: Map<string, { id: string; titulo: string }[]>

    if (cursoId) {
      const curso = await prisma.curso.findUnique({
        where: { id: cursoId },
        select: { id: true, titulo: true }
      })

      cursosMap = new Map(
        usuarioIds.map(id => [id, curso ? [{ id: curso.id, titulo: curso.titulo }] : []])
      )
    } else {
      cursosMap = await getCursosCompartidos(auth.user.id, auth.user.rol, usuarioIds)
    }

    const results = usuarios.map(u => {
      const conv = conversaciones.find(
        c => c.participantes.length === 2 && c.participantes.some(p => p.usuario_id === u.id)
      )

      return {
        ...u,
        cursos: cursosMap.get(u.id) ?? [],
        conversacion_id: conv?.id ?? null
      }
    })

    return ApiResponse.success(request, {
      results,
      paginacion: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
