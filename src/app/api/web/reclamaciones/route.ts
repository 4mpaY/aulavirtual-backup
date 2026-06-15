import prisma from '@/utils/libs/prisma'
import { ReclamacionSchema } from '@/schemas/reclamacion.schema'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { sendMail } from '@/utils/libs/mailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar Payload
    const validacion = ReclamacionSchema.safeParse(body)

    if (!validacion.success) {
      return ApiResponse.validationError(request, validacion.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const data = validacion.data
    const montoReclamadoDecimal = parseFloat(String(data.monto_reclamado))

    if (isNaN(montoReclamadoDecimal) || montoReclamadoDecimal < 0) {
      return ApiResponse.error(request, 'El monto reclamado no es válido', 400)
    }

    // 1. Guardar en Base de Datos (Genera automáticamente código correlativo)
    const nuevaReclamacion = await prisma.reclamacion.create({
      data: {
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        nombre: data.nombre,
        domicilio: data.domicilio,
        telefono: data.telefono,
        email: data.email,
        nombre_apoderado: data.nombre_apoderado || null,
        bien_contratado_tipo: data.bien_contratado_tipo,
        moneda: data.moneda,
        monto_reclamado: montoReclamadoDecimal,
        descripcion_bien: data.descripcion_bien,
        tipo_reclamacion: data.tipo_reclamacion,
        detalle: data.detalle,
        pedido: data.pedido
      }
    })

    // 2. Armar y despachar el correo
    const currentYear = new Date().getFullYear()
    const codigoReclamo = `REC-${currentYear}-${String(nuevaReclamacion.numero_correlativo).padStart(6, '0')}`
    const simboloMoneda = data.moneda === 'USD' ? '$' : 'S/'

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="background-color: #02115C; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
          <h2 style="color: white; margin: 0;">Copia de ${data.tipo_reclamacion} - Libro Virtual</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hola <strong>${data.nombre}</strong>,</p>
          <p>Hemos recibido tu ${data.tipo_reclamacion.toLowerCase()} de forma exitosa. Tu código de seguimiento oficial es:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="background-color: #f3f4f6; color: #02115C; padding: 10px 20px; font-size: 20px; font-weight: bold; border-radius: 4px; letter-spacing: 2px;">
              ${codigoReclamo}
            </span>
          </div>
          <p>Un resumen de tu caso:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Documento:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.tipo_documento} - ${data.numero_documento}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Bien o Servicio:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.bien_contratado_tipo} (${data.descripcion_bien})</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Monto:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${simboloMoneda} ${montoReclamadoDecimal.toFixed(2)}</td>
            </tr>
          </table>
          <div style="background-color: #f9fafb; padding: 15px; margin-top: 20px; border-left: 4px solid #DF143C;">
            <h4 style="margin-top: 0; color: #333;">Detalle:</h4>
            <p style="color: #555; font-size: 14px; white-space: pre-wrap;">${data.detalle}</p>
            <h4 style="margin-top: 15px; color: #333;">Pedido:</h4>
            <p style="color: #555; font-size: 14px; white-space: pre-wrap;">${data.pedido}</p>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: justify;">
            <strong>Importante:</strong> Nuestro equipo dará respuesta a tu solicitud en un plazo no mayor a 15 días hábiles, conforme a lo establecido en la normativa vigente de protección y defensa del consumidor. Este correo electrónico es una constancia automática de recepción, por favor no respondas a este mensaje.
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 6px 6px; font-size: 12px; color: #888;">
          Abeja Smart - ebeecorp@gmail.com
        </div>
      </div>
    `

    // Enviar correo al cliente
    await sendMail({
      to: data.email,
      subject: `[${codigoReclamo}] Confirmación de tu ${data.tipo_reclamacion.toLowerCase()}`,
      html: htmlContent
    })

    // Retornamos el éxito con el código autogenerado
    return ApiResponse.success(request, {
      mensaje: 'Reclamación registrada exitosamente',
      codigo: codigoReclamo
    })
  } catch (error) {
    console.error('Error en API Libro de Reclamaciones:', error)

    return ApiResponse.error(request, 'Ocurrió un error inesperado al registrar la reclamación', 500)
  }
}
