import { createTransport } from 'nodemailer'

interface SendMailOptions {
  to: string
  subject: string
  html: string
  attachments?: {
    filename: string
    content: Buffer | string
    contentType?: string
  }[]
}

const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

/**
 * Función centralizada para enviar correos electrónicos usando Nodemailer.
 */
export const sendMail = async ({ to, subject, html, attachments }: SendMailOptions) => {
  try {
    if (!process.env.SMTP_USER) {
      console.warn(
        '⚠️ [Mailer] Las credenciales SMTP_USER / SMTP_PASS no están configuradas en .env. Omitiendo envío de correo real.'
      )

      return false
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Aula Virtual" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    }

    const info = await transporter.sendMail(mailOptions)

    console.log(`✅ [Mailer] Correo enviado a ${to}: ${info.messageId}`)

    return true
  } catch (error) {
    console.error('❌ [Mailer] Error al enviar el correo:', error)

    return false
  }
}
