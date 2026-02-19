import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/configs/auth'
import { Rol } from '@prisma/client'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { ApiResponse } from './apiResponse'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'

type AuthUser = {
  id: string
  name?: string | null
  email?: string | null
  rol: string
  avatar?: string | null
  numero_documento: string
  esta_activo: boolean
}

/**
 * Obtiene el usuario desde el Bearer token (para Postman/API externa)
 */
async function getUserFromBearerToken(): Promise<AuthUser | null> {
  try {
    const headersList = headers()
    const authorization = headersList.get('authorization')

    if (!authorization?.startsWith('Bearer ')) {
      return null
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      rol: decoded.rol,
      avatar: decoded.avatar || null,
      numero_documento: decoded.numero_documento,
      esta_activo: decoded.esta_activo
    }
  } catch (error) {
    console.error('[AUTH] Error verifying Bearer token:', error)
    return null
  }
}

/**
 * Obtiene la sesión del usuario actual
 * Intenta primero con NextAuth (cookies del navegador),
 * luego con Bearer token (Postman/API)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // 1. Intentar con NextAuth (sesión del navegador)
  const session = await getServerSession(authOptions)

  if (session?.user) {
    return session.user as AuthUser
  }

  // 2. Intentar con Bearer token (Postman/API)
  return getUserFromBearerToken()
}

/**
 * Verifica si el usuario está autenticado
 */
export async function requireAuth(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      authorized: false as const,
      error: ApiResponse.error(request, 'No autorizado. Debes iniciar sesión.', 401)
    }
  }

  return {
    authorized: true as const,
    user
  }
}

/**
 * Verifica si el usuario tiene uno de los roles permitidos
 */
export async function requireRole(request: Request, allowedRoles: Rol[]) {
  const auth = await requireAuth(request)

  if (!auth.authorized) {
    return auth
  }

  if (!allowedRoles.includes(auth.user.rol as Rol)) {
    return {
      authorized: false as const,
      error: ApiResponse.error(request, 'No tienes permisos para realizar esta acción.', 403)
    }
  }

  return {
    authorized: true as const,
    user: auth.user
  }
}

/**
 * Verifica si el usuario es administrador
 */
export async function requireAdmin(request: Request) {
  return requireRole(request, [Rol.ADMIN])
}

/**
 * Verifica si el usuario es profesor o admin
 */
export async function requireProfesorOrAdmin(request: Request) {
  return requireRole(request, [Rol.ADMIN, Rol.PROFESOR])
}
