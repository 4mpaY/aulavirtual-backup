import { z } from 'zod'
import { ApiResponse } from './apiResponse'

/**
 * Valida datos usando un schema de Zod
 * @param schema Schema de Zod a usar para validación
 * @param data Datos a validar
 * @param request Request de Next.js (para extraer el path)
 * @returns Objeto con success y data/error
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown,
  request: Request
) {
  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false as const,
      error: ApiResponse.validationError(request, result.error.flatten().fieldErrors as Record<string, string[]>)
    }
  }

  return {
    success: true as const,
    data: result.data as z.infer<T>
  }
}

/**
 * Maneja errores de forma consistente en las API Routes
 */
export function handleApiError(error: unknown, request: Request) {
  console.error('API Error:', error)

  if (error instanceof z.ZodError) {
    return ApiResponse.validationError(request, error.flatten().fieldErrors as Record<string, string[]>)
  }

  if (error instanceof Error) {
    return ApiResponse.error(request, error.message, 500)
  }

  return ApiResponse.error(request, 'Error interno del servidor', 500)
}
