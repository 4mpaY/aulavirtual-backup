import { randomUUID } from 'crypto'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { createPaypalOrder } from '@/utils/libs/paypal-api'
import { sendMail } from '@/utils/libs/mailer'
import { getOrderConfirmationTemplate } from '@/utils/libs/email-templates'

/**
 * POST /api/paypal/create
 * Crea una orden de PayPal y un pedido en la base de datos
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { cursoIds = [], ebookIds = [], codigoCupon } = await request.json()

    const hasCursos = Array.isArray(cursoIds) && cursoIds.length > 0
    const hasEbooks = Array.isArray(ebookIds) && ebookIds.length > 0

    if (!hasCursos && !hasEbooks) {
      return ApiResponse.error(request, 'Se requiere al menos un artículo en el carrito', 400)
    }

    // 1. Obtener cursos/ebooks y verificar inscripciones/accesos
    const [cursos, ebooks, inscripcionesExistentes, accesosExistentes] = await Promise.all([
      hasCursos ? prisma.curso.findMany({ where: { id: { in: cursoIds } } }) : Promise.resolve([]),
      hasEbooks ? prisma.ebook.findMany({ where: { id: { in: ebookIds }, estado: 'PUBLICADO', es_gratis: false } }) : Promise.resolve([]),
      hasCursos ? prisma.inscripcion.findMany({ where: { usuario_id: auth.user.id, curso_id: { in: cursoIds } } }) : Promise.resolve([]),
      hasEbooks ? prisma.ebookAcceso.findMany({ where: { usuario_id: auth.user.id, ebook_id: { in: ebookIds } } }) : Promise.resolve([]),
    ])

    if (hasCursos && cursos.length === 0) {
      return ApiResponse.error(request, 'No se encontraron los cursos seleccionados', 404)
    }

    if (inscripcionesExistentes.length > 0) {
      return ApiResponse.error(request, 'Ya estás inscrito en uno de los cursos seleccionados', 400)
    }

    if (accesosExistentes.length > 0) {
      return ApiResponse.error(request, 'Ya tienes acceso a uno de los ebooks seleccionados', 400)
    }

    // 2. Calcular total
    const subtotalCursos = cursos.reduce((acc, c) => acc + Number(c.precio), 0)
    const subtotalEbooks = ebooks.reduce((acc, e) => acc + Number(e.precio), 0)
    const subtotal = subtotalCursos + subtotalEbooks
    let total = subtotal
    let cuponId = null
    let descuentoTotal = 0

    if (codigoCupon) {
      const cupon = await prisma.cupon.findUnique({
        where: { codigo: codigoCupon.toUpperCase(), esta_activo: true }
      })

      if (cupon) {
        const ahora = new Date()

        ahora.setHours(0, 0, 0, 0)

        const fechaExpiracion = cupon.fecha_expiracion ? new Date(cupon.fecha_expiracion) : null

        if (fechaExpiracion) fechaExpiracion.setHours(0, 0, 0, 0)

        const expirado = fechaExpiracion && fechaExpiracion < ahora
        const limiteAlcanzado = cupon.limite_uso !== null && cupon.usos_actuales >= cupon.limite_uso

        if (!expirado && !limiteAlcanzado) {
          cuponId = cupon.id

          if (cupon.tipo === 'PORCENTAJE') {
            descuentoTotal = subtotal * (Number(cupon.valor) / 100)
          } else if (cupon.tipo === 'MONTO_FIJO') {
            descuentoTotal = Number(cupon.valor)
          }

          if (descuentoTotal > subtotal) descuentoTotal = subtotal
          total = subtotal - descuentoTotal
        }
      }
    }

    // 3. Lógica de Moneda para PayPal
    const monedaOriginal = (cursos[0] || ebooks[0])?.moneda || 'PEN'
    const monedaPaypal = 'USD'
    let totalUSD = total
    let exchangeRate = 1

    if (monedaOriginal === 'PEN') {
      // Conversión de Moneda para PayPal (Dinámica desde BD)
      const configs = await getConfigs()

      exchangeRate = Number(configs['PAYPAL_EXCHANGE_RATE']) || 3.8
      totalUSD = Number((total / exchangeRate).toFixed(2))
    }

    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        cupon_id: cuponId,
        total,
        moneda: monedaOriginal,
        estado: 'PENDIENTE',
        metodo_pago: 'PAYPAL',
        mensaje:
          monedaOriginal === 'PEN'
            ? `Monto convertido a PayPal: $${totalUSD} (TC: ${exchangeRate})`
            : `Pago procesado en USD directamente`,
        ...(hasCursos ? {
          detalles: {
            create: cursos.map(c => {
              const precioCurso = Number(c.precio)
              const proporcion = subtotalCursos > 0 ? precioCurso / subtotalCursos : 0
              const descuentoCurso = descuentoTotal * proporcion

              return {
                curso_id: c.id,
                precio_unitario: c.precio,
                descuento: descuentoCurso,
                subtotal: c.precio,
                total: precioCurso - descuentoCurso
              }
            })
          }
        } : {})
      },
      include: { detalles: { include: { curso: { select: { titulo: true } } } } }
    })

    // Añadir detalles de ebooks via raw SQL
    for (const ebook of ebooks) {
      const id = randomUUID()
      const precioEbook = Number(ebook.precio)

      await prisma.$executeRaw`
        INSERT INTO detalles_pedido (id, tipo_item, cantidad, precio_unitario, descuento, subtotal, total, pedido_id, ebook_id)
        VALUES (${id}, 'EBOOK', 1, ${precioEbook}, 0, ${precioEbook}, ${precioEbook}, ${pedido.id}, ${ebook.id})
      `
    }

    // 📧 Enviar correo de confirmación de pedido
    try {
      const configs = await getConfigs()
      const platformName = configs.TEMPLATE_NAME || 'Abeja Smart'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

      const emailHtml = getOrderConfirmationTemplate({
        platformName,
        customerName: auth.user.nombre || auth.user.name || 'Estudiante',
        orderNumber: pedido.numero_pedido,
        date: new Date().toLocaleDateString('es-PE'),
        total: Number(pedido.total),
        moneda: pedido.moneda,
        metodoPago: 'PayPal',
        cursos: [
          ...pedido.detalles.filter(d => d.curso != null).map(d => ({ titulo: d.curso!.titulo, precio: Number(d.total) })),
          ...ebooks.map(e => ({ titulo: e.titulo, precio: Number(e.precio) }))
        ],
        appUrl
      })

      if (auth.user.email) {
        await sendMail({
          to: auth.user.email,
          subject: `Confirmación de Pedido #${pedido.numero_pedido} - ${platformName}`,
          html: emailHtml
        })
      }
    } catch (mailError) {
      console.error('[Paypal-Create-Mail] Error al enviar correo de confirmación:', mailError)
    }

    // 5. Crear orden en PayPal usando el monto en USD
    const paypalOrder = await createPaypalOrder(totalUSD, monedaPaypal)

    // 6. Actualizar pedido con el token/id de paypal
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        transaccion_id: paypalOrder.id,
        token_pago: paypalOrder.id
      }
    })

    return ApiResponse.success(
      request,
      {
        paypalOrderId: paypalOrder.id,
        pedidoId: pedido.id
      },
      201
    )
  } catch (error) {
    console.error('[PAYPAL_CREATE_ERROR]', error)

    return handleApiError(error, request)
  }
}
