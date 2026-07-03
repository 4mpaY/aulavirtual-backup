export type ExamenNotaInput = {
  id: string
  titulo: string
  peso: number
  orden: number | null
  modulo_id: string | null
  modulo_orden: number | null
}

export type EvaluacionNota = {
  numero: number
  examen_id: string
  descripcion: string
  peso: number
  puntaje_porcentaje: number
  nota: number
}

export type ResumenNotasCurso = {
  evaluaciones: EvaluacionNota[]
  evaluaciones_realizadas: number
  total_evaluaciones: number
  promedio_porcentaje: number
  promedio: number
}

/** Convierte porcentaje (0-100) a escala vigesimal peruana (0-20). */
export function porcentajeAVigesimal(porcentaje: number): number {
  return Math.round(porcentaje * 0.2 * 100) / 100
}

export function calcularMejoresIntentos(
  intentos: Array<{ examen_id: string; puntaje: number | null }>
): Record<string, number> {
  const mejores: Record<string, number> = {}

  intentos.forEach(intento => {
    const puntaje = intento.puntaje ?? 0

    if (mejores[intento.examen_id] === undefined || puntaje > mejores[intento.examen_id]) {
      mejores[intento.examen_id] = puntaje
    }
  })

  return mejores
}

export function ordenarExamenes<T extends ExamenNotaInput>(examenes: T[]): T[] {
  return [...examenes].sort((a, b) => {
    const modA = a.modulo_orden ?? 999
    const modB = b.modulo_orden ?? 999

    if (modA !== modB) return modA - modB

    const ordA = a.orden ?? 999
    const ordB = b.orden ?? 999

    return ordA - ordB
  })
}

export function calcularResumenNotasCurso(
  examenes: ExamenNotaInput[],
  mejoresIntentos: Record<string, number>,
  notaFinalInscripcion: number | null = null
): ResumenNotasCurso {
  const ordenados = ordenarExamenes(examenes)

  const evaluaciones: EvaluacionNota[] = ordenados.map((ex, index) => {
    const puntajePorcentaje = mejoresIntentos[ex.id] ?? 0

    return {
      numero: index + 1,
      examen_id: ex.id,
      descripcion: ex.titulo,
      peso: ex.peso,
      puntaje_porcentaje: puntajePorcentaje,
      nota: porcentajeAVigesimal(puntajePorcentaje)
    }
  })

  let sumaPonderada = 0
  let pesoTotal = 0

  ordenados.forEach(ex => {
    const puntaje = mejoresIntentos[ex.id] ?? 0

    sumaPonderada += puntaje * ex.peso
    pesoTotal += ex.peso
  })

  const evaluacionesRealizadas = ordenados.filter(ex => mejoresIntentos[ex.id] !== undefined).length
  const promedioPorcentaje = pesoTotal > 0 ? sumaPonderada / pesoTotal : 0
  const promedioCalculado = porcentajeAVigesimal(promedioPorcentaje)

  const promedio =
    notaFinalInscripcion !== null
      ? porcentajeAVigesimal(notaFinalInscripcion)
      : evaluacionesRealizadas > 0
        ? promedioCalculado
        : 0

  return {
    evaluaciones,
    evaluaciones_realizadas: evaluacionesRealizadas,
    total_evaluaciones: ordenados.length,
    promedio_porcentaje: promedioPorcentaje,
    promedio
  }
}

export function obtenerPeriodoAcademico(fecha: Date): string {
  const year = fecha.getFullYear()
  const semestre = fecha.getMonth() + 1 <= 6 ? 'I' : 'II'

  return `${year} - ${semestre}`
}

export function obtenerAnioAcademico(fecha: Date): number {
  return fecha.getFullYear()
}

export function formatearFechaNota(fecha: Date): string {
  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
