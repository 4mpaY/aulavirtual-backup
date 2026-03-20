export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { crearCursoSchema, listarCursosQuerySchema } from '@/schemas/curso.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * Genera un slug a partir de un texto
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Genera un slug único para cursos
 */
async function generateUniqueSlug(titulo: string, excludeId?: string): Promise<string> {
  const slug = generateSlug(titulo)
  let counter = 0
  let candidateSlug = slug

  while (true) {
    const existing = await prisma.curso.findUnique({
      where: { slug: candidateSlug }
    })

    if (!existing || existing.id === excludeId) {
      return candidateSlug
    }

    counter++
    candidateSlug = `${slug}-${counter}`
  }
}

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

    const { page, limit, buscar, estado, categoria_id, profesor_id } = validation.data

    const where: any = {}

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
          _count: {
            select: { modulos: true, inscripciones: true }
          }
        }
      }),
      prisma.curso.count({ where })
    ])

    // Contar lecciones por curso (Prisma no soporta nested _count directo)
    const cursosConLecciones = await Promise.all(
      cursos.map(async curso => {
        const leccionesCount = await prisma.leccion.count({
          where: { modulo: { curso_id: curso.id } }
        })

        return {
          ...curso,
          _count: {
            ...curso._count,
            lecciones: leccionesCount
          }
        }
      })
    )

    return ApiResponse.success(request, {
      cursos: cursosConLecciones,
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

    // Generar slug único
    const slug = await generateUniqueSlug(data.titulo)

    const nuevoCurso = await prisma.curso.create({
      data: {
        titulo: data.titulo,
        slug,
        descripcion: data.descripcion || null,
        categoria_id: data.categoria_id || null,
        profesor_id: data.profesor_id,
        tipo_emision: data.tipo_emision,
        es_gratis: data.es_gratis,
        precio: data.precio,
        moneda: data.moneda,
        duracion: data.duracion || null,
        miniatura: data.miniatura || null,
        video_presentacion: data.video_presentacion || null,
        fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : null,
        estado: 'BORRADOR'
      },
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, avatar: true }
        },
        categoria: {
          select: { id: true, nombre: true }
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
