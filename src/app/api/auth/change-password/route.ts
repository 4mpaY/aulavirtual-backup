import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcryptjs'
import { changePasswordSchema } from '@/schemas/auth.schema'
import { validateRequest, handleApiError } from '@/libs/validation'
import { requireAuth } from '@/libs/auth-helpers'

/**
 * PATCH /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
 */
export async function PATCH(request: Request) {
  try {
    // Verificar autenticación
    const auth = await requireAuth()
    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()

    // Validar datos
    const validation = validateRequest(changePasswordSchema, body)

    if (!validation.success) {
      return validation.error
    }

    const { contrasenaActual, nuevaContrasena } = validation.data

    // Obtener usuario actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: auth.user.id }
    })

    if (!usuario) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.contrasena)

    if (!contrasenaValida) {
      return NextResponse.json(
        { message: 'La contraseña actual es incorrecta' },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10)

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: auth.user.id },
      data: { contrasena: hashedPassword }
    })

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    return handleApiError(error)
  }
}
