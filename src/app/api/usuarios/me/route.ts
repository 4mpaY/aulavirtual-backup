import prisma from '@/utils/libs/prisma'
import { actualizarPerfilSchema } from '@/schemas/usuario.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * GET /api/usuarios/me
 * Obtener perfil del usuario autenticado
 */
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        numero_documento: true,
        celular: true,
        avatar: true,
        biografia: true,
        rol: true,
        esta_activo: true,
        creado_en: true,
        actualizado_en: true
      }
    })

    if (!usuario) {
      return ApiResponse.error(request, 'Usuario no encontrado', 404)
    }

    return ApiResponse.success(request, usuario)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/usuarios/me
 * Actualizar perfil del usuario autenticado
 */
export async function PATCH(request: Request) {
  try {
    // Verificar autenticación
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()

    // Validar datos
    const validation = validateRequest(actualizarPerfilSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const data = validation.data

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: auth.user.id },
      data,
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        numero_documento: true,
        celular: true,
        avatar: true,
        biografia: true,
        rol: true,
        esta_activo: true,
        actualizado_en: true
      }
    })

    return ApiResponse.success(request, { usuario: usuarioActualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}
