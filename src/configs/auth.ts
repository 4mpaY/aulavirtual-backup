import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/libs/prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/schemas/auth.schema'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        correo: { label: 'Correo', type: 'email' },
        contrasena: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validar credenciales
          const validacion = loginSchema.safeParse(credentials)

          if (!validacion.success) {
            return null
          }

          const { correo, contrasena } = validacion.data

          // Buscar usuario
          const usuario = await prisma.usuario.findUnique({
            where: { correo }
          })

          if (!usuario) {
            return null
          }

          // Verificar si está activo
          if (!usuario.esta_activo) {
            throw new Error('Tu cuenta ha sido desactivada')
          }

          // Verificar contraseña
          const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)

          if (!contrasenaValida) {
            return null
          }

          // Retornar usuario
          return {
            id: usuario.id,
            email: usuario.correo,
            name: `${usuario.nombre} ${usuario.apellido}`,
            rol: usuario.rol,
            avatar: usuario.avatar,
            numero_documento: usuario.numero_documento,
            esta_activo: usuario.esta_activo
          } as User
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },

  pages: {
    signIn: '/login',
    error: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
        token.avatar = user.avatar
        token.numero_documento = user.numero_documento
        token.esta_activo = user.esta_activo
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as string
        session.user.avatar = token.avatar as string | null
        session.user.numero_documento = token.numero_documento as string
        session.user.esta_activo = token.esta_activo as boolean
      }
      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,

  debug: process.env.NODE_ENV === 'development'
}

// Tipos extendidos para NextAuth
declare module 'next-auth' {
  interface User {
    id: string
    rol?: string
    avatar?: string | null
    numero_documento?: string
    esta_activo?: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      rol: string
      avatar?: string | null
      numero_documento: string
      esta_activo: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    rol?: string
    avatar?: string | null
    numero_documento?: string
    esta_activo?: boolean
  }
}
