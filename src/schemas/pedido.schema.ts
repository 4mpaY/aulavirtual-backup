import { z } from 'zod'
import { MetodoPago } from '@prisma/client'

/**
 * Schema para crear un pedido manual (Admin)
 */
export const crearPedidoManualSchema = z.object({
  usuario_id: z.string().uuid('ID de usuario inválido'),
  curso_id: z.string().uuid('ID de curso inválido'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo').max(1000000, 'El precio es demasiado alto'),
  metodo_pago: z.nativeEnum(MetodoPago).default(MetodoPago.TRANSFERENCIA),
  mensaje: z.string().trim().max(500, 'El mensaje no puede exceder 500 caracteres').optional()
})

export type CrearPedidoManualDto = z.infer<typeof crearPedidoManualSchema>

/**
 * Schema para query params de listado de pedidos
 */
export const listarPedidosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  estado: z.string().optional(),
  buscar: z.string().trim().optional()
})

export type ListarPedidosQuery = z.infer<typeof listarPedidosQuerySchema>
