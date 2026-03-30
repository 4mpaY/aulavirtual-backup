import { z } from 'zod'
import { EstadoReclamacion } from '@prisma/client'

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
