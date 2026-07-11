import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verifica la firma HMAC-SHA256 de la respuesta de pago de Izipay usando la
 * "Clave HMAC-SHA-256" del comercio (Back Office → Configuración → Claves de API REST).
 *
 * Izipay (basado en Lyra) documenta dos variantes de nombres de campo para el mismo
 * mecanismo, según el flujo/SDK usado:
 *  - Clásica (kr-answer / kr-hash): hash en HEXADECIMAL sobre el string `kr-answer`.
 *  - Web Core (payloadHttp / signature): hash en BASE64 sobre el string `payloadHttp`.
 * Se prueban ambas para no depender de adivinar cuál entrega el SDK en tiempo de ejecución.
 */
export function verifyIzipaySignature(
  payload: { krAnswer?: string; krHash?: string; payloadHttp?: string; signature?: string },
  claveHash: string
): boolean {
  const { krAnswer, krHash, payloadHttp, signature } = payload

  if (!claveHash) return false

  if (krAnswer && krHash) {
    const computed = createHmac('sha256', claveHash).update(krAnswer).digest('hex')

    if (safeCompare(computed, krHash)) return true

    console.warn('[IZIPAY_SIGNATURE] kr-hash no coincide. Calculado:', computed, 'Recibido:', krHash)
  }

  if (payloadHttp && signature) {
    const computed = createHmac('sha256', claveHash).update(payloadHttp).digest('base64')

    if (safeCompare(computed, signature)) return true

    console.warn('[IZIPAY_SIGNATURE] signature no coincide. Calculado:', computed, 'Recibido:', signature)
  }

  return false
}

function safeCompare(a: string, b: string): boolean {
  try {
    const bufferA = Buffer.from(a, 'utf8')
    const bufferB = Buffer.from(b, 'utf8')

    if (bufferA.length !== bufferB.length) return false

    return timingSafeEqual(bufferA, bufferB)
  } catch {
    return false
  }
}
