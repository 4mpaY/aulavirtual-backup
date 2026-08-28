import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verifica la firma de la notificación IPN clásica de Izipay/Lyra (formato vads_*).
 *
 * Algoritmo oficial (docs.lyra.com/en/collect/form-payment/quick-start-guide/computing-the-ipn-signature.html):
 * 1. Ordenar alfabéticamente los campos cuyo nombre empieza con "vads_".
 * 2. Concatenar el valor de cada campo seguido de "+" (incluyendo el último campo).
 * 3. Agregar la Clave HMAC-SHA-256 al final de esa cadena (sin separador adicional,
 *    ya que el paso anterior deja un "+" colgando antes de la clave).
 * 4. Calcular HMAC-SHA256 de esa cadena completa usando la misma clave como clave del HMAC,
 *    codificado en base64. El resultado debe coincidir con el campo `signature`.
 */
export function verifyVadsSignature(params: URLSearchParams, claveHash: string): boolean {
  if (!claveHash) return false

  const receivedSignature = params.get('signature')

  if (!receivedSignature) return false

  const vadsKeys = [...params.keys()].filter(k => k.startsWith('vads_')).sort()
  const signatureContents = vadsKeys.map(k => `${params.get(k) ?? ''}+`).join('') + claveHash

  const computed = createHmac('sha256', claveHash).update(signatureContents).digest('base64')

  return safeCompare(computed, receivedSignature)
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
