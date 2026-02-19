import { NextResponse } from 'next/server'
import prisma from '@/utils/libs/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginSchema } from '@/schemas/auth.schema'
import { handleApiError } from '@/utils/libs/validation'

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
      return NextResponse.json(
        { message: 'Credenciales inválidas', errors: validacion.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { correo, contrasena } = validacion.data

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    })

    if (!usuario) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verificar si está activo
    if (!usuario.esta_activo) {
      return NextResponse.json(
        { message: 'Tu cuenta ha sido desactivada' },
        { status: 403 }
      )
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)

    if (!contrasenaValida) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Generar JWT
    const token = jwt.sign(
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

    return NextResponse.json({
      message: 'Login exitoso',
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
    return handleApiError(error)
  }
}
