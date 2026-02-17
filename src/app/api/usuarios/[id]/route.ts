import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { actualizarUsuarioSchema } from '@/schemas/usuario.schema'
import { validateRequest, handleApiError } from '@/libs/validation'
import { requireAdmin, requireAuth } from '@/libs/auth-helpers'
import { Rol } from '@prisma/client'

/**
 * GET /api/usuarios/[id]
 * Obtener un usuario por ID (ADMIN o el mismo usuario)
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const auth = await requireAuth()
    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params

    // Verificar permisos: debe ser admin o el mismo usuario
    if (auth.user.rol !== Rol.ADMIN && auth.user.id !== id) {
      return NextResponse.json(
        { message: 'No tienes permisos para ver este usuario' },
        { status: 403 }
      )
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id },
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
 * PATCH /api/usuarios/[id]
 * Actualizar un usuario (ADMIN)
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar que sea admin
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params
    const body = await request.json()

    // Validar datos
    const validation = validateRequest(actualizarUsuarioSchema, body)

    if (!validation.success) {
      return validation.error
    }

    const data = validation.data

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    // Si se actualiza el correo, verificar que no exista
    if (data.correo && data.correo !== usuario.correo) {
      const correoExistente = await prisma.usuario.findUnique({
        where: { correo: data.correo }
      })

      if (correoExistente) {
        return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 409 })
      }
    }

    // Si se actualiza el número de documento, verificar que no exista
    if (data.numero_documento && data.numero_documento !== usuario.numero_documento) {
      const documentoExistente = await prisma.usuario.findUnique({
        where: { numero_documento: data.numero_documento }
      })

      if (documentoExistente) {
        return NextResponse.json(
          { message: 'El número de documento ya está registrado' },
          { status: 409 }
        )
      }
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
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
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/usuarios/[id]
 * Eliminar un usuario (ADMIN)
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar que sea admin
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    // No permitir eliminar al propio admin
    if (auth.user.id === id) {
      return NextResponse.json({ message: 'No puedes eliminar tu propia cuenta' }, { status: 400 })
    }

    // Eliminar usuario
    await prisma.usuario.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    return handleApiError(error)
  }
}
