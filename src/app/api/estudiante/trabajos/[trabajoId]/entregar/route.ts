import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * POST /api/estudiante/trabajos/[trabajoId]/entregar
 * Permite a un estudiante subir o actualizar su entrega para un trabajo.
 */
export async function POST(request: Request, props: { params: Promise<{ trabajoId: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { trabajoId } = params

    // 1. Obtener el Trabajo
    const trabajo = await prisma.trabajo.findUnique({
      where: { id: trabajoId }
    })

    if (!trabajo) {
      return ApiResponse.error(request, 'Trabajo no encontrado', 404)
    }

    // 2. Validar fechas de disponibilidad si están definidas
    const ahora = new Date()

    if (trabajo.fecha_inicio && ahora < trabajo.fecha_inicio) {
      return ApiResponse.error(
        request,
        `Este trabajo aún no está disponible para entregas. Estará activo desde el ${new Date(
          trabajo.fecha_inicio
        ).toLocaleString('es-PE')}`,
        400
      )
    }

    if (trabajo.fecha_fin && ahora > trabajo.fecha_fin) {
      return ApiResponse.error(
        request,
        `El plazo para entregar este trabajo venció el ${new Date(trabajo.fecha_fin).toLocaleString('es-PE')}`,
        400
      )
    }

    // 3. Obtener el cuerpo de la petición
    const body = await request.json()
    const { archivo_url, archivo_nombre, comentario_estudiante } = body

    if (!archivo_url || !archivo_nombre) {
      return ApiResponse.error(request, 'El archivo y su nombre son requeridos', 400)
    }

    // 4. Verificar si ya fue calificado para evitar sobrescritura no autorizada
    const entregaExistente = await prisma.entregaTrabajo.findUnique({
      where: {
        trabajo_id_usuario_id: {
          trabajo_id: trabajoId,
          usuario_id: user.id
        }
      }
    })

    if (entregaExistente && entregaExistente.nota !== null) {
      return ApiResponse.error(request, 'No puedes modificar una entrega que ya ha sido calificada', 400)
    }

    // 5. Crear o actualizar entrega
    const entrega = await prisma.entregaTrabajo.upsert({
      where: {
        trabajo_id_usuario_id: {
          trabajo_id: trabajoId,
          usuario_id: user.id
        }
      },
      create: {
        trabajo_id: trabajoId,
        usuario_id: user.id,
        archivo_url,
        archivo_nombre,
        comentario_estudiante: comentario_estudiante || null
      },
      update: {
        archivo_url,
        archivo_nombre,
        comentario_estudiante: comentario_estudiante || null,
        creado_en: ahora
      }
    })

    return ApiResponse.success(request, { entrega }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
