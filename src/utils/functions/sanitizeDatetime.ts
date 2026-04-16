export function sanitizeDatetimeInput(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.trim()

  if (normalized.length === 0) return null

  // Si ya incluye un tiempo, lo dejamos tal cual.
  if (normalized.includes('T')) return normalized

  // Para fechas tipo YYYY-MM-DD, fijamos la hora a mediodía para evitar
  // desplazamientos de día por diferencias de zona horaria.
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T12:00:00`
  }

  return normalized
}

export function toLocalDateInputValue(value: string | number | Date): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (num: number) => String(num).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toLocalDatetimeLocalValue(value: string | number | Date): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (num: number) => String(num).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
