import { handleApiError, validateRequest } from '@/utils/libs/validation'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { crearPedidoManualSchema } from '@/schemas/pedido.schema'
import { getConfigs } from '@/utils/libs/config'
import { getOrderConfirmationTemplate } from '@/utils/libs/email-templates'
import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { sendMail } from '@/utils/libs/mailer'

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

    const {
      usuarios_ids,
      cursos_ids,
      rutas_ids,
      precio,
      estado,
      metodo_pago,
      mensaje,
      tipo_comprobante,
      numero_comprobante
    } = validation.data

    // 3. Obtener información de los cursos y rutas seleccionados
    const cursos = cursos_ids.length
      ? await prisma.curso.findMany({
          where: { id: { in: cursos_ids } },
          select: { id: true, titulo: true, moneda: true, vigencia_meses: true }
        })
      : []

    const rutas = rutas_ids.length
      ? await prisma.rutaAprendizaje.findMany({
          where: { id: { in: rutas_ids } },
          select: { id: true, titulo: true, cursos: { select: { curso_id: true } } }
        })
      : []

    if (cursos.length === 0 && rutas.length === 0) {
      return ApiResponse.error(request, 'No se encontraron las capacitaciones/rutas seleccionadas', 404)
    }

    const firstCourseMoneda = cursos[0]?.moneda || 'PEN'

    // 4. Procesar cada estudiante
    const resultados = []

    for (const usuario_id of usuarios_ids) {
      const estudiante = await prisma.usuario.findUnique({
        where: { id: usuario_id },
        include: { inscripciones: true, inscripciones_ruta: true }
      })

      if (!estudiante) {
        resultados.push({ usuario_id, status: 'error', message: 'El estudiante no existe' })
        continue
      }

      // Filtrar cursos y rutas en los que NO está inscrito
      const cursosParaInscribir = cursos.filter(c => !estudiante.inscripciones.some(ins => ins.curso_id === c.id))
      const rutasParaInscribir = rutas.filter(r => !estudiante.inscripciones_ruta.some(ins => ins.ruta_id === r.id))

      // Extraer cursos de las rutas seleccionadas
      const cursosDeRutasIds = new Set<string>()

      rutasParaInscribir.forEach(ruta => {
        ruta.cursos.forEach(c => cursosDeRutasIds.add(c.curso_id))
      })

      // Agregar los cursos de las rutas a la lista de cursos para inscribir (si no están ya y si no los tiene el estudiante)
      const cursosAdicionales = await prisma.curso.findMany({
        where: { id: { in: Array.from(cursosDeRutasIds) } },
        select: { id: true, titulo: true }
      })

      const cursosFinalesParaInscribir = [
        ...cursosParaInscribir,
        ...cursosAdicionales.filter(
          ca => 
            !cursosParaInscribir.some(c => c.id === ca.id) && 
            !estudiante.inscripciones.some(ins => ins.curso_id === ca.id)
        )
      ]

      if (cursosFinalesParaInscribir.length === 0 && rutasParaInscribir.length === 0) {
        resultados.push({
          usuario_id,
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,
          status: 'skipped',
          message: 'El estudiante ya tiene acceso a todas las capacitaciones/rutas seleccionadas'
        })
        continue
      }

      const totalItems = cursosFinalesParaInscribir.length + rutasParaInscribir.length
      const precioPorItem = precio / totalItems

      try {
        // Crear Pedido, Inscripciones y Accesos a ebooks en una transacción por estudiante
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
                create: [
                  ...cursosParaInscribir.map(c => ({
                    tipo_item: 'CURSO',
                    curso_id: c.id,
                    precio_unitario: precioPorItem,
                    subtotal: precioPorItem,
                    total: precioPorItem,
                    cantidad: 1
                  })),
                  ...rutasParaInscribir.map(r => ({
                    tipo_item: 'RUTA',
                    ruta_id: r.id,
                    precio_unitario: precioPorItem,
                    subtotal: precioPorItem,
                    total: precioPorItem,
                    cantidad: 1
                  }))
                ]
              }
            }
          })

          // Solo inscribir/dar acceso si el pedido queda COMPLETADO
          if (estado === 'COMPLETADO') {
            await Promise.all(
              cursosFinalesParaInscribir.map(c => {
                const fechaInscripcion = new Date()

                return tx.inscripcion.create({
                  data: {
                    usuario_id: usuario_id,
                    curso_id: c.id,
                    pedido_id: pedido.id,
                    estado: 'ACTIVO',
                    inscrito_en: fechaInscripcion
                  }
                })
              })
            )

            await Promise.all(
              rutasParaInscribir.map(r =>
                tx.inscripcionRuta.create({
                  data: {
                    usuario_id: usuario_id,
                    ruta_id: r.id
                  }
                })
              )
            )
          }
        })

        // 📧 Enviar correo de confirmación de pedido
        try {
          // Buscamos el pedido recién creado para tener los detalles
          const pedidoCompleto = await prisma.pedido.findFirst({
            where: { usuario_id, total: precio, moneda: firstCourseMoneda },
            orderBy: { creado_en: 'desc' },
            include: {
              detalles: {
                include: { curso: { select: { titulo: true } }, ruta: { select: { titulo: true } } }
              }
            }
          })

          if (pedidoCompleto) {
            const configs = await getConfigs()
            const platformName = configs.TEMPLATE_NAME || 'Aula Virtual'
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

            const emailHtml = getOrderConfirmationTemplate({
              platformName,
              customerName: `${estudiante.nombre} ${estudiante.apellido}`,
              orderNumber: pedidoCompleto.numero_pedido,
              date: new Date().toLocaleDateString('es-PE'),
              total: Number(pedidoCompleto.total),
              moneda: pedidoCompleto.moneda,
              metodoPago: metodo_pago || 'Manual',
              cursos: pedidoCompleto.detalles.map(d => ({
                titulo: d.curso?.titulo ?? d.ruta?.titulo ?? '',
                precio: Number(d.total)
              })),
              appUrl
            })

            if (estudiante.correo) {
              await sendMail({
                to: estudiante.correo,
                subject: `Confirmación de Pedido #${pedidoCompleto.numero_pedido} - ${platformName}`,
                html: emailHtml
              })
            }
          }
        } catch (mailError) {
          console.error(`[Manual-Order-Mail] Error al enviar correo a ${estudiante.correo}:`, mailError)
        }

        resultados.push({
          usuario_id,
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,
          status: 'success',
          cursos: cursosFinalesParaInscribir.map(c => c.titulo).concat(rutasParaInscribir.map(r => r.titulo))
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
