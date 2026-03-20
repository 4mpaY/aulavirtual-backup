export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { actualizarCategoriaSchema } from '@/schemas/categoria.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin, requireAuth } from '@/utils/libs/auth-helpers'
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
 * GET /api/categorias/[id]
 * Obtener una categoría por ID con sus hijos ordenados
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { id } = params

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        padre: {
          select: { id: true, nombre: true }
        },
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
          select: { cursos: true, hijos: true }
        }
      }
    })

    if (!categoria) {
      return ApiResponse.error(request, 'Categoría no encontrada', 404)
    }

    return ApiResponse.success(request, categoria)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/categorias/[id]
 * Actualizar una categoría (solo ADMIN)
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id } = params
    const body = await request.json()

    const validation = validateRequest(actualizarCategoriaSchema, body, request)

    if (!validation.success) return validation.error

    const data = validation.data

    // Verificar que la categoría existe
    const categoria = await prisma.categoria.findUnique({
      where: { id }
    })

    if (!categoria) {
      return ApiResponse.error(request, 'Categoría no encontrada', 404)
    }

    // Si se actualiza el nombre, verificar unicidad y regenerar slug
    const updateData: any = { ...data }

    if (data.nombre && data.nombre !== categoria.nombre) {
      const nombreExistente = await prisma.categoria.findUnique({
        where: { nombre: data.nombre }
      })

      if (nombreExistente) {
        return ApiResponse.error(request, 'Ya existe una categoría con ese nombre', 409)
      }

      updateData.slug = await generateUniqueSlug(data.nombre, id)
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: updateData,
      include: {
        padre: {
          select: { id: true, nombre: true }
        },
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
    })

    return ApiResponse.success(request, { categoria: categoriaActualizada })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/categorias/[id]
 * Eliminar una categoría (solo ADMIN)
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id } = params

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: { select: { cursos: true } }
      }
    })

    if (!categoria) {
      return ApiResponse.error(request, 'Categoría no encontrada', 404)
    }

    // No permitir eliminar si tiene cursos asociados
    if (categoria._count.cursos > 0) {
      return ApiResponse.error(
        request,
        `No se puede eliminar: esta categoría tiene ${categoria._count.cursos} curso(s) asociado(s)`,
        409
      )
    }

    await prisma.categoria.delete({
      where: { id }
    })

    return ApiResponse.success(request, { message: 'Categoría eliminada exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
