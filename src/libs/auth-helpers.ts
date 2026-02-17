import { getServerSession } from 'next-auth'
import { authOptions } from '@/configs/auth'
import { Rol } from '@prisma/client'
import { NextResponse } from 'next/server'

/**
 * Obtiene la sesión del usuario actual
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

/**
 * Verifica si el usuario está autenticado
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      authorized: false as const,
      error: NextResponse.json(
        { message: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      )
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
export async function requireRole(allowedRoles: Rol[]) {
  const auth = await requireAuth()

  if (!auth.authorized) {
    return auth
  }

  if (!allowedRoles.includes(auth.user.rol as Rol)) {
    return {
      authorized: false as const,
      error: NextResponse.json(
        { message: 'No tienes permisos para realizar esta acción.' },
        { status: 403 }
      )
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
export async function requireAdmin() {
  return requireRole([Rol.ADMIN])
}

/**
 * Verifica si el usuario es profesor o admin
 */
export async function requireProfesorOrAdmin() {
  return requireRole([Rol.ADMIN, Rol.PROFESOR])
}
