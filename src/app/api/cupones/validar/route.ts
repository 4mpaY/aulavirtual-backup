import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { validarCuponSchema } from '@/schemas/cupon.schema'

/**
 * POST /api/cupones/validar
 * Valida un cupón y calcula el descuento
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = validateRequest(validarCuponSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { codigo, cursoIds } = validation.data

    // 1. Buscar el cupón incluyendo sus cursos permitidos
    const cupon = await prisma.cupon.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: { cursos: { select: { curso_id: true } } }
    })

    if (!cupon) {
      return ApiResponse.error(request, 'El cupón no existe', 404)
    }

    // 2. Validaciones de vigencia y estado
    if (!cupon.esta_activo) {
      return ApiResponse.error(request, 'El cupón no está activo', 400)
    }

    if (cupon.fecha_expiracion) {
      const hoy = new Date()
      const fechaExpiracion = new Date(cupon.fecha_expiracion)

      // Normalizar ambas fechas a medianoche (00:00:00) para comparar solo el día
      hoy.setHours(0, 0, 0, 0)
      fechaExpiracion.setHours(0, 0, 0, 0)

      if (fechaExpiracion < hoy) {
        return ApiResponse.error(request, 'El cupón ha expirado', 400)
      }
    }

    if (cupon.limite_uso !== null && cupon.usos_actuales >= cupon.limite_uso) {
      return ApiResponse.error(request, 'El cupón ha alcanzado su límite de uso', 400)
    }

    // 3. Verificar restricción por cursos (si el cupón tiene cursos asignados)
    if (cupon.cursos.length > 0) {
      const cursosPermitidos = cupon.cursos.map(c => c.curso_id)
      const cursosNoPermitidos = cursoIds.filter(id => !cursosPermitidos.includes(id))

      if (cursosNoPermitidos.length > 0) {
        return ApiResponse.error(request, 'Este cupón no es válido para uno o más cursos seleccionados', 400)
      }
    }

    // 4. Obtener precios de los cursos para calcular el descuento
    const cursos = await prisma.curso.findMany({
      where: { id: { in: cursoIds } },
      select: { precio: true }
    })

    if (cursos.length === 0) {
      return ApiResponse.error(request, 'No se encontraron cursos válidos', 404)
    }

    const subtotal = cursos.reduce((acc, c) => acc + Number(c.precio), 0)
    let descuento = 0

    if (cupon.tipo === 'PORCENTAJE') {
      descuento = subtotal * (Number(cupon.valor) / 100)
    } else if (cupon.tipo === 'MONTO_FIJO') {
      descuento = Number(cupon.valor)
    }

    // El descuento no puede ser mayor que el subtotal
    if (descuento > subtotal) {
      descuento = subtotal
    }

    const total = subtotal - descuento

    return ApiResponse.success(request, {
      valido: true,
      cuponId: cupon.id,
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      valor: cupon.valor,
      subtotal,
      descuento,
      total
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
