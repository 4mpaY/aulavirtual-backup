import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/checkout
 * Genera un pedido y obtiene el Session Token de Izipay Web Core
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { cursoId } = await request.json()

    if (!cursoId) {
      return ApiResponse.error(request, 'El ID del curso es requerido', 400)
    }

    // 1. Verificar que el curso exista
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'El curso no existe', 404)
    }

    // 2. Verificar si el usuario ya está inscrito
    const inscripcionExistente = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      }
    })

    if (inscripcionExistente) {
      return ApiResponse.error(request, 'Ya estás inscrito en este curso', 400)
    }

    // 3. Crear el pedido en estado PENDIENTE
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        total: curso.precio,
        moneda: curso.moneda || 'PEN',
        estado: 'PENDIENTE',
        detalles: {
          create: {
            curso_id: cursoId,
            precio_unitario: curso.precio,
            subtotal: curso.precio,
            total: curso.precio
          }
        }
      }
    })

    // 4. Generar transactionId y dateTimeTransaction para Izipay
    const transactionId = String(Date.now()) // Al menos 13 chars (timestamp)

    // orderNumber debe tener entre 5-15 caracteres
    const orderNumber = String(pedido.numero_pedido).padStart(10, '0')

    // 5. Obtener Session Token de Izipay
    const merchantCode = process.env.IZIPAY_MERCHANT_CODE
    const apiKey = process.env.IZIPAY_API_KEY
    const endpoint = process.env.IZIPAY_ENDPOINT

    const tokenResponse = await fetch(`${endpoint}/security/v1/Token/Generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        transactionId: transactionId
      },
      body: JSON.stringify({
        requestSource: 'ECOMMERCE',
        merchantCode: merchantCode,
        orderNumber: orderNumber,
        publicKey: apiKey,
        amount: String(Number(curso.precio).toFixed(2))
      })
    })

    const tokenData = await tokenResponse.json()

    console.log('--- IZIPAY TOKEN GENERATE RESPONSE ---')
    console.dir(tokenData, { depth: null })
    console.log('------------------------------------')

    if (!tokenResponse.ok || tokenData.code !== '00') {
      console.error('Izipay Token Error:', tokenData)

      return ApiResponse.error(request, 'Error al obtener el token de sesión de Izipay', 500)
    }

    // 6. Extraer el token real y guardarlo en el pedido
    const actualToken = tokenData.response?.token || tokenData.response

    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { token_pago: String(actualToken) }
    })

    // 7. Preparar el iziConfig para el frontend
    const userName = auth.user.name || 'Cliente'
    const firstName = userName.split(' ')[0]
    const lastName = userName.split(' ').slice(1).join(' ') || 'Cliente'

    // Documento debe ser generalmente de 8 chars para DNI
    const documentStr = auth.user.numero_documento || '12345678'
    const validDocument = documentStr.length >= 8 ? documentStr.substring(0, 15) : '12345678'

    const iziConfig = {
      transactionId,
      action: 'pay',
      merchantCode,
      order: {
        orderNumber: orderNumber,
        currency: curso.moneda || 'PEN',
        amount: String(Number(curso.precio).toFixed(2)),
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
      render: {
        typeForm: 'pop-up'
      }
    }

    return ApiResponse.success(
      request,
      {
        message: 'Pasarela preparada correctamente',
        iziConfig,

        // Se envía el token extraído validado arriba
        token: String(actualToken),
        keyRSA: process.env.IZIPAY_RSA_KEY,
        pedidoId: pedido.id,
        _debugTokenData: tokenData // temporal para debug
      },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
