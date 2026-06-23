import prisma from '@/utils/libs/prisma'
import { sendOrderConfirmationEmail } from './order-notifications'

interface OrderCompletionData {
  metodo_pago: 'PAYPAL' | 'IZIPAY' | 'CULQI' | 'MERCADOPAGO' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO'
  transaccion_id?: string
  respuesta_pago?: any
}

/**
 * Servicio centralizado para completar un pedido.
 * Crea inscripciones (cursos) y accesos (ebooks), maneja cupones y notificaciones.
 */
export async function completeOrder(pedidoId: string, data: OrderCompletionData) {
  try {
    // 1. Verificar si el pedido ya fue completado (evita duplicados por webhooks concurrentes)
    const pedidoInit = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        detalles: {
          include: {
            curso: {
              select: { id: true, vigencia_meses: true }
            }
          }
        },
        usuario: true
      }
    })

    if (!pedidoInit) throw new Error(`Pedido ${pedidoId} no encontrado.`)

    if (pedidoInit.estado === 'COMPLETADO') {
      console.log(`[Order-Service] El pedido ${pedidoId} ya está completado.`)

      const inscripciones = await prisma.inscripcion.findMany({
        where: { pedido_id: pedidoId }
      })

      return { pedido: pedidoInit, inscripciones, yaCompletado: true }
    }

    // Obtener detalles de ebooks via raw SQL (ebook_id no está en el cliente Prisma aún)
    const ebookDetalles = await prisma.$queryRaw<Array<{ ebook_id: string }>>`
      SELECT ebook_id FROM detalles_pedido
      WHERE pedido_id = ${pedidoId}
        AND tipo_item = 'EBOOK'
        AND ebook_id IS NOT NULL
    `

    // 2. Transacción de Base de Datos
    const result = await prisma.$transaction(
      async tx => {
        // a) Actualizar pedido
        const pedidoActualizado = await tx.pedido.update({
          where: { id: pedidoId },
          data: {
            estado: 'COMPLETADO',
            pagado_en: new Date(),
            metodo_pago: data.metodo_pago as any,
            transaccion_id: data.transaccion_id || null,
            respuesta_izipay: data.respuesta_pago || null
          }
        })

        // b) Incrementar uso de cupón si aplica
        if (pedidoInit.cupon_id) {
          await tx.cupon.update({
            where: { id: pedidoInit.cupon_id },
            data: { usos_actuales: { increment: 1 } }
          })
        }

        // c) Crear inscripciones activas para cursos
        const inscripciones = []

        for (const detalle of pedidoInit.detalles) {
          if (!detalle.curso_id) continue

          const ins = await tx.inscripcion.upsert({
            where: {
              usuario_id_curso_id: {
                usuario_id: pedidoInit.usuario_id,
                curso_id: detalle.curso_id
              }
            },
            update: { estado: 'ACTIVO', pedido_id: pedidoId },
            create: {
              usuario_id: pedidoInit.usuario_id,
              curso_id: detalle.curso_id,
              pedido_id: pedidoId,
              estado: 'ACTIVO',
              inscrito_en: new Date()
            }
          })

          inscripciones.push(ins)
        }

        // d) Crear EbookAcceso para ebooks del pedido
        for (const { ebook_id } of ebookDetalles) {
          await tx.$executeRaw`
            INSERT INTO ebook_accesos (id, usuario_id, ebook_id, creado_en)
            VALUES (gen_random_uuid(), ${pedidoInit.usuario_id}, ${ebook_id}, NOW())
            ON CONFLICT (usuario_id, ebook_id) DO NOTHING
          `
        }

        return { pedido: pedidoActualizado, inscripciones }
      },
      { timeout: 30000 }
    )

    // e) Notificar a Admins (fuera de la transacción)
    try {
      const admins = await prisma.usuario.findMany({
        where: { rol: 'ADMIN' },
        select: { id: true }
      })

      await Promise.all(
        admins.map(admin =>
          prisma.notificacion.create({
            data: {
              titulo: `Nuevo Pedido (${data.metodo_pago})`,
              mensaje: `El usuario ${pedidoInit.usuario.nombre} ha realizado un pedido exitoso por ${pedidoInit.moneda} ${pedidoInit.total}.`,
              tipo: 'PEDIDO_NUEVO',
              usuario_id: admin.id,
              enlace: `/admin/pedidos`
            }
          })
        )
      )
    } catch (notifyError) {
      console.error(`[Order-Service] Error enviando notificaciones para pedido ${pedidoId}:`, notifyError)
    }

    // 3. Envío de correo asíncrono
    sendOrderConfirmationEmail(pedidoId).catch(err => {
      console.error(`[Order-Service] Error enviando mail para pedido ${pedidoId}:`, err)
    })

    return { ...result, yaCompletado: false }
  } catch (error) {
    console.error(`[Order-Service] Error crítico completando pedido ${pedidoId}:`, error)
    throw error
  }
}
