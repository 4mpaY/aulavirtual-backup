import { NextResponse } from 'next/server'
import prisma from '@/utils/libs/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/schemas/auth.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar datos
    const validation = validateRequest(registerSchema, body)

    if (!validation.success) {
      return validation.error
    }

    const { correo, contrasena, nombre, apellido, numero_documento, celular } = validation.data

    // Verificar si el correo ya existe
    const correoExistente = await prisma.usuario.findUnique({
      where: { correo }
    })

    if (correoExistente) {
      return NextResponse.json(
        { message: 'El correo ya está registrado' },
        { status: 409 }
      )
    }

    // Verificar si el número de documento ya existe
    const documentoExistente = await prisma.usuario.findUnique({
      where: { numero_documento }
    })

    if (documentoExistente) {
      return NextResponse.json(
        { message: 'El número de documento ya está registrado' },
        { status: 409 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10)

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        correo,
        contrasena: hashedPassword,
        nombre,
        apellido,
        numero_documento,
        celular: celular || null,
        rol: 'ESTUDIANTE' // Por defecto siempre ESTUDIANTE en registro público
      },
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        numero_documento: true,
        celular: true,
        rol: true,
        esta_activo: true,
        creado_en: true
      }
    })

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        usuario: nuevoUsuario
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
