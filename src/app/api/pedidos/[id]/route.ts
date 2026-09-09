export const dynamic = 'force-dynamic'

import { handleApiError, validateRequest } from '@/utils/libs/validation'

import { ApiResponse } from '@/utils/libs/apiResponse'
import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { updatePedidoSchema } from '@/schemas/pedido.schema'

/**
 * GET /api/pedidos/[id]
 * Obtener detalle de pedido (solo ADMIN)
 */
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, correo: true, avatar: true } },
        cupon: true,
        detalles: {
          include: {
            curso: { select: { id: true, titulo: true, miniatura: true, precio: true } },
            ebook: { select: { id: true, titulo: true, miniatura: true, precio: true } }
          }
        }
      }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    return ApiResponse.success(request, { data: pedido })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/pedidos/[id]
 * Actualizar pedido (solo ADMIN)
 */
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params
    const body = await request.json()

    const validation = validateRequest(updatePedidoSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { estado, metodo_pago, mensaje, tipo_comprobante, numero_comprobante } = validation.data

    const pedidoAnterior = await prisma.pedido.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            curso: {
              select: { id: true, vigencia_meses: true }
            }
          }
        }
      }
    })

    if (!pedidoAnterior) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    // Si cambió a COMPLETADO, deberíamos teóricamente generar las inscripciones
    // Si cambió de COMPLETADO a CANCELADO/REEMBOLSADO, deberíamos revocar

    // Iniciar transacción para actualizar pedido y revocar/conceder inscripciones
    await prisma.$transaction(async tx => {
      // Modificar pedido
      const pagado_en = estado === 'COMPLETADO' && !pedidoAnterior.pagado_en ? new Date() : pedidoAnterior.pagado_en

      await tx.pedido.update({
        where: { id },
        data: {
          estado,
          metodo_pago,
          mensaje,
          tipo_comprobante,
          numero_comprobante,
          pagado_en: estado === 'COMPLETADO' ? pagado_en : null
        }
      })

      const cursosIds = pedidoAnterior.detalles.map(d => d.curso_id).filter((cid): cid is string => !!cid)
      const ebooksIds = pedidoAnterior.detalles.map(d => d.ebook_id).filter((eid): eid is string => !!eid)

      // Lógica de revocación si pasa de completado a otro estado
      if (pedidoAnterior.estado === 'COMPLETADO' && estado !== 'COMPLETADO') {
        if (cursosIds.length > 0) {
          await tx.inscripcion.deleteMany({
            where: {
              usuario_id: pedidoAnterior.usuario_id,
              curso_id: { in: cursosIds },
              pedido_id: id // Opcional, por seguridad extra
            }
          })
        }

        if (ebooksIds.length > 0) {
          await tx.ebookAcceso.deleteMany({
            where: {
              usuario_id: pedidoAnterior.usuario_id,
              ebook_id: { in: ebooksIds }
            }
          })
        }
      }

      // Lógica de aprobación manual si pasa a COMPLETADO
      if (pedidoAnterior.estado !== 'COMPLETADO' && estado === 'COMPLETADO') {
        if (cursosIds.length > 0) {
          // Evitar duplicados
          const yaInscritos = await tx.inscripcion.findMany({
            where: {
              usuario_id: pedidoAnterior.usuario_id,
              curso_id: { in: cursosIds }
            }
          })

          const inscritosIds = yaInscritos.map(i => i.curso_id)
          const cursosAInscribir = cursosIds.filter(cid => !inscritosIds.includes(cid))

          if (cursosAInscribir.length > 0) {
            await Promise.all(
              cursosAInscribir.map(cid => {
                const fechaInscripcion = new Date()

                return tx.inscripcion.create({
                  data: {
                    usuario_id: pedidoAnterior.usuario_id,
                    curso_id: cid,
                    pedido_id: id,
                    estado: 'ACTIVO',
                    inscrito_en: fechaInscripcion
                  }
                })
              })
            )
          }
        }

        if (ebooksIds.length > 0) {
          await Promise.all(
            ebooksIds.map(eid =>
              tx.ebookAcceso.upsert({
                where: { usuario_id_ebook_id: { usuario_id: pedidoAnterior.usuario_id, ebook_id: eid } },
                update: {},
                create: { usuario_id: pedidoAnterior.usuario_id, ebook_id: eid }
              })
            )
          )
        }
      }
    })

    return ApiResponse.success(request, { message: 'Pedido actualizado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/pedidos/[id]
 * Eliminar pedido e inscripciones vinculadas (solo ADMIN)
 */
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { id } = params

    const pedido = await prisma.pedido.findUnique({
      where: { id }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    await prisma.$transaction(async tx => {
      // 1. Eliminar inscripciones vinculadas a este pedido
      await tx.inscripcion.deleteMany({
        where: { pedido_id: id }
      })

      // 2. Eliminar detalles del pedido
      await tx.detallePedido.deleteMany({
        where: { pedido_id: id }
      })

      // 3. Eliminar el pedido base
      await tx.pedido.delete({
        where: { id }
      })
    })

    return ApiResponse.success(request, { message: 'Pedido eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
