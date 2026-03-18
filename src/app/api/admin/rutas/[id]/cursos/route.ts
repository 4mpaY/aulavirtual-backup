import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * POST /api/admin/rutas/[id]/cursos
 * Gestiona los cursos dentro de una ruta (añadir/reordenar)
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)
    
    if (!auth.authorized || auth.user.rol !== 'ADMIN') return ApiResponse.error(request, 'No autorizado', 403)

    const { cursos, secciones } = await request.json() // Array de cursos y array de secciones

    if (!Array.isArray(cursos)) return ApiResponse.error(request, 'Se requiere un array de cursos', 400)

    // Usamos una transacción para asegurar que la actualización de la ruta y sus vínculos sea atómica
    await prisma.$transaction([
      // Actualizar las definiciones de secciones en la ruta usando SQL crudo como bypass temporal
      // debido a que el cliente Prisma no puede regenerarse por bloqueo de archivos en Windows.
      prisma.$executeRaw`UPDATE "rutas_aprendizaje" SET "secciones" = ${JSON.stringify(secciones || [])}::jsonb WHERE "id" = ${params.id}`,

      // Limpiar y recrear los vínculos de cursos
      prisma.cursoEnRuta.deleteMany({
        where: { ruta_id: params.id }
      }),
      prisma.cursoEnRuta.createMany({
        data: cursos.map((item: { id: string; seccion_id?: string | null }, i) => ({
          ruta_id: params.id,
          curso_id: item.id,
          seccion_id: item.seccion_id || null,
          orden: i + 1
        }))
      })
    ])

    return ApiResponse.success(request, { message: 'Cursos de la ruta actualizados correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
