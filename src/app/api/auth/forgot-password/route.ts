import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import { sendMail } from '@/utils/libs/mailer'
import { getConfigs } from '@/utils/libs/config'

/**
 * POST /api/auth/forgot-password
 * Solicita un código OTP para recuperar la contraseña
 */
export async function POST(request: Request) {
  try {
    const { correo } = await request.json()

    if (!correo) {
      return ApiResponse.error(request, 'El correo es obligatorio', 400)
    }

    // 1. Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    })

    // 🛡️ SEGURIDAD: Por seguridad, no revelamos si el correo existe o no
    // Pero internamente solo enviamos el correo si existe.
    if (!usuario) {
      console.log(`[Forgot-Password] Intento de recuperación para correo no registrado: ${correo}`)
      
      return ApiResponse.success(request, { message: 'Si el correo está registrado, recibirás un código de recuperación.' })
    }

    // 2. Generar código OTP de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expira_en = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    // 3. Guardar en DB (Anulamos códigos anteriores para el mismo correo)
    await prisma.passwordReset.updateMany({
      where: { correo, usado: false },
      data: { usado: true }
    })

    await prisma.passwordReset.create({
      data: {
        correo,
        codigo,
        expira_en
      }
    })

    console.log(`[Forgot-Password] Registro PasswordReset creado para: ${correo}. Código: ${codigo}`)

    // 4. Enviar correo con OTP
    const configs = await getConfigs()
    const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #131FF2;">Recuperación de Contraseña</h2>
        <p>Hola, <strong>${usuario.nombre}</strong>.</p>
        <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de verificación (OTP) para continuar:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #131FF2; background: #f0f0f0; padding: 10px 20px; border-radius: 5px;">
                ${codigo}
            </span>
        </div>
        
        <p style="font-size: 14px; color: #666;">Este código expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} ${platformName}</p>
      </div>
    `

    const mailSent = await sendMail({
      to: correo,
      subject: `Código de recuperación: ${codigo} - ${platformName}`,
      html: emailHtml
    })

    if (mailSent) {
      console.log(`[Forgot-Password] ✅ OTP enviado con éxito a ${correo}`)
    } else {
      console.error(`[Forgot-Password] ❌ No se pudo enviar el correo a ${correo}. Revisa los logs del Mailer.`)
    }

    return ApiResponse.success(request, { message: 'Si el correo está registrado, recibirás un código de recuperación.' })
  } catch (error) {
    console.error('[Forgot-Password] Error inesperado en el flujo:', error)
    
    return handleApiError(error, request)
  }
}
