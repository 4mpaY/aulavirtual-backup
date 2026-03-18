import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { createPaypalOrder } from '@/utils/libs/paypal-api'

/**
 * POST /api/paypal/create
 * Crea una orden de PayPal y un pedido en la base de datos
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { cursoIds, codigoCupon } = await request.json()

    if (!cursoIds || !Array.isArray(cursoIds) || cursoIds.length === 0) {
      return ApiResponse.error(request, 'Se requiere al menos un ID de curso', 400)
    }

    // 1. Obtener cursos y verificar inscripciones
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

    if (inscripcionesExistentes.length > 0) {
      return ApiResponse.error(request, 'Ya estás inscrito en uno de los cursos seleccionados', 400)
    }

    // 2. Calcular total
    const subtotal = cursos.reduce((acc, c) => acc + Number(c.precio), 0)
    let total = subtotal
    let cuponId = null
    let descuentoTotal = 0

    if (codigoCupon) {
      const cupon = await prisma.cupon.findUnique({
        where: { codigo: codigoCupon.toUpperCase(), esta_activo: true }
      })

      if (cupon) {
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

    // 3. Conversión de Moneda para PayPal (Dinámica desde BD)
    let exchangeRate = Number(process.env.PAYPAL_EXCHANGE_RATE) || 3.8

    try {
      const config = await prisma.configuracion.findUnique({
        where: { clave: 'PAYPAL_EXCHANGE_RATE' }
      })

      if (config) {
        exchangeRate = Number(config.valor)
      }
    } catch (e) {
      console.warn('Error al obtener tipo de cambio de la BD, usando fallback', e)
    }

    const totalUSD = Number((total / exchangeRate).toFixed(2))

    const monedaOriginal = 'PEN'
    const monedaPaypal = 'USD'

    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: auth.user.id,
        cupon_id: cuponId,
        total,
        moneda: monedaOriginal,
        estado: 'PENDIENTE',
        metodo_pago: 'PAYPAL',
        mensaje: `Monto convertido a PayPal: $${totalUSD} (TC: ${exchangeRate})`,
        detalles: {
          create: cursos.map(c => {
            const precioCurso = Number(c.precio)
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
