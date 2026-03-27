import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { sendMail } from '@/utils/libs/mailer'
import { getBaseURL } from '@/utils/env'
import { generateOrderPDF } from './pdf-generator'

/**
 * Orquesta el envío del correo de confirmación de pedido y bienvenida.
 */
export async function sendOrderConfirmationEmail(pedidoId: string) {
  try {
    // 1. Obtener datos del pedido detallados
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        usuario: true,
        detalles: {
          include: {
            curso: {
              select: { titulo: true }
            }
          }
        }
      }
    })

    if (!pedido) {
      console.error(`[Order-Notifications] Pedido ${pedidoId} no encontrado para enviar mail.`)

      return
    }

    // 2. Obtener configuraciones básicas (Logo, Nombre sitio)
    const configs = await getConfigs()
    const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
    let platformLogo = configs.TEMPLATE_LOGO || ''

    // 🔐 SEGURIDAD: Convertir ruta relativa a absoluta para correos
    if (platformLogo && platformLogo.startsWith('/')) {
      const baseURL = getBaseURL().replace(/\/$/, '') // Quita slash final si existe

      platformLogo = `${baseURL}${platformLogo}`
    }

    // 3. Generar PDF adjunto
    const pdfBuffer = await generateOrderPDF(pedido)

    // 4. Construir contenido del correo
    const cursosComprados = pedido.detalles.map(d => d.curso.titulo).join(', ')

    const welcomeMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            ${platformLogo ? `<img src="${platformLogo}" alt="${platformName}" style="max-height: 50px;">` : `<h2>${platformName}</h2>`}
        </div>
        
        <h1 style="color: #131FF2; font-size: 24px;">¡Bienvenido a bordo, ${pedido.usuario.nombre}!</h1>
        
        <p>Estamos emocionados de que comiences tu aprendizaje con nosotros. Tu pedido <strong>#${String(pedido.numero_pedido).padStart(6, '0')}</strong> ha sido procesado con éxito.</p>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Cursos adquiridos:</p>
            <p style="margin: 5px 0;">${cursosComprados}</p>
        </div>
        
        <p>Adjunto a este correo encontrarás el <strong>Detalle de tu Compra</strong> en formato PDF.</p>
        
        <p>Ya puedes acceder a tus cursos iniciando sesión en tu panel de estudiante:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || '#'}" style="background-color: #131FF2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Acceder a mis cursos</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <footer style="font-size: 12px; color: #777; text-align: center;">
            <p>© ${new Date().getFullYear()} ${platformName}. Todos los derechos reservados.</p>
        </footer>
      </div>
    `

    // 5. Enviar Mail
    await sendMail({
      to: pedido.usuario.correo,
      subject: `¡Confirmación de Pedido #${String(pedido.numero_pedido).padStart(6, '0')} - ${platformName}!`,
      html: welcomeMessage,
      attachments: [
        {
          filename: `Detalle-Compra-${pedido.numero_pedido}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })

    console.log(`[Order-Notifications] Correo enviado exitosamente para pedido ${pedidoId}`)
  } catch (error) {
    console.error('[Order-Notifications] Error crítico enviando notificación:', error)
  }
}
