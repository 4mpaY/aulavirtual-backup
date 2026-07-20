import type { Currency } from '@/contexts/CurrencyContext'

export interface PriceableCourse {
  precio: number
  precio_falso?: number | null
  precio_usd?: number | null
  precio_falso_usd?: number | null
}

const SYMBOLS: Record<Currency, string> = {
  PEN: 'S/',
  USD: '$',
}

/**
 * Resuelve el precio a mostrar según la moneda activa del visitante.
 * Si el curso no tiene precio_usd configurado, hace fallback al valor en soles.
 */
export function getDisplayPrice(course: PriceableCourse, currency: Currency) {
  const useUsd = currency === 'USD' && course.precio_usd != null

  const amount = useUsd ? Number(course.precio_usd) : Number(course.precio)
  const falsoRaw = useUsd ? course.precio_falso_usd : course.precio_falso
  const falseAmount = falsoRaw != null && Number(falsoRaw) !== 0 ? Number(falsoRaw) : null
  const activeCurrency: Currency = useUsd ? 'USD' : 'PEN'

  return { amount, falseAmount, currency: activeCurrency }
}

export function formatPrice(amount: number, currency: Currency): string {
  return `${SYMBOLS[currency]} ${amount.toFixed(2)}`
}

export function formatCoursePrice(course: PriceableCourse, currency: Currency): string {
  const { amount, currency: activeCurrency } = getDisplayPrice(course, currency)

  return formatPrice(amount, activeCurrency)
}
