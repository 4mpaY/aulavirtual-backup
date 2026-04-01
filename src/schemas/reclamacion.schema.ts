import { z } from 'zod'
import { EstadoReclamacion, TipoDocumentoReclamo, TipoBien, TipoReclamacion } from '@prisma/client'

export const listarReclamacionesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  estado: z.string().default('TODOS'),
  buscar: z.string().trim().optional()
})

export type ListarReclamacionesQuery = z.infer<typeof listarReclamacionesQuerySchema>

export const updateReclamacionSchema = z.object({
  estado: z.nativeEnum(EstadoReclamacion),
  respuesta_proveedor: z.string().min(1, 'La respuesta es requerida').trim()
})

export type UpdateReclamacionDto = z.infer<typeof updateReclamacionSchema>

export const ReclamacionSchema = z.object({
  tipo_documento: z.nativeEnum(TipoDocumentoReclamo).default(TipoDocumentoReclamo.DNI),
  numero_documento: z.string().min(1, 'El número de documento es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  domicilio: z.string().min(1, 'El domicilio es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  nombre_apoderado: z.string().optional().nullable(),
  bien_contratado_tipo: z.nativeEnum(TipoBien).default(TipoBien.SERVICIO),
  moneda: z.string().default('PEN'),
  monto_reclamado: z.coerce.number().min(0, 'El monto debe ser mayor o igual a 0'),
  descripcion_bien: z.string().min(1, 'La descripción del bien es requerida'),
  tipo_reclamacion: z.nativeEnum(TipoReclamacion).default(TipoReclamacion.RECLAMO),
  detalle: z.string().min(1, 'El detalle es requerido'),
  pedido: z.string().min(1, 'El pedido es requerido'),
})

export type ReclamacionInput = z.infer<typeof ReclamacionSchema>
