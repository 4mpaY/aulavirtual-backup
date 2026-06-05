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
    const simulacros: any[] = await prisma.$queryRaw`
      SELECT id, titulo, precio, moneda, es_gratis, estado FROM "Simulacro" WHERE id = ${simulacroId} LIMIT 1`

    if (simulacros.length === 0) {
      return ApiResponse.error(request, 'Simulacro no encontrado', 404)
    }

    const simulacro = simulacros[0]

    if (simulacro.estado !== 'PUBLICADO') {
      return ApiResponse.error(request, 'El simulacro no está disponible', 400)
    }

    if (simulacro.es_gratis || Number(simulacro.precio) === 0) {
      return ApiResponse.error(request, 'Este simulacro es gratuito', 400)
    }

    // Verificar inscripción existente
    const inscExistente: any[] = await prisma.$queryRaw`
      SELECT id FROM inscripciones_simulacro
      WHERE usuario_id = ${auth.user.id} AND simulacro_id = ${simulacroId} AND estado = 'ACTIVO'
      LIMIT 1`

    if (inscExistente.length > 0) {
      return ApiResponse.error(request, 'Ya tienes acceso a este simulacro', 400)
    }

    const total = Number(simulacro.precio)
    const moneda: string = simulacro.moneda || 'PEN'

    // 2. Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        total,
        moneda,
        estado: 'PENDIENTE',
        tipo_comprobante: tipoComprobante,
        numero_comprobante: numeroComprobante,
        ...(gateway === 'MANUAL' && metodoPagoManualId ? { metodo_pago_manual_id: metodoPagoManualId } : {}),
      }
    })

    // Insertar detalle con simulacro_id via raw (Prisma client no conoce esta columna aún)
    const { randomUUID } = await import('crypto')
    const detalleId = randomUUID()
    await prisma.$executeRaw`
      INSERT INTO detalles_pedido (id, pedido_id, simulacro_id, precio_unitario, descuento, subtotal, total, cantidad)
      VALUES (${detalleId}, ${pedido.id}, ${simulacroId}, ${simulacro.precio}, 0, ${simulacro.precio}, ${simulacro.precio}, 1)`

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

    // 5. Izipay
    if (gateway === 'IZIPAY') {
      const configs = await getConfigs()
      const { IZIPAY_MERCHANT_CODE: merchantCode, IZIPAY_API_KEY: apiKey, IZIPAY_ENDPOINT: endpoint, IZIPAY_RSA_KEY: rsaKey } = configs

      if (!merchantCode || !apiKey || !endpoint || !rsaKey) {
        return ApiResponse.error(request, 'Izipay no está configurado', 500)
      }

      const transactionId = String(Date.now())
      const orderNumber = String(pedido.numero_pedido).padStart(10, '0')

      const tokenRes = await fetch(`${endpoint}/security/v1/Token/Generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', transactionId },
        body: JSON.stringify({
          requestSource: 'ECOMMERCE',
          merchantCode,
          orderNumber,
          publicKey: apiKey,
          amount: String(total.toFixed(2)),
          currency: moneda
        })
      })

      const tokenData = await tokenRes.json()

      if (!tokenRes.ok || tokenData.code !== '00') {
        return ApiResponse.error(request, 'Error al obtener token de Izipay', 500)
      }

      const actualToken = tokenData.response?.token || tokenData.response

      await prisma.pedido.update({ where: { id: pedido.id }, data: { token_pago: String(actualToken) } })

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
          amount: String(total.toFixed(2)),
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

      return ApiResponse.success(request, {
        message: 'Pasarela Izipay preparada',
        iziConfig,
        token: String(actualToken),
        keyRSA: rsaKey,
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
