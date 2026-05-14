import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { registerSchema } from '@/schemas/auth.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { authLimiter } from '@/utils/libs/rate-limit'
import { sendMail } from '@/utils/libs/mailer'
import { getConfigs } from '@/utils/libs/config'

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function POST(request: Request) {
  try {
    // 🔐 SEGURIDAD: Rate limiting — máximo 10 intentos por minuto por IP
    const rateLimit = authLimiter(request)

    if (!rateLimit.success) {
      return ApiResponse.error(request, 'Demasiados intentos. Por favor espera un momento e inténtalo de nuevo.', 429)
    }

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

    // Generar slug
    let baseSlug = `${nombre}-${apellido}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!baseSlug) baseSlug = 'usuario';
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.usuario.findUnique({ where: { slug } })) {
      const randomHash = Math.random().toString(36).substring(2, 6);

      slug = `${baseSlug}-${randomHash}-${counter}`;
      counter++;
    }

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        correo,
        contrasena: hashedPassword,
        nombre,
        apellido,
        numero_documento,
        celular: celular || null,
        slug,
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
        to: correo,
        subject: `Tus credenciales de acceso - ${platformName}`,
        html: emailHtml
      })
    } catch (mailError) {
      console.error('[Register] Error al enviar el correo de bienvenida:', mailError)
    }

    return ApiResponse.success(request, { usuario: nuevoUsuario }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
