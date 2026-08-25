export interface PreguntaActividadEvaluable {
  id: string
  texto: string
  puntos: number
  orden: number
  opciones: Array<{ id: string; texto: string; es_correcta: boolean; orden: number }>
}

export interface RespuestaActividadEvaluable {
  pregunta_id: string
  opcion_id: string
  opcion_texto?: string
}

export interface DetalleRevisionPregunta {
  preguntaId: string
  esCorrecta: boolean
  puntosObtenidos: number
  puntosPregunta: number
  opcionSeleccionadaId: string | null
  opcionCorrectaId: string | null
}

export interface ResultadoRevisionActividad {
  nota: number
  correctas: number
  totalPreguntas: number
  puntosObtenidos: number
  puntosPosibles: number
  detalle: DetalleRevisionPregunta[]
}

export function evaluarRespuestasActividad(
  preguntas: PreguntaActividadEvaluable[],
  respuestas: RespuestaActividadEvaluable[] | null | undefined,
  puntajeMaximo: number
): ResultadoRevisionActividad {
  const respMap = new Map((respuestas || []).map(r => [r.pregunta_id, r.opcion_id]))

  let puntosObtenidos = 0
  let puntosPosibles = 0
  let correctas = 0

  const detalle = preguntas.map(p => {
    puntosPosibles += p.puntos
    const seleccionada = respMap.get(p.id) ?? null
    const opcionCorrecta = p.opciones.find(o => o.es_correcta)
    const esCorrecta = !!(seleccionada && opcionCorrecta && seleccionada === opcionCorrecta.id)
    const pts = esCorrecta ? p.puntos : 0

    if (esCorrecta) correctas += 1
    puntosObtenidos += pts

    return {
      preguntaId: p.id,
      esCorrecta,
      puntosObtenidos: pts,
      puntosPregunta: p.puntos,
      opcionSeleccionadaId: seleccionada,
      opcionCorrectaId: opcionCorrecta?.id ?? null
    }
  })

  const nota =
    puntosPosibles > 0
      ? Math.round((puntosObtenidos / puntosPosibles) * puntajeMaximo * 100) / 100
      : 0

  return {
    nota,
    correctas,
    totalPreguntas: preguntas.length,
    puntosObtenidos,
    puntosPosibles,
    detalle
  }
}

export function getFileIconClass(nombre: string) {
  const ext = nombre.split('.').pop()?.toLowerCase() ?? ''

  if (ext === 'pdf') return 'tabler-file-type-pdf text-red-600'
  if (['doc', 'docx'].includes(ext)) return 'tabler-file-type-docx text-blue-600'
  if (['xls', 'xlsx'].includes(ext)) return 'tabler-file-type-xlsx text-green-600'
  if (['zip', 'rar'].includes(ext)) return 'tabler-file-zip text-amber-600'
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'tabler-photo text-purple-600'

  return 'tabler-file text-slate-500'
}

export function isPdfFile(nombre: string) {
  return nombre.split('.').pop()?.toLowerCase() === 'pdf'
}
