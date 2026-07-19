import { z } from 'zod'

// ---------------------------------------------------------------------------
// Crear Evento Externo
// ---------------------------------------------------------------------------
export const crearEventoExternoSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(150, 'El título no puede exceder 150 caracteres'),
    descripcion: z
      .string()
      .trim()
      .max(1000, 'La descripción no puede exceder 1000 caracteres')
      .optional()
      .nullable(),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date().optional().nullable(),
    todo_el_dia: z.boolean().default(false),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido')
      .optional()
      .nullable()
  })
  .refine(data => !data.fecha_fin || data.fecha_fin >= data.fecha_inicio, {
    message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
    path: ['fecha_fin']
  })

export type CrearEventoExternoDto = z.infer<typeof crearEventoExternoSchema>

// ---------------------------------------------------------------------------
// Actualizar Evento Externo
// ---------------------------------------------------------------------------
export const actualizarEventoExternoSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(150, 'El título no puede exceder 150 caracteres')
      .optional(),
    descripcion: z
      .string()
      .trim()
      .max(1000, 'La descripción no puede exceder 1000 caracteres')
      .optional()
      .nullable(),
    fecha_inicio: z.coerce.date().optional(),
    fecha_fin: z.coerce.date().optional().nullable(),
    todo_el_dia: z.boolean().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido')
      .optional()
      .nullable()
  })
  .refine(data => !data.fecha_inicio || !data.fecha_fin || data.fecha_fin >= data.fecha_inicio, {
    message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
    path: ['fecha_fin']
  })

export type ActualizarEventoExternoDto = z.infer<typeof actualizarEventoExternoSchema>
