import prisma from '@/utils/libs/prisma'
import { crearPedidoManualSchema } from '@/schemas/pedido.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * POST /api/pedidos/manual
 * Crear un pedido manual para un estudiante (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar que el usuario sea ADMIN

    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()

    // 2. Validar datos con Zod
    const validation = validateRequest(crearPedidoManualSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { usuarios_ids, cursos_ids, precio, estado, metodo_pago, mensaje, tipo_comprobante, numero_comprobante } = validation.data

    // 3. Obtener información de los cursos
    const cursos = await prisma.curso.findMany({
      where: { id: { in: cursos_ids } }
    })

    if (cursos.length === 0) {
      return ApiResponse.error(request, 'No se encontraron los cursos seleccionados', 404)
    }

    const firstCourseMoneda = cursos[0].moneda || 'PEN'

    // 4. Procesar cada estudiante
    const resultados = []

    for (const usuario_id of usuarios_ids) {
      const estudiante = await prisma.usuario.findUnique({
        where: { id: usuario_id },
        include: { inscripciones: true }
      })

      if (!estudiante) {
        resultados.push({ usuario_id, status: 'error', message: 'El estudiante no existe' })
        continue
      }

      // Filtrar cursos en los que NO está inscrito
      const cursosParaInscribir = cursos.filter(c => 
        !estudiante.inscripciones.some(ins => ins.curso_id === c.id)
      )

      if (cursosParaInscribir.length === 0) {
        resultados.push({ 
          usuario_id, 
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,
          status: 'skipped', 
          message: 'El estudiante ya está inscrito en todos los cursos seleccionados' 
        })
        continue
      }

      try {
        // Crear Pedido e Inscripciones en una transacción por estudiante
        await prisma.$transaction(async tx => {
          const pedido = await tx.pedido.create({
            data: {
              usuario_id: usuario_id,
              total: precio,
              moneda: firstCourseMoneda,
              estado: estado,
              metodo_pago: metodo_pago,
              mensaje: mensaje || `Pedido masivo generado por administrador`,
              tipo_comprobante: tipo_comprobante,
              numero_comprobante: numero_comprobante,
              pagado_en: estado === 'COMPLETADO' ? new Date() : null,
              detalles: {
                create: cursosParaInscribir.map(c => ({
                  curso_id: c.id,
                  precio_unitario: precio / cursosParaInscribir.length,
                  subtotal: precio / cursosParaInscribir.length,
                  total: precio / cursosParaInscribir.length,
                  cantidad: 1
                }))
              }
            }
          })

          // Solo inscribir al estudiante si el pedido queda COMPLETADO
          if (estado === 'COMPLETADO') {
            await Promise.all(
              cursosParaInscribir.map(c =>
                tx.inscripcion.create({
                  data: {
                    usuario_id: usuario_id,
                    curso_id: c.id,
                    pedido_id: pedido.id,
                    estado: 'ACTIVO',
                    inscrito_en: new Date()
                  }
                })
              )
            )
          }
        })

        resultados.push({ 
          usuario_id, 
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,
          status: 'success', 
          cursos: cursosParaInscribir.map(c => c.titulo) 
        })
      } catch (error: any) {
        console.error(`Error procesando estudiante ${usuario_id}:`, error)
        resultados.push({ 
          usuario_id, 
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,
          status: 'error', 
          message: error.message || 'Error interno' 
        })
      }
    }

    const exitosos = resultados.filter(r => r.status === 'success').length

    return ApiResponse.success(
      request,
      {
        message: `Proceso completado. ${exitosos} estudiantes inscritos exitosamente.`,
        detalles: resultados
      },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
