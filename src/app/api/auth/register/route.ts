import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { registerSchema } from '@/schemas/auth.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar datos
    const validation = validateRequest(registerSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { correo, contrasena, nombre, apellido, numero_documento, celular } = validation.data

    // Verificar si el correo ya existe
    const correoExistente = await prisma.usuario.findUnique({
      where: { correo }
    })

    if (correoExistente) {
      return ApiResponse.error(request, 'El correo ya está registrado', 409)
    }

    // Verificar si el número de documento ya existe
    const documentoExistente = await prisma.usuario.findUnique({
      where: { numero_documento }
    })

    if (documentoExistente) {
      return ApiResponse.error(request, 'El número de documento ya está registrado', 409)
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

    return ApiResponse.success(request, { usuario: nuevoUsuario }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
