'use client'

import { useEffect, useState } from 'react'

interface HydratedDateProps {
  date: string | Date | number | null | undefined
  format?: 'locale' | 'date' | 'time' | 'year'
  options?: Intl.DateTimeFormatOptions
  locale?: string
  className?: string
}

/**
 * Componente para renderizar fechas de forma segura en Next.js,
 * evitando errores de hidratación (discrepancia entre servidor y cliente).
 */
export default function HydratedDate({
  date,
  format = 'locale',
  options,
  locale = 'es-PE',
  className
}: HydratedDateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!date) return null

  // En el servidor (o antes de montar), renderizamos un span vacío o un placeholder
  // para evitar que el string difiera del que generará el cliente.
  if (!mounted) {
    return <span className={className}>...</span>
  }

  const dateObj = new Date(date)
  
  // Si la fecha es inválida, no renderizamos nada
  if (isNaN(dateObj.getTime())) return null

  let formatted = ''

  try {
    switch (format) {
      case 'date':
        formatted = dateObj.toLocaleDateString(locale, options)
        break
      case 'time':
        formatted = dateObj.toLocaleTimeString(locale, options)
        break
      case 'year':
        formatted = dateObj.getFullYear().toString()
        break
      case 'locale':
      default:
        formatted = dateObj.toLocaleString(locale, options)
        break
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    formatted = String(date)
  }

  return <span className={className}>{formatted}</span>
}
