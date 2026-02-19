import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Valida datos usando un schema de Zod
 * @param schema Schema de Zod a usar para validación
 * @param data Datos a validar
 * @returns Objeto con success y data/error
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
) {
  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false as const,
      error: NextResponse.json(
        {
          message: 'Datos inválidos',
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      )
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
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        message: 'Error de validación',
        errors: error.flatten().fieldErrors
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Error interno del servidor' },
    { status: 500 }
  )
}
