import { NextResponse } from 'next/server'

type ApiResponseBody = {
  status: boolean
  path: string
  statusCode: number
  result?: any
  message?: string
  errors?: Record<string, string[]>
  timestamp: string
}

/**
 * Helper centralizado para respuestas de API estandarizadas.
 *
 * Éxito:
 * { status: true, path, statusCode, result, timestamp }
 *
 * Error:
 * { status: false, path, statusCode, message, timestamp }
 */
export class ApiResponse {
  /**
   * Extrae el pathname del request URL
   */
  private static getPath(request: Request): string {
    try {
      const url = new URL(request.url)

      return url.pathname
    } catch {
      return ''
    }
  }

  /**
   * Respuesta exitosa
   */
  static success(request: Request, result: any, statusCode = 200) {
    const body: ApiResponseBody = {
      status: true,
      path: this.getPath(request),
      statusCode,
      result,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(body, { status: statusCode })
  }

  /**
   * Respuesta de error
   */
  static error(request: Request, message: string, statusCode = 500) {
    const body: ApiResponseBody = {
      status: false,
      path: this.getPath(request),
      statusCode,
      message,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(body, { status: statusCode })
  }

  /**
   * Error de validación (Zod)
   */
  static validationError(request: Request, errors: Record<string, string[]>) {
    const body: ApiResponseBody = {
      status: false,
      path: this.getPath(request),
      statusCode: 400,
      message: 'Datos inválidos',
      errors,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(body, { status: 400 })
  }
}
