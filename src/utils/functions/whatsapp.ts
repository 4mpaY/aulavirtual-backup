const DEFAULT_WHATSAPP_NUMBER = '51928510125'

/**
 * Extrae solo los dígitos de un número de WhatsApp, soportando valores
 * guardados con "+", espacios, guiones o paréntesis (ej: "+51 999 999 999").
 */
export function normalizeWhatsAppNumber(value?: string | null): string {
  return (value ?? '').replace(/\D/g, '')
}

/**
 * Arma la URL de wa.me a partir del valor guardado en configuración.
 * Acepta números en cualquier formato ("+51 999 999 999", "51999999999", etc.)
 * y también enlaces ya armados (wa.me/wa.link), que se devuelven tal cual.
 */
export function buildWhatsAppUrl(value?: string | null, options?: { fallback?: string; text?: string }): string {
  const raw = (value ?? '').trim()
  const query = options?.text ? `?text=${encodeURIComponent(options.text)}` : ''

  if (/^https?:\/\//i.test(raw)) {
    return raw
  }

  const digits = normalizeWhatsAppNumber(raw) || options?.fallback || DEFAULT_WHATSAPP_NUMBER

  return `https://wa.me/${digits}${query}`
}
