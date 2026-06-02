import { z } from 'zod'

export const crearPlanSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .trim()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
  moneda: z.string().default('PEN'),
  intervalo: z.enum(['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']),
  dias_prueba: z.coerce.number().int().min(0).default(0),
  esta_activo: z.boolean().default(true),
  cursoIds: z
    .array(z.string().uuid('ID de curso inválido'))
    .min(1, 'Se requiere al menos un curso')
})

export type CrearPlanDto = z.infer<typeof crearPlanSchema>

export const actualizarPlanSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  descripcion: z
    .string()
    .trim()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0').optional(),
  moneda: z.string().optional(),
  intervalo: z.enum(['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']).optional(),
  dias_prueba: z.coerce.number().int().min(0).optional(),
  esta_activo: z.boolean().optional(),
  cursoIds: z.array(z.string().uuid('ID de curso inválido')).optional()
})

export type ActualizarPlanDto = z.infer<typeof actualizarPlanSchema>

export const listarPlanesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  buscar: z.string().optional(),
  esta_activo: z
    .enum(['true', 'false'])
    .transform(v => v === 'true')
    .optional()
})

export type ListarPlanesQuery = z.infer<typeof listarPlanesQuerySchema>
