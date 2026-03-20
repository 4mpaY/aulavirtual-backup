/**
 * 🔐 Rate Limiter en memoria para proteger endpoints críticos.
 *
 * Implementación simple de ventana deslizante (sliding window).
 * Para producción multi-instancia (múltiples pods), reemplazar por Redis (Upstash).
 *
 * Uso:
 *   const limiter = rateLimiter({ windowMs: 60_000, max: 5 })
 *   const result = await limiter(request)
 *   if (!result.success) return ApiResponse.error(request, 'Demasiados intentos', 429)
 */

interface RateLimiterOptions {

  /** Ventana de tiempo en milisegundos (ej: 60_000 = 1 minuto) */
  windowMs: number

  /** Máximo de peticiones permitidas en la ventana */
  max: number
}

interface RateLimitResult {
  success: boolean

  /** Peticiones restantes en la ventana */
  remaining: number

  /** Timestamp en ms cuando se resetea la ventana */
  resetAt: number
}

interface RequestRecord {
  count: number
  resetAt: number
}

/**
 * Obtiene la IP del cliente desde los headers de la request.
 */
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')

  if (cfIP) return cfIP.trim()
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP.trim()

  return 'unknown'
}

/**
 * Crea un rate limiter reutilizable.
 * Cada llamada a rateLimiter() crea un almacén independiente.
 */
export function rateLimiter(options: RateLimiterOptions) {
  const store = new Map<string, RequestRecord>()

  // Limpiar entradas expiradas cada 5 minutos para evitar memory leaks
  setInterval(
    () => {
      const now = Date.now()

      for (const [key, record] of store.entries()) {
        if (now >= record.resetAt) {
          store.delete(key)
        }
      }
    },
    5 * 60 * 1000
  )

  return function check(request: Request): RateLimitResult {
    const ip = getClientIP(request)
    const key = ip
    const now = Date.now()

    const existing = store.get(key)

    if (!existing || now >= existing.resetAt) {
      // Primera petición o ventana expirada: iniciar nueva ventana
      const resetAt = now + options.windowMs

      store.set(key, { count: 1, resetAt })

      return { success: true, remaining: options.max - 1, resetAt }
    }

    if (existing.count >= options.max) {
      // Límite alcanzado
      return { success: false, remaining: 0, resetAt: existing.resetAt }
    }

    // Incrementar contador
    existing.count++
    store.set(key, existing)

    return { success: true, remaining: options.max - existing.count, resetAt: existing.resetAt }
  }
}

/** Rate limiter para login/register: máximo 10 intentos por minuto por IP */
export const authLimiter = rateLimiter({ windowMs: 60_000, max: 10 })

/** Rate limiter para cambio de contraseña: máximo 5 intentos por 5 minutos por IP */
export const passwordLimiter = rateLimiter({ windowMs: 5 * 60_000, max: 5 })

/** Rate limiter para endpoints de pago: máximo 20 por minuto */
export const paymentLimiter = rateLimiter({ windowMs: 60_000, max: 20 })
