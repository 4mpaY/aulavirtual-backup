import { z } from 'zod'

// ---------------------------------------------------------------------------
// Crear Categoría (solo padres — no acepta categoria_padre_id)
// ---------------------------------------------------------------------------
export const crearCategoriaSchema = z.object({
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
})

export type CrearCategoriaDto = z.infer<typeof crearCategoriaSchema>

// ---------------------------------------------------------------------------
// Crear Subcategoría (hijo de un padre)
// ---------------------------------------------------------------------------
export const crearSubcategoriaSchema = z.object({
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
})

export type CrearSubcategoriaDto = z.infer<typeof crearSubcategoriaSchema>

// ---------------------------------------------------------------------------
// Actualizar Categoría
// ---------------------------------------------------------------------------
export const actualizarCategoriaSchema = z.object({
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
  esta_activo: z.boolean().optional(),
  orden: z.number().int().min(0).optional()
})

export type ActualizarCategoriaDto = z.infer<typeof actualizarCategoriaSchema>

// ---------------------------------------------------------------------------
// Reordenar subcategorías
// ---------------------------------------------------------------------------
export const reordenarCategoriasSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      orden: z.number().int().min(0)
    })
  ).min(1, 'Debe incluir al menos un item')
})

export type ReordenarCategoriasDto = z.infer<typeof reordenarCategoriasSchema>

// ---------------------------------------------------------------------------
// Query params para listar
// ---------------------------------------------------------------------------
export const listarCategoriasQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  buscar: z.string().optional(),
  esta_activo: z
    .enum(['true', 'false'])
    .transform(v => v === 'true')
    .optional()
})

export type ListarCategoriasQuery = z.infer<typeof listarCategoriasQuerySchema>
