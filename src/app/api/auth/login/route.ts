import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import prisma from '@/utils/libs/prisma'
import { loginSchema } from '@/schemas/auth.schema'
import { handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'

/**
 * POST /api/auth/login
 * Login para obtener JWT token (útil para Postman)
 *
 * Body: { correo, contrasena }
 * Response: { token, usuario }
 *
 * Uso en Postman:
 *   Header: Authorization: Bearer <token>
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar credenciales
    const validacion = loginSchema.safeParse(body)

    if (!validacion.success) {
      return ApiResponse.validationError(request, validacion.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const { correo, contrasena } = validacion.data

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    })

    if (!usuario) {
      return ApiResponse.error(request, 'Correo o contraseña incorrectos', 401)
    }

    // Verificar si está activo
    if (!usuario.esta_activo) {
      return ApiResponse.error(request, 'Tu cuenta ha sido desactivada', 403)
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena as string)

    if (!contrasenaValida) {
      return ApiResponse.error(request, 'Correo o contraseña incorrectos', 401)
    }

    // Generar JWT
    const token = sign(
      {
        id: usuario.id,
        email: usuario.correo,
        name: `${usuario.nombre} ${usuario.apellido}`,
        rol: usuario.rol,
        numero_documento: usuario.numero_documento,
        esta_activo: usuario.esta_activo
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return ApiResponse.success(request, {
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        numero_documento: usuario.numero_documento,
        esta_activo: usuario.esta_activo
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
