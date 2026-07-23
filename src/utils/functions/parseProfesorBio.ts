interface ProfesorBioSummary {
  titulo: string
  descripcion: string
}

/**
 * El formulario de "Perfil Profesional" del docente serializa
 * { titulo, descripcion, ... } dentro de un comentario JSON embebido
 * en `biografia` (ver ProfesorBioEditor.tsx). Esta función extrae
 * el título de especialización y la descripción para mostrarlos
 * en las tarjetas públicas de docentes.
 */
export function parseProfesorBio(biografia?: string | null, cargo?: string | null): ProfesorBioSummary {
  let titulo = cargo || ''
  let descripcion = ''

  if (biografia) {
    const match = biografia.match(/<!--PROFESOR_BIO_JSON:(.*?)-->/)

    if (match) {
      try {
        const parsed = JSON.parse(match[1])

        if (parsed.titulo) titulo = parsed.titulo
        if (parsed.descripcion) descripcion = parsed.descripcion
      } catch {}
    }
  }

  return { titulo, descripcion }
}
