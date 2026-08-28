export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { crearCursoSchema, listarCursosQuerySchema } from '@/schemas/curso.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { sanitizeDatetimeInput } from '@/utils/functions/sanitizeDatetime'
import { generateUniqueSlug } from '@/utils/libs/slug'


/**
 * GET /api/cursos
 * Listar cursos con filtros, paginación e información relacionada
 */
export async function GET(request: Request) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    const validation = validateRequest(listarCursosQuerySchema, query, request)

    if (!validation.success) return validation.error

    const { page, limit, buscar, estado, categoria_id, profesor_id, tipo } = validation.data

    const where: any = {}

    if (tipo) {
      where.tipo = tipo
    }

    if (estado) {
      where.estado = estado
    }

    if (categoria_id) {
      where.categoria_id = categoria_id
    }

    if (profesor_id) {
      where.profesor_id = profesor_id
    }

    // Si es PROFESOR, solo puede ver sus propios cursos
    if (user.rol === 'PROFESOR') {
      where.profesor_id = user.id
    }

    if (buscar) {
      where.OR = [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { slug: { contains: buscar, mode: 'insensitive' } }
      ]
    }

    const skip = (page - 1) * limit

    const [cursos, total] = await Promise.all([
      prisma.curso.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        include: {
          profesor: {
            select: { id: true, nombre: true, apellido: true, avatar: true }
          },
          categoria: {
            select: { id: true, nombre: true }
          },
          modulos: {
            select: {
              _count: {
                select: { lecciones: true }
              }
            }
          },
          _count: {
            select: { modulos: true, inscripciones: true, valoraciones: true }
          }
        }
      }),
      prisma.curso.count({ where })
    ])

    const cursoIds = cursos.map(c => c.id)

    const valoracionesStats = cursoIds.length > 0
      ? await prisma.valoracionCurso.groupBy({
          by: ['curso_id'],
          where: { curso_id: { in: cursoIds } },
          _avg: { puntuacion: true },
          _count: { id: true }
        })
      : []

    const valoracionesMap = new Map(
      valoracionesStats.map(stat => [
        stat.curso_id,
        {
          promedio: stat._avg.puntuacion || 0,
          total: stat._count.id || 0
        }
      ])
    )

    const cursosConEstadisticas = cursos.map(curso => {
      const { modulos, ...rest } = curso
      const leccionesCount = (modulos || []).reduce((acc, m) => acc + (m._count?.lecciones || 0), 0)
      const valInfo = valoracionesMap.get(curso.id)

      return {
        ...rest,
        _count: {
          ...curso._count,
          modulos: modulos?.length || 0,
          lecciones: leccionesCount,
          valoraciones: valInfo?.total || curso._count.valoraciones || 0
        },
        promedio_valoracion: valInfo?.promedio || 0
      }
    })

    return ApiResponse.success(request, {
      cursos: cursosConEstadisticas,
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

/**
 * POST /api/cursos
 * Crear un nuevo curso en estado BORRADOR
 */
export async function POST(request: Request) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const body = await request.json()

    const validation = validateRequest(crearCursoSchema, body, request)

    if (!validation.success) return validation.error

    const data = validation.data

    if (user.rol === 'PROFESOR') {
      // Un profesor solo puede crearse cursos a sí mismo
      data.profesor_id = user.id
    } else {
      // Un ADMIN debe especificar el profesor o se valida el enviado
      const profesor = await prisma.usuario.findUnique({
        where: { id: data.profesor_id }
      })

      if (!profesor) {
        return ApiResponse.error(request, 'El profesor seleccionado no existe', 404)
      }

      if (profesor.rol !== 'PROFESOR' && profesor.rol !== 'ADMIN') {
        return ApiResponse.error(request, 'El usuario seleccionado no tiene rol de profesor', 400)
      }
    }

    // Verificar categoría si se proporcionó
    if (data.categoria_id) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: data.categoria_id }
      })

      if (!categoria) {
        return ApiResponse.error(request, 'La categoría seleccionada no existe', 404)
      }
    }

    const slug = await generateUniqueSlug(validation.data.titulo, prisma.curso)

    const fechaInicio = sanitizeDatetimeInput(validation.data.fecha_inicio)

    const nuevoCurso = await prisma.curso.create({
      data: {
        ...validation.data,
        slug,
        fecha_inicio: fechaInicio ? new Date(fechaInicio) : null,
        estado: 'BORRADOR'
      },
      include: {
        profesor: {
          select: { id: true, slug: true, nombre: true, apellido: true, avatar: true }
        },
        categoria: {
          select: { id: true, nombre: true, slug: true }
        },
        _count: {
          select: { modulos: true, inscripciones: true }
        }
      }
    })

    return ApiResponse.success(request, { curso: nuevoCurso }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
