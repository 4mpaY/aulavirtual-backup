import prisma from '@/utils/libs/prisma'
import { crearSubcategoriaSchema } from '@/schemas/categoria.schema'
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
async function generateUniqueSlug(nombre: string): Promise<string> {
  let slug = generateSlug(nombre)
  let counter = 0
  let candidateSlug = slug

  while (true) {
    const existing = await prisma.categoria.findUnique({
      where: { slug: candidateSlug }
    })

    if (!existing) {
      return candidateSlug
    }

    counter++
    candidateSlug = `${slug}-${counter}`
  }
}

/**
 * POST /api/categorias/[id]/hijos
 * Crear una subcategoría (hijo) para la categoría padre [id]
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: padreId } = params
    const body = await request.json()

    const validation = validateRequest(crearSubcategoriaSchema, body, request)
    if (!validation.success) return validation.error

    const { nombre, descripcion } = validation.data

    // Verificar que el padre existe y es una categoría raíz
    const padre = await prisma.categoria.findUnique({
      where: { id: padreId }
    })

    if (!padre) {
      return ApiResponse.error(request, 'La categoría padre no existe', 404)
    }

    if (padre.categoria_padre_id !== null) {
      return ApiResponse.error(request, 'No se pueden crear subcategorías de una subcategoría (máx. 1 nivel)', 400)
    }

    // Verificar nombre único
    const nombreExistente = await prisma.categoria.findUnique({
      where: { nombre }
    })

    if (nombreExistente) {
      return ApiResponse.error(request, 'Ya existe una categoría con ese nombre', 409)
    }

    // Generar slug único
    const slug = await generateUniqueSlug(nombre)

    // Calcular orden: al final de los hijos del padre
    const maxOrden = await prisma.categoria.aggregate({
      where: { categoria_padre_id: padreId },
      _max: { orden: true }
    })

    const orden = (maxOrden._max.orden ?? -1) + 1

    const nuevaSubcategoria = await prisma.categoria.create({
      data: {
        nombre,
        slug,
        descripcion: descripcion || null,
        categoria_padre_id: padreId,
        orden
      }
    })

    return ApiResponse.success(request, { categoria: nuevaSubcategoria }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
