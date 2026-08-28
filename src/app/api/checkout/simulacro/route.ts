import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getConfigs } from '@/utils/libs/config'

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const {
      simulacroId,
      gateway = 'CULQI',
      metodoPagoManualId,
      tipoComprobante,
      numeroComprobante
    } = await request.json()

    if (!simulacroId) {
      return ApiResponse.error(request, 'Se requiere el ID del simulacro', 400)
    }

    // 1. Obtener simulacro y verificar inscripción existente
    const simulacro = await prisma.simulacro.findUnique({
      where: { id: simulacroId },
      select: { id: true, titulo: true, precio: true, moneda: true, es_gratis: true, estado: true }
    })

    if (!simulacro) {
      return ApiResponse.error(request, 'Simulacro no encontrado', 404)
    }

    if (simulacro.estado !== 'PUBLICADO') {
      return ApiResponse.error(request, 'El simulacro no está disponible', 400)
    }

    if (simulacro.es_gratis || Number(simulacro.precio) === 0) {
      return ApiResponse.error(request, 'Este simulacro es gratuito', 400)
    }

    // Verificar inscripción existente
    const inscExistente = await prisma.inscripcionSimulacro.findFirst({
      where: {
        usuario_id: auth.user.id,
        simulacro_id: simulacroId,
        estado: 'ACTIVO'
      },
      select: { id: true }
    })

    if (inscExistente) {
      return ApiResponse.error(request, 'Ya tienes acceso a este simulacro', 400)
    }

    const total = Number(simulacro.precio)
    const moneda: string = simulacro.moneda || 'PEN'

    // 2. Crear pedido con su detalle
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        total,
        moneda,
        estado: 'PENDIENTE',
        tipo_comprobante: tipoComprobante,
        numero_comprobante: numeroComprobante,
        ...(gateway === 'MANUAL' && metodoPagoManualId ? { metodo_pago_manual_id: metodoPagoManualId } : {}),
        detalles: {
          create: {
            simulacro_id: simulacroId,
            precio_unitario: simulacro.precio,
            descuento: 0,
            subtotal: simulacro.precio,
            total: simulacro.precio,
            cantidad: 1
          }
        }
      }
    })

    // 3. Gateway MANUAL
    if (gateway === 'MANUAL') {
      return ApiResponse.success(request, {
        message: 'Pedido creado. Sube tu comprobante de pago.',
        pedidoId: pedido.id,
        numeroPedido: pedido.numero_pedido,
        total: pedido.total,
        moneda: pedido.moneda,
        items: [simulacro.titulo]
      }, 201)
    }

    // 4. Culqi
    if (gateway === 'CULQI') {
      const configs = await getConfigs()
      const privateKey = configs.CULQI_PRIVATE_KEY

      if (!privateKey || privateKey.includes('placeholder')) {
        return ApiResponse.error(request, 'La pasarela Culqi no está configurada', 500)
      }

      const expirationDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60

      const culqiRes = await fetch('https://api.culqi.com/v2/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${privateKey}` },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency_code: moneda,
          description: `Simulacro: ${simulacro.titulo}`,
          order_number: `SIM-${pedido.numero_pedido}-${Date.now()}`,
          client_details: {
            first_name: auth.user.nombre?.split(' ')[0] || auth.user.name?.split(' ')[0] || 'User',
            last_name: auth.user.nombre?.split(' ').slice(1).join(' ') || auth.user.apellido || 'User',
            email: auth.user.email || '',
            phone_number: '999999999'
          },
          expiration_date: expirationDate
        })
      })

      const culqiData = await culqiRes.json()

      if (!culqiRes.ok) {
        console.error('[CULQI_SIM_ORDER]', culqiData)

        return ApiResponse.error(request, culqiData.user_message || 'Error al crear la orden en Culqi', 500)
      }

      return ApiResponse.success(request, {
        message: 'Orden Culqi creada',
        pedidoId: pedido.id,
        culqiOrderId: culqiData.id,
        publicKey: configs.CULQI_PUBLIC_KEY,
        rsaId: configs.CULQI_RSA_ID,
        rsaPublicKey: configs.CULQI_RSA_PUBLIC_KEY
      }, 201)
    }

    // 5. Izipay (Lyra / MiCuentaWeb - Charge/CreatePaymentOrder)
    if (gateway === 'IZIPAY') {
      const configs = await getConfigs()
      const { IZIPAY_ENDPOINT: endpoint, IZIPAY_REST_USER: restUser, IZIPAY_REST_PASSWORD: restPassword } = configs

      if (!endpoint || !restUser || !restPassword) {
        return ApiResponse.error(request, 'Izipay no está configurado', 500)
      }

      // IMPORTANTE: `request.url` en Next.js standalone (Docker) se construye con las
      // variables HOSTNAME/PORT del propio proceso (ej. "0.0.0.0:3000"), no con el Host
      // real del cliente detrás de nginx. Los headers x-forwarded-* sí reflejan el host
      // público real (confirmado con tráfico real de Izipay), así que se leen directo.
      const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

      const appUrl = (
        (forwardedHost ? `${forwardedProto}://${forwardedHost}` : '') ||
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        ''
      ).replace(/\/$/, '')

      const returnUrl = `${appUrl}/api/izipay/return?pedidoId=${pedido.id}`
      const basicAuth = 'Basic ' + Buffer.from(`${restUser}:${restPassword}`).toString('base64')
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString()

      const orderPayload = {
        amount: Math.round(total * 100),
        currency: moneda,
        orderId: pedido.id,
        expirationDate,
        returnMode: 'POST',
        successUrl: returnUrl,
        cancelUrl: returnUrl,
        channelOptions: { channelType: 'URL' },
        customer: { email: auth.user.email || undefined }
      }

      const orderResponse = await fetch(`${endpoint}/api-payment/V4/Charge/CreatePaymentOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: basicAuth },
        body: JSON.stringify(orderPayload)
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || orderData.status !== 'SUCCESS') {
        console.error('[IZIPAY_SIM] Error creando orden de pago:', orderData)

        return ApiResponse.error(request, 'Error al iniciar el pago con Izipay', 500)
      }

      const paymentURL = orderData.answer.paymentURL

      await prisma.pedido.update({ where: { id: pedido.id }, data: { url_pago: paymentURL } })

      return ApiResponse.success(request, {
        message: 'Pasarela Izipay preparada',
        paymentURL,
        pedidoId: pedido.id
      }, 201)
    }

    // 6. MercadoPago
    if (gateway === 'MERCADOPAGO') {
      const configs = await getConfigs()
      const accessToken = configs.MP_ACCESS_TOKEN

      if (!accessToken) {
        return ApiResponse.error(request, 'Mercado Pago no está configurado', 500)
      }

      const appUrl = new URL(request.url).origin

      const preference = {
        external_reference: pedido.id,
        items: [{ id: simulacroId, title: simulacro.titulo, quantity: 1, unit_price: total, currency_id: moneda }],
        back_urls: {
          success: `${appUrl}/checkout/mercadopago/success?pedidoId=${pedido.id}`,
          failure: `${appUrl}/checkout/mercadopago/failure?pedidoId=${pedido.id}`,
          pending: `${appUrl}/checkout/mercadopago/pending?pedidoId=${pedido.id}`
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/mercadopago/webhook`
      }

      const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(preference)
      })

      if (!mpRes.ok) {
        return ApiResponse.error(request, 'Error al crear preferencia de Mercado Pago', 500)
      }

      const mpData = await mpRes.json()

      await prisma.pedido.update({ where: { id: pedido.id }, data: { token_pago: mpData.id, metodo_pago: 'MERCADOPAGO' } })

      return ApiResponse.success(request, {
        pedidoId: pedido.id,
        mpInitPoint: mpData.init_point,
        mpSandboxInitPoint: mpData.sandbox_init_point,
        preferenceId: mpData.id
      }, 201)
    }

    return ApiResponse.success(request, { pedidoId: pedido.id }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
