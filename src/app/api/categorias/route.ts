export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { crearCategoriaSchema, listarCategoriasQuerySchema } from '@/schemas/categoria.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
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
 * Genera un slug único verificando en la base de datos
 */
async function generateUniqueSlug(nombre: string, excludeId?: string): Promise<string> {
  const slug = generateSlug(nombre)
  let counter = 0
  let candidateSlug = slug

  while (true) {
    const existing = await prisma.categoria.findUnique({
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
 * GET /api/categorias
 * Listar solo categorías padre (sin padre), con sus hijos incluidos
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    const validation = validateRequest(listarCategoriasQuerySchema, query, request)

    if (!validation.success) return validation.error

    const { page, limit, buscar, esta_activo } = validation.data

    // Solo categorías padre (raíz)
    const where: any = {
      categoria_padre_id: null
    }

    if (esta_activo !== undefined) {
      where.esta_activo = esta_activo
    }

    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { slug: { contains: buscar, mode: 'insensitive' } }
      ]
    }

    const skip = (page - 1) * limit

    const [categorias, total] = await Promise.all([
      prisma.categoria.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orden: 'asc' },
        include: {
          hijos: {
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              nombre: true,
              slug: true,
              descripcion: true,
              esta_activo: true,
              orden: true,
              creado_en: true,
              actualizado_en: true
            }
          },
          _count: {
            select: { hijos: true, cursos: true }
          }
        }
      }),
      prisma.categoria.count({ where })
    ])

    return ApiResponse.success(request, {
      categorias,
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
 * POST /api/categorias
 * Crear una nueva categoría padre (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()

    const validation = validateRequest(crearCategoriaSchema, body, request)

    if (!validation.success) return validation.error

    const { nombre, descripcion } = validation.data

    // Verificar nombre único
    const nombreExistente = await prisma.categoria.findUnique({
      where: { nombre }
    })

    if (nombreExistente) {
      return ApiResponse.error(request, 'Ya existe una categoría con ese nombre', 409)
    }

    // Generar slug único
    const slug = await generateUniqueSlug(nombre)

    // Calcular orden: al final de las categorías padre
    const maxOrden = await prisma.categoria.aggregate({
      where: { categoria_padre_id: null },
      _max: { orden: true }
    })

    const orden = (maxOrden._max.orden ?? -1) + 1

    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre,
        slug,
        descripcion: descripcion || null,
        categoria_padre_id: null,
        orden
      },
      include: {
        hijos: {
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: { hijos: true, cursos: true }
        }
      }
    })

    return ApiResponse.success(request, { categoria: nuevaCategoria }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
