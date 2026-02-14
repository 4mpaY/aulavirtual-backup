export function fechaParsePeru(fecha: Date | string | null): string {
  if (!fecha) return 'Sin fecha'

  const d = new Date(fecha)

  // Extrae los componentes
  const dia = d.getUTCDate()
  const anio = d.getUTCFullYear()
  
  const mesNombre = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ][d.getUTCMonth()]

  return `${dia} de ${mesNombre} de ${anio}`
}
