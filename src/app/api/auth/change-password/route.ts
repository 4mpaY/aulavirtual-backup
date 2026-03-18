import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { changePasswordSchema } from '@/schemas/auth.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
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
    const validation = validateRequest(changePasswordSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { contrasenaActual, nuevaContrasena } = validation.data

    // Obtener usuario actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: auth.user.id }
    })

    if (!usuario || !usuario.contrasena) {
      return ApiResponse.error(request, 'Usuario no encontrado o autenticado con proveedor externo', 404)
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.contrasena)

    if (!contrasenaValida) {
      return ApiResponse.error(request, 'La contraseña actual es incorrecta', 400)
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10)

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: auth.user.id },
      data: { contrasena: hashedPassword }
    })

    return ApiResponse.success(request, { message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
