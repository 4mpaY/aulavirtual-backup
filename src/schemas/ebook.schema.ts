import { z } from 'zod'

const anioActual = new Date().getFullYear()

// ---------------------------------------------------------------------------
// Crear Ebook
// ---------------------------------------------------------------------------
export const crearEbookSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  descripcion: z.string().trim().max(5000, 'La descripción no puede exceder 5000 caracteres').optional().nullable(),
  resena: z.string().trim().max(5000, 'La reseña no puede exceder 5000 caracteres').optional().nullable(),
  autor: z.string().trim().max(150).optional().nullable(),
  genero: z.string().trim().max(100).optional().nullable(),
  miniatura: z.string().optional().nullable(),
  archivo_pdf: z.string().min(1, 'El archivo PDF es requerido'),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo').default(0),
  precio_falso: z.coerce.number().min(0, 'El precio falso no puede ser negativo').default(0),
  moneda: z.string().max(3).default('PEN'),
  es_gratis: z.boolean().default(false),
  paginas: z.coerce.number().int().positive().optional().nullable(),
  categoria_id: z.string().uuid('ID de categoría inválido').optional().nullable(),
  estado: z.enum(['BORRADOR', 'PUBLICADO', 'ARCHIVADO']).default('BORRADOR'),

  // Opciones avanzadas (detalle editorial)
  editorial: z.string().trim().max(150).optional().nullable(),
  anio_edicion: z.coerce.number().int().min(1900).max(anioActual + 1).optional().nullable(),
  saga: z.string().trim().max(150).optional().nullable(),
  idioma: z.string().trim().max(50).optional().nullable()
})

export type CrearEbookDto = z.infer<typeof crearEbookSchema>

// ---------------------------------------------------------------------------
// Actualizar Ebook
// ---------------------------------------------------------------------------
export const actualizarEbookSchema = crearEbookSchema.partial()

export type ActualizarEbookDto = z.infer<typeof actualizarEbookSchema>
