import { z } from 'zod'

export const crearSimulacroSchema = z.object({
  titulo: z.string().min(3, 'Mínimo 3 caracteres').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().max(5000).optional().nullable(),
  miniatura: z.string().url('URL inválida').optional().nullable(),
  nivel: z.enum(['BASICO', 'INTERMEDIO', 'AVANZADO']).default('BASICO'),
  duracion: z.coerce.number().int().min(0).optional().nullable(),
  numero_preguntas: z.number().int().min(0).default(0),
  area_tematica: z.string().max(100).optional().nullable(),
  es_gratis: z.boolean().default(false),
  precio: z.number().min(0).default(0),
  moneda: z.string().max(3).default('PEN'),
})

export const actualizarSimulacroSchema = crearSimulacroSchema.partial()

export const cambiarEstadoSimulacroSchema = z.object({
  estado: z.enum(['BORRADOR', 'PUBLICADO', 'ARCHIVADO']),
})

export const listarSimulacrosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  buscar: z.string().optional(),
  estado: z.enum(['BORRADOR', 'PUBLICADO', 'ARCHIVADO']).optional(),
  nivel: z.enum(['BASICO', 'INTERMEDIO', 'AVANZADO']).optional(),
})

export type CrearSimulacroDto = z.infer<typeof crearSimulacroSchema>
export type ActualizarSimulacroDto = z.infer<typeof actualizarSimulacroSchema>
export type CambiarEstadoSimulacroDto = z.infer<typeof cambiarEstadoSimulacroSchema>
export type ListarSimulacrosQuery = z.infer<typeof listarSimulacrosQuerySchema>
