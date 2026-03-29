/**
 * Genera un slug a partir de un texto amigable para URL
 */
export function generateSlug(text: string): string {
  if (!text) return ''

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Genera un slug único para un modelo específico consultando la base de datos
 */
export async function generateUniqueSlug(text: string, model: any, excludeId?: string): Promise<string> {
  const slug = generateSlug(text)
  let counter = 0
  let candidateSlug = slug

  while (true) {
    const existing = await model.findUnique({
      where: { slug: candidateSlug }
    })

    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidateSlug
    }

    counter++
    candidateSlug = `${slug}-${counter}`
  }
}
