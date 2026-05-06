export function sanitizeDatetimeInput(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.trim()

  if (normalized.length === 0) return null

  // Si contiene T pero no tiene timezone, interpretarlo como hora local y convertir a UTC ISO
  if (normalized.includes('T') && !normalized.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(normalized)) {
    const date = new Date(normalized) // browser trata sin timezone como hora local

    if (!isNaN(date.getTime())) return date.toISOString() // → "YYYY-MM-DDTHH:MM:SS.sssZ"

    return normalized
  }

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
