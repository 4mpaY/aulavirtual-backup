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

    const { cursoIds, codigoCupon } = await request.json()

    if (!cursoIds || !Array.isArray(cursoIds) || cursoIds.length === 0) {
      return ApiResponse.error(request, 'Se requiere al menos un ID de curso', 400)
    }

    // 1. Obtener los cursos y verificar inscripciones en paralelo (Promise.all)
    const [cursos, inscripcionesExistentes] = await Promise.all([
      prisma.curso.findMany({
        where: { id: { in: cursoIds } }
      }),
      prisma.inscripcion.findMany({
        where: {
          usuario_id: auth.user.id,
          curso_id: { in: cursoIds }
        }
      })
    ])

    if (cursos.length === 0) {
      return ApiResponse.error(request, 'No se encontraron los cursos seleccionados', 404)
    }

    // 2. Verificar inscripciones existentes
    if (inscripcionesExistentes.length > 0) {
      const titulos = inscripcionesExistentes
        .map(i => {
          const c = cursos.find(curso => curso.id === i.curso_id)

          return c?.titulo
        })
        .join(', ')

      return ApiResponse.error(request, `Ya estás inscrito en: ${titulos}`, 400)
    }

    // 3. Calcular total y preparar detalles
    const subtotal = cursos.reduce((acc, c) => acc + Number(c.precio), 0)
    let total = subtotal
    let cuponId = null
    let descuentoTotal = 0

    // 3.1. Validar cupón si se proporciona
    if (codigoCupon) {
      const cupon = await prisma.cupon.findUnique({
        where: { codigo: codigoCupon.toUpperCase(), esta_activo: true }
      })

      if (cupon) {
        // Verificar expiración y límite
        const ahora = new Date()
        const expirado = cupon.fecha_expiracion && cupon.fecha_expiracion < ahora
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

    const moneda = cursos[0].moneda || 'PEN'

    // 4. Crear el pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        cupon_id: cuponId,
        total,
        moneda,
        estado: 'PENDIENTE',
        detalles: {
          create: cursos.map(c => {
            const precioCurso = Number(c.precio)

            // Distribuir el descuento proporcionalmente para los detalles si hay más de un curso
            // O simplemente aplicar el descuento proporcional al precio del curso respecto al subtotal
            const proporcion = subtotal > 0 ? precioCurso / subtotal : 0
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
        amount: String(Number(total).toFixed(2)),
        currency: moneda
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
