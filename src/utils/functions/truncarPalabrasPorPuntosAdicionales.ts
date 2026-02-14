export function truncarPalabrasPorPuntosAdicionales(texto: string, max = 14): string {
  const limpio = texto.trim()

  return limpio.length <= max ? limpio : limpio.slice(0, max) + '...'
}
