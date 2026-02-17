import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { actualizarPerfilSchema } from '@/schemas/usuario.schema'
import { validateRequest, handleApiError } from '@/libs/validation'
import { requireAuth } from '@/libs/auth-helpers'

/**
 * GET /api/usuarios/me
 * Obtener perfil del usuario autenticado
 */
export async function GET() {
  try {
    // Verificar autenticación
    const auth = await requireAuth()
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
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(usuario)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/usuarios/me
 * Actualizar perfil del usuario autenticado
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
    const validation = validateRequest(actualizarPerfilSchema, body)

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

    return NextResponse.json({
      message: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado
    })
  } catch (error) {
    return handleApiError(error)
  }
}
