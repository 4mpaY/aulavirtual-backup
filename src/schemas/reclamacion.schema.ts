import { z } from 'zod'

export const ReclamacionSchema = z.object({
  tipo_documento: z.enum(['DNI', 'CE', 'PASAPORTE', 'OTRO']),
  numero_documento: z.string().min(8, 'Documento inválido').max(15, 'Documento muy largo'),
  nombre: z.string().min(3, 'El nombre/razón social es muy corto'),
  domicilio: z.string().min(5, 'El domicilio es obligatorio'),
  telefono: z.string().min(6, 'Número de teléfono inválido'),
  email: z.string().email('Correo electrónico no válido'),
  nombre_apoderado: z.string().optional(),
  bien_contratado_tipo: z.enum(['PRODUCTO', 'SERVICIO']),
  moneda: z.enum(['PEN', 'USD']),
  monto_reclamado: z.string().or(z.number()),
  descripcion_bien: z.string().min(5, 'Describe brevemente el bien o servicio contratado'),
  tipo_reclamacion: z.enum(['RECLAMO', 'QUEJA']),
  detalle: z.string().min(10, 'El detalle debe ser más explicativo'),
  pedido: z.string().min(10, 'Debes detallar qué solicitas')
})

export type ReclamacionInput = z.infer<typeof ReclamacionSchema>
