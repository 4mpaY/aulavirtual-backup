import type { Categoria } from '../entity/Categoria'

export type CategoriaSelection = {
  padreId: string
  subId: string
  subSubId: string
}

/** Resuelve el ID guardado en curso hacia los 3 niveles del selector. */
export function resolveCategoriaSelection(
  categoriaId: string | null | undefined,
  categorias: Categoria[]
): CategoriaSelection {
  if (!categoriaId) return { padreId: '', subId: '', subSubId: '' }

  const asParent = categorias.find(c => c.id === categoriaId)

  if (asParent) return { padreId: categoriaId, subId: '', subSubId: '' }

  for (const cat of categorias) {
    for (const sub of cat.hijos ?? []) {
      if (sub.id === categoriaId) {
        return { padreId: cat.id, subId: categoriaId, subSubId: '' }
      }

      const subSub = sub.hijos?.find(h => h.id === categoriaId)

      if (subSub) {
        return { padreId: cat.id, subId: sub.id, subSubId: categoriaId }
      }
    }
  }

  return { padreId: '', subId: '', subSubId: '' }
}

/** ID más específico seleccionado (sub-sub > sub > padre). */
export function resolveCategoriaId(selection: CategoriaSelection): string {
  return selection.subSubId || selection.subId || selection.padreId || ''
}

/** IDs de categoría que deben coincidir al filtrar (nivel seleccionado + descendientes). */
export function getCategoriaFilterIds(
  categorias: Categoria[],
  selection: CategoriaSelection
): string[] {
  const targetId = resolveCategoriaId(selection)

  if (!targetId) return []

  const padre = categorias.find(c => c.id === selection.padreId)

  if (!padre) return [targetId]

  if (selection.subSubId) return [selection.subSubId]

  if (selection.subId) {
    const sub = padre.hijos?.find(h => h.id === selection.subId)
    const ids = [selection.subId]

    for (const nieto of sub?.hijos ?? []) {
      ids.push(nieto.id)
    }

    return ids
  }

  const ids = [selection.padreId]

  for (const sub of padre.hijos ?? []) {
    ids.push(sub.id)

    for (const nieto of sub.hijos ?? []) {
      ids.push(nieto.id)
    }
  }

  return ids
}

export function countSubcategorias(categorias: Categoria[]): number {
  return categorias.reduce((acc, cat) => acc + (cat.hijos?.length ?? 0), 0)
}

export function countSubSubcategorias(categorias: Categoria[]): number {
  return categorias.reduce(
    (acc, cat) =>
      acc + (cat.hijos ?? []).reduce((subAcc, sub) => subAcc + (sub.hijos?.length ?? 0), 0),
    0
  )
}

type CategoriaSlugNode = {
  id: string
  slug: string
  hijos?: CategoriaSlugNode[]
}

/** Busca un slug en el árbol y devuelve la selección de los 3 niveles. */
export function resolveCategoriaSelectionBySlug(
  slug: string | null | undefined,
  categorias: CategoriaSlugNode[]
): CategoriaSelection {
  if (!slug) return { padreId: '', subId: '', subSubId: '' }

  for (const cat of categorias) {
    if (cat.slug === slug) return { padreId: cat.id, subId: '', subSubId: '' }

    for (const sub of cat.hijos ?? []) {
      if (sub.slug === slug) return { padreId: cat.id, subId: sub.id, subSubId: '' }

      for (const subSub of sub.hijos ?? []) {
        if (subSub.slug === slug) {
          return { padreId: cat.id, subId: sub.id, subSubId: subSub.id }
        }
      }
    }
  }

  return { padreId: '', subId: '', subSubId: '' }
}

export function getCategoriaSlugFromSelection(
  categorias: CategoriaSlugNode[],
  selection: CategoriaSelection
): string | null {
  const id = resolveCategoriaId(selection)

  if (!id) return null

  for (const cat of categorias) {
    if (cat.id === id) return cat.slug

    for (const sub of cat.hijos ?? []) {
      if (sub.id === id) return sub.slug

      for (const subSub of sub.hijos ?? []) {
        if (subSub.id === id) return subSub.slug
      }
    }
  }

  return null
}
