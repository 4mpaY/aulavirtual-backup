export const dynamic = 'force-dynamic'

import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { sendMail } from '@/utils/libs/mailer'
import { getConfigs } from '@/utils/libs/config'

const MAX_BULK = 500

function generateSlug(nombre: string, apellido: string): string {
  return `${nombre}-${apellido}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'usuario'
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos para realizar esta acción', 403)
    }

    const { usuarios } = await request.json()

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return ApiResponse.error(request, 'Se requiere un array de usuarios', 400)
    }

    if (usuarios.length > MAX_BULK) {
      return ApiResponse.error(request, `No se pueden importar más de ${MAX_BULK} usuarios a la vez`, 400)
    }

    const exitosos: number[] = []
    const errores: { fila: number; correo: string; mensaje: string }[] = []

    for (let i = 0; i < usuarios.length; i++) {
      const fila = i + 2 // fila 1 = cabecera, datos empiezan en fila 2
      const u = usuarios[i]

      try {
        const { nombre, apellido, correo, contrasena, numero_documento, celular, rol } = u

        if (!nombre || !apellido || !correo || !contrasena || !numero_documento) {
          errores.push({ fila, correo: correo || '', mensaje: 'Faltan campos requeridos' })
          continue
        }

        const hashedPassword = await bcrypt.hash(String(contrasena), 10)

        const baseSlug = generateSlug(String(nombre), String(apellido))
        let slug = baseSlug
        let counter = 1

        while (await prisma.usuario.findUnique({ where: { slug } })) {
          const randomHash = Math.random().toString(36).substring(2, 6)

          slug = `${baseSlug}-${randomHash}-${counter}`
          counter++
        }

        await prisma.usuario.create({
          data: {
            correo: String(correo).toLowerCase().trim(),
            contrasena: hashedPassword,
            nombre: String(nombre).trim(),
            apellido: String(apellido).trim(),
            numero_documento: String(numero_documento).trim(),
            celular: celular ? String(celular).trim() : null,
            rol: (['ADMIN', 'PROFESOR', 'ESTUDIANTE'].includes(String(rol).toUpperCase())
              ? String(rol).toUpperCase()
              : 'ESTUDIANTE') as any,
            slug
          }
        })

        // 📧 Enviar correo de bienvenida con credenciales
        try {
          const configs = await getConfigs()
          const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
          
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #25927F;">¡Bienvenido a ${platformName}!</h2>
              <p>Hola, <strong>${nombre}</strong>.</p>
              <p>Tu cuenta ha sido creada exitosamente. A continuación, te proporcionamos tus credenciales de acceso:</p>
              
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #25927F;">
                <p style="margin: 5px 0;"><strong>Usuario:</strong> ${correo}</p>
                <p style="margin: 5px 0;"><strong>Contraseña:</strong> ${contrasena}</p>
              </div>
              
              <p>Te recomendamos cambiar tu contraseña una vez que hayas iniciado sesión por primera vez.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/login" style="background: #25927F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Iniciar Sesión
                </a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} ${platformName}</p>
            </div>
          `

          await sendMail({
            to: String(correo),
            subject: `Tus credenciales de acceso - ${platformName}`,
            html: emailHtml
          })
        } catch (mailError) {
          console.error(`[Bulk-UserCreate] Error al enviar correo a ${correo}:`, mailError)
        }

        exitosos.push(fila)
      } catch (err: any) {
        let mensaje = 'Error al crear el usuario'

        if (err?.code === 'P2002') {
          const field = err?.meta?.target?.[0]

          mensaje = field === 'correo' ? 'El correo ya está registrado' : 'El DNI ya está registrado'
        }

        errores.push({ fila, correo: u?.correo || '', mensaje })
      }
    }

    return ApiResponse.success(request, { exitosos: exitosos.length, errores })
  } catch (error) {
    return handleApiError(error, request)
  }
}
