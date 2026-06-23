import { randomUUID } from 'crypto'

import { getConfigs } from '@/utils/libs/config'
import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { sendMail } from '@/utils/libs/mailer'
import { getOrderConfirmationTemplate } from '@/utils/libs/email-templates'
import { completeOrder } from '@/utils/libs/order-service'

/**
 * POST /api/checkout
 * Genera un pedido que puede contener cursos, ebooks o ambos.
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const {
      cursoIds = [],
      ebookIds = [],
      codigoCupon,
      gateway = 'IZIPAY',
      metodoPagoManualId,
      tipoComprobante,
      numeroComprobante
    } = await request.json()

    const hasCursos = Array.isArray(cursoIds) && cursoIds.length > 0
    const hasEbooks = Array.isArray(ebookIds) && ebookIds.length > 0

    if (!hasCursos && !hasEbooks) {
      return ApiResponse.error(request, 'Se requiere al menos un artículo en el carrito', 400)
    }

    // 1. Obtener cursos/ebooks y verificar accesos/inscripciones existentes en paralelo
    const [cursos, ebooks, inscripcionesExistentes, accesosExistentes] = await Promise.all([
      hasCursos
        ? prisma.curso.findMany({ where: { id: { in: cursoIds } } })
        : Promise.resolve([]),
      hasEbooks
        ? prisma.ebook.findMany({ where: { id: { in: ebookIds }, estado: 'PUBLICADO', es_gratis: false } })
        : Promise.resolve([]),
      hasCursos
        ? prisma.inscripcion.findMany({ where: { usuario_id: auth.user.id, curso_id: { in: cursoIds } } })
        : Promise.resolve([]),
      hasEbooks
        ? prisma.ebookAcceso.findMany({ where: { usuario_id: auth.user.id, ebook_id: { in: ebookIds } } })
        : Promise.resolve([]),
    ])

    if (hasCursos && cursos.length === 0) {
      return ApiResponse.error(request, 'No se encontraron los cursos seleccionados', 404)
    }

    if (hasEbooks && ebooks.length === 0) {
      return ApiResponse.error(request, 'No se encontraron los ebooks seleccionados', 404)
    }

    if (inscripcionesExistentes.length > 0) {
      const titulos = inscripcionesExistentes
        .map(i => cursos.find(c => c.id === i.curso_id)?.titulo)
        .join(', ')

      return ApiResponse.error(request, `Ya estás inscrito en: ${titulos}`, 400)
    }

    if (accesosExistentes.length > 0) {
      const titulos = accesosExistentes
        .map(a => ebooks.find(e => e.id === a.ebook_id)?.titulo)
        .join(', ')

      return ApiResponse.error(request, `Ya tienes acceso a: ${titulos}`, 400)
    }

    // 2. Calcular totales
    const subtotalCursos = cursos.reduce((acc, c) => acc + Number(c.precio), 0)
    const subtotalEbooks = ebooks.reduce((acc, e) => acc + Number(e.precio), 0)
    const subtotal = subtotalCursos + subtotalEbooks
    let total = subtotal
    let cuponId = null
    let descuentoTotal = 0

    // 2.1. Aplicar cupón (solo aplica a cursos)
    if (codigoCupon && hasCursos) {
      const cupon = await prisma.cupon.findUnique({
        where: { codigo: codigoCupon.toUpperCase(), esta_activo: true },
        include: { cursos: { select: { curso_id: true } } }
      })

      if (cupon) {
        const ahora = new Date()

        ahora.setHours(0, 0, 0, 0)

        const fechaExpiracion = cupon.fecha_expiracion ? new Date(cupon.fecha_expiracion) : null

        if (fechaExpiracion) fechaExpiracion.setHours(0, 0, 0, 0)

        const expirado = fechaExpiracion && fechaExpiracion < ahora
        const limiteAlcanzado = cupon.limite_uso !== null && cupon.usos_actuales >= cupon.limite_uso
        const cursosPermitidos = cupon.cursos.map(c => c.curso_id)
        const tieneRestriccion = cursosPermitidos.length > 0

        const cubreTodasLosCursos = tieneRestriccion
          ? cursoIds.every((id: string) => cursosPermitidos.includes(id))
          : true

        if (!expirado && !limiteAlcanzado && cubreTodasLosCursos) {
          cuponId = cupon.id

          if (cupon.tipo === 'PORCENTAJE') {
            descuentoTotal = subtotalCursos * (Number(cupon.valor) / 100)
          } else if (cupon.tipo === 'MONTO_FIJO') {
            descuentoTotal = Number(cupon.valor)
          }

          if (descuentoTotal > subtotalCursos) descuentoTotal = subtotalCursos
          total = subtotal - descuentoTotal
        }
      }
    }

    const moneda = (cursos[0] || ebooks[0])?.moneda || 'PEN'

    // 3. Crear el pedido con detalles de cursos (Prisma ORM)
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        cupon_id: cuponId,
        total,
        moneda,
        estado: 'PENDIENTE',
        tipo_comprobante: tipoComprobante,
        numero_comprobante: numeroComprobante,
        ...(gateway === 'MANUAL' && metodoPagoManualId ? { metodo_pago_manual_id: metodoPagoManualId } : {}),
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
      include: { detalles: { include: { curso: { select: { titulo: true, precio: true } } } } }
    })

    // 3.1. Añadir detalles de ebooks via raw SQL (Prisma client no tiene ebook_id todavía)
    for (const ebook of ebooks) {
      const id = randomUUID()
      const precioEbook = Number(ebook.precio)

      await prisma.$executeRaw`
        INSERT INTO detalles_pedido (id, tipo_item, cantidad, precio_unitario, descuento, subtotal, total, pedido_id, ebook_id)
        VALUES (${id}, 'EBOOK', 1, ${precioEbook}, 0, ${precioEbook}, ${precioEbook}, ${pedido.id}, ${ebook.id})
      `
    }

    // 4. Construir lista de items para email (cursos + ebooks)
    const emailItems = [
      ...pedido.detalles.filter(d => d.curso != null).map(d => ({ titulo: d.curso!.titulo, precio: Number(d.total) })),
      ...ebooks.map(e => ({ titulo: e.titulo, precio: Number(e.precio) }))
    ]

    // 5. Enviar correo de confirmación
    try {
      const configs = await getConfigs()
      const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

      const emailHtml = getOrderConfirmationTemplate({
        platformName,
        customerName: auth.user.nombre || auth.user.name || 'Estudiante',
        orderNumber: pedido.numero_pedido,
        date: new Date().toLocaleDateString('es-PE'),
        total: Number(pedido.total),
        moneda: pedido.moneda,
        metodoPago: gateway === 'MANUAL' ? 'Transferencia Manual' : gateway,
        cursos: emailItems,
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
      console.error('[Checkout-Mail] Error al enviar correo:', mailError)
    }

    // 6. Si total = 0, completar automáticamente
    if (total === 0) {
      await completeOrder(pedido.id, {
        metodo_pago: 'OTRO',
        respuesta_pago: { origen: 'cupon_100_pct', cupon_id: cuponId }
      })

      return ApiResponse.success(
        request,
        {
          message: '¡Acceso gratuito completado! Ya tienes acceso al contenido.',
          pedidoId: pedido.id,
          gratuito: true
        },
        201
      )
    }

    // 7. Pago manual
    if (gateway === 'MANUAL') {
      return ApiResponse.success(
        request,
        {
          message: 'Pedido creado. Sube tu comprobante de pago.',
          pedidoId: pedido.id,
          numeroPedido: pedido.numero_pedido,
          total: pedido.total,
          moneda: pedido.moneda,
          cursos: [
            ...pedido.detalles.filter(d => d.curso != null).map(d => d.curso!.titulo),
            ...ebooks.map(e => e.titulo)
          ]
        },
        201
      )
    }

    const transactionId = String(Date.now())
    const orderNumber = String(pedido.numero_pedido).padStart(10, '0')

    // 8. Izipay
    if (gateway === 'IZIPAY') {
      const configs = await getConfigs()
      const merchantCode = configs.IZIPAY_MERCHANT_CODE
      const apiKey = configs.IZIPAY_API_KEY
      const endpoint = configs.IZIPAY_ENDPOINT
      const rsaKey = configs.IZIPAY_RSA_KEY

      if (!merchantCode || !apiKey || !endpoint || !rsaKey) {
        return ApiResponse.error(request, 'La pasarela Izipay no está configurada correctamente', 500)
      }

      const tokenResponse = await fetch(`${endpoint}/security/v1/Token/Generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          transactionId: transactionId
        },
        body: JSON.stringify({
          requestSource: 'ECOMMERCE',
          merchantCode,
          orderNumber,
          publicKey: apiKey,
          amount: String(Number(total).toFixed(2)),
          currency: moneda
        })
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok || tokenData.code !== '00') {
        console.error('Izipay Token Error:', tokenData)

        return ApiResponse.error(request, 'Error al obtener el token de sesión de Izipay', 500)
      }

      const actualToken = tokenData.response?.token || tokenData.response

      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { token_pago: String(actualToken) }
      })

      const userName = auth.user.nombre || auth.user.name || 'Cliente'
      const firstName = userName.split(' ')[0]
      const lastName = userName.split(' ').slice(1).join(' ') || 'Cliente'
      const documentStr = auth.user.numero_documento || '12345678'
      const validDocument = documentStr.length >= 8 ? documentStr.substring(0, 15) : '12345678'

      const iziConfig = {
        transactionId,
        action: 'pay',
        merchantCode,
        order: {
          orderNumber,
          currency: moneda,
          amount: String(Number(total).toFixed(2)),
          payMethod: 'all',
          processType: 'AT',
          merchantBuyerId: String(auth.user.id).substring(0, 15),
          dateTimeTransaction: String(Date.now())
        },
        billing: {
          firstName,
          lastName,
          email: auth.user.email || 'cliente@email.com',
          phoneNumber: '999999999',
          street: 'Av. Default 123',
          city: 'Lima',
          state: 'Lima',
          country: 'PE',
          postalCode: '15000',
          documentType: 'DNI',
          document: validDocument
        },
        render: { typeForm: 'pop-up' }
      }

      return ApiResponse.success(
        request,
        {
          message: 'Pasarela preparada correctamente',
          iziConfig,
          token: String(actualToken),
          keyRSA: rsaKey,
          pedidoId: pedido.id
        },
        201
      )
    }

    // 9. Culqi
    if (gateway === 'CULQI') {
      const configs = await getConfigs()
      const privateKey = configs.CULQI_PRIVATE_KEY

      if (!privateKey || privateKey.includes('placeholder')) {
        return ApiResponse.error(request, 'La pasarela Culqi no está configurada correctamente', 500)
      }

      const expirationDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60

      const culqiOrderResponse = await fetch('https://api.culqi.com/v2/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${privateKey}`
        },
        body: JSON.stringify({
          amount: Math.round(Number(total) * 100),
          currency_code: moneda,
          description: `Pedido #${pedido.numero_pedido} - Aula Virtual`,
          order_number: `ORD-${pedido.numero_pedido}-${Date.now()}`,
          client_details: {
            first_name: auth.user.nombre?.split(' ')[0] || auth.user.name?.split(' ')[0] || 'User',
            last_name:
              auth.user.nombre?.split(' ').slice(1).join(' ') ||
              auth.user.apellido ||
              auth.user.name?.split(' ').slice(1).join(' ') ||
              'User',
            email: auth.user.email || '',
            phone_number: '999999999'
          },
          expiration_date: expirationDate
        })
      })

      const culqiOrderData = await culqiOrderResponse.json()

      if (!culqiOrderResponse.ok) {
        console.error('[CULQI_ORDER_ERROR]', culqiOrderData)

        return ApiResponse.error(request, culqiOrderData.user_message || 'Error al crear la orden en Culqi', 500)
      }

      return ApiResponse.success(
        request,
        {
          message: 'Orden de Culqi creada',
          pedidoId: pedido.id,
          culqiOrderId: culqiOrderData.id,
          publicKey: configs.CULQI_PUBLIC_KEY,
          rsaId: configs.CULQI_RSA_ID,
          rsaPublicKey: configs.CULQI_RSA_PUBLIC_KEY
        },
        201
      )
    }

    // 10. Mercado Pago
    if (gateway === 'MERCADOPAGO') {
      const configs = await getConfigs()
      const accessToken = configs.MP_ACCESS_TOKEN

      if (!accessToken) {
        return ApiResponse.error(request, 'La pasarela Mercado Pago no está configurada', 500)
      }

      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.APP_URL ||
        new URL(request.url).origin
      ).replace(/\/$/, '')

      const mpItems = [
        ...pedido.detalles.map((d: any) => ({
          id: d.curso_id,
          title: d.curso.titulo,
          quantity: 1,
          unit_price: Number(d.total),
          currency_id: moneda
        })),
        ...ebooks.map(e => ({
          id: e.id,
          title: e.titulo,
          quantity: 1,
          unit_price: Number(e.precio),
          currency_id: moneda
        }))
      ]

      const preference: Record<string, any> = {
        external_reference: pedido.id,
        items: mpItems,
        back_urls: {
          success: `${appUrl}/checkout/mercadopago/success?pedidoId=${pedido.id}`,
          failure: `${appUrl}/checkout/mercadopago/failure?pedidoId=${pedido.id}`,
          pending: `${appUrl}/checkout/mercadopago/pending?pedidoId=${pedido.id}`
        },
        ...(appUrl.startsWith('https://') ? { auto_return: 'approved' } : {}),
        notification_url: `${appUrl}/api/mercadopago/webhook`
      }

      const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(preference)
      })

      if (!mpResponse.ok) {
        console.error('[MP_CHECKOUT] Error:', await mpResponse.text())

        return ApiResponse.error(request, 'Error al crear la preferencia de Mercado Pago', 500)
      }

      const mpData = await mpResponse.json()

      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { token_pago: mpData.id, metodo_pago: 'MERCADOPAGO' }
      })

      return ApiResponse.success(
        request,
        {
          message: 'Preferencia de Mercado Pago creada',
          pedidoId: pedido.id,
          mpInitPoint: mpData.init_point,
          mpSandboxInitPoint: mpData.sandbox_init_point,
          preferenceId: mpData.id
        },
        201
      )
    }

    return ApiResponse.success(
      request,
      { message: 'Pedido creado correctamente', pedidoId: pedido.id },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
