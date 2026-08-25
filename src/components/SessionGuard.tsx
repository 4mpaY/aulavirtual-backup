'use client'

import { useEffect, useRef } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { signOut, useSession } from 'next-auth/react'

/**
 * Rutas que requieren autenticación.
 * Si la sesión expira mientras el usuario está en una de estas rutas,
 * será redirigido a /login automáticamente.
 */
const PROTECTED_PREFIXES = ['/admin', '/profesor', '/estudiante', '/perfil', '/dashboard']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

/**
 * SessionGuard — Componente global que protege las rutas autenticadas.
 *
 * - Detecta cuando la sesión JWT ha expirado (status === 'unauthenticated')
 * - Detecta cuando la cuenta ha sido desactivada (esta_activo === false)
 * - Redirige al login con el mensaje apropiado
 *
 * Debe estar dentro de <NextAuthProvider> en el árbol de providers.
 */
export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isHandling = useRef(false)

  useEffect(() => {
    // Evitar múltiples ejecuciones simultáneas
    if (isHandling.current) return

    // Solo actuar cuando el estado de sesión está resuelto (no en 'loading')
    if (status === 'loading') return

    // Si la sesión expiró y está en una ruta protegida → redirigir a login
    if (status === 'unauthenticated' && isProtectedPath(pathname)) {
      isHandling.current = true

      signOut({ redirect: false }).then(() => {
        router.push('/login?expired=1')
      })

      return
    }

    // Si la sesión está activa pero la cuenta fue desactivada → forzar logout
    if (
      status === 'authenticated' &&
      session?.user &&
      (session.user as any).esta_activo === false
    ) {
      isHandling.current = true

      signOut({ redirect: false }).then(() => {
        router.push('/login?deactivated=1')
      })

      return
    }

    // Resetear la bandera cuando la sesión vuelve a estar activa
    if (status === 'authenticated') {
      isHandling.current = false
    }
  }, [status, session, pathname, router])

  return <>{children}</>
}
