import prisma from '@/utils/libs/prisma'
import { reordenarCategoriasSchema } from '@/schemas/categoria.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/categorias/[id]/reordenar
 * Reordenar las subcategorías de la categoría padre [id]
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: padreId } = params
    const body = await request.json()

    const validation = validateRequest(reordenarCategoriasSchema, body, request)

    if (!validation.success) return validation.error

    const { items } = validation.data

    // Verificar que el padre existe
    const padre = await prisma.categoria.findUnique({
      where: { id: padreId }
    })

    if (!padre) {
      return ApiResponse.error(request, 'La categoría padre no existe', 404)
    }

    // Actualizar el orden de cada hijo en una transacción
    await prisma.$transaction(
      items.map(item =>
        prisma.categoria.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    )

    // Retornar los hijos actualizados
    const hijosActualizados = await prisma.categoria.findMany({
      where: { categoria_padre_id: padreId },
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
    })

    return ApiResponse.success(request, { hijos: hijosActualizados })
  } catch (error) {
    return handleApiError(error, request)
  }
}
