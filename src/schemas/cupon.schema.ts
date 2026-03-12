import { z } from 'zod'

export const validarCuponSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  cursoIds: z.array(z.string().uuid()).min(1, 'Se requiere al menos un curso')
})
