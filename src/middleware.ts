import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Rol } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Si no hay token y está intentando acceder a rutas protegidas
    if (!token && !path.startsWith('/login') && !path.startsWith('/register')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Si tiene token y está intentando acceder a login/register
    if (token && (path.startsWith('/login') || path.startsWith('/register'))) {
      // Redirigir según rol
      const rol = token.rol as Rol

      if (rol === Rol.ADMIN) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }

      if (rol === Rol.PROFESOR) {
        return NextResponse.redirect(new URL('/profesor/dashboard', req.url))
      }

      return NextResponse.redirect(new URL('/estudiante/dashboard', req.url))
    }

    // Redirigir /dashboard genérico según rol
    if (path === '/dashboard') {
      const rol = token?.rol as Rol

      if (rol === Rol.ADMIN) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }

      if (rol === Rol.PROFESOR) {
        return NextResponse.redirect(new URL('/profesor/dashboard', req.url))
      }

      return NextResponse.redirect(new URL('/estudiante/dashboard', req.url))
    }

    // Verificar acceso a rutas según rol
    const rol = token?.rol as Rol

    // Rutas de admin - solo ADMIN
    if (path.startsWith('/admin') && rol !== Rol.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Rutas de profesor - solo PROFESOR o ADMIN
    if (path.startsWith('/profesor') && rol !== Rol.ADMIN && rol !== Rol.PROFESOR) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Rutas de estudiante - todos los autenticados pueden acceder
    // (pero podemos agregar restricciones si es necesario)

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Rutas públicas
        if (
          path.startsWith('/login') ||
          path.startsWith('/register') ||
          path.startsWith('/cursos') ||
          path.startsWith('/verificar-certificado') ||
          path === '/'
        ) {
          return true
        }

        // Rutas protegidas requieren token
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)'
  ]
}
