import { z } from 'zod'

// ---------------------------------------------------------------------------
// Crear Módulo
// ---------------------------------------------------------------------------
export const crearModuloSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  descripcion: z
    .string()
    .trim()
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .optional()
    .nullable()
})

export type CrearModuloDto = z.infer<typeof crearModuloSchema>

// ---------------------------------------------------------------------------
// Actualizar Módulo
// ---------------------------------------------------------------------------
export const actualizarModuloSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .optional(),
  descripcion: z
    .string()
    .trim()
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .optional()
    .nullable()
})

export type ActualizarModuloDto = z.infer<typeof actualizarModuloSchema>

// ---------------------------------------------------------------------------
// Reordenar Módulos
// ---------------------------------------------------------------------------
export const reordenarModulosSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      orden: z.number().int().min(0)
    })
  ).min(1, 'Se requiere al menos un item')
})

export type ReordenarModulosDto = z.infer<typeof reordenarModulosSchema>
