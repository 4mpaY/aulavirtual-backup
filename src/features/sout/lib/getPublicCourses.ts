import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'

export type PublicCourse = {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  miniatura?: string | null
  precio: number
  precio_falso?: number | null
  moneda: string
  es_gratis: boolean
  es_comprado?: boolean
  nivel?: string | null
  tipo_emision?: string | null
  duracion?: string | null
  profesor: {
    id: string
    slug?: string | null
    nombre: string
    apellido: string
    avatar?: string | null
  }
  categoria?: {
    id: string
    nombre: string
    slug: string
  } | null
  _count?: {
    modulos: number
    lecciones?: number
  }
}

export type PublicCategory = {
  id: string
  nombre: string
  slug: string
}

export async function getPublicCourses(): Promise<{
  courses: PublicCourse[]
  categories: PublicCategory[]
}> {
  const session = await getAuthSession()
  const userId = session?.user?.id ?? null

  const [courses, categories] = await Promise.all([
    prisma.curso.findMany({
      where: { estado: 'PUBLICADO', es_privado: false },
      include: {
        profesor: { select: { id: true, slug: true, nombre: true, apellido: true, avatar: true } },
        categoria: { select: { id: true, nombre: true, slug: true } },
        _count: { select: { modulos: true } },
      },
      orderBy: { orden: 'asc' },
    }),
    prisma.categoria.findMany({
      where: { esta_activo: true },
      select: { id: true, nombre: true, slug: true },
      orderBy: { orden: 'asc' },
    }),
  ])

  let userCourseIds = new Set<string>()

  if (userId) {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuario_id: userId, estado: 'ACTIVO' },
      select: { curso_id: true },
    })
    userCourseIds = new Set(inscripciones.map(i => i.curso_id))
  }

  const coursesWithLecciones = await Promise.all(
    courses.map(async course => {
      const leccionesCount = await prisma.leccion.count({
        where: { modulo: { curso_id: course.id } },
      })

      return {
        ...course,
        precio: Number(course.precio),
        precio_falso: course.precio_falso != null ? Number(course.precio_falso) : null,
        es_comprado: userId ? userCourseIds.has(course.id) : false,
        _count: { ...course._count, lecciones: leccionesCount },
      }
    })
  )

  return { courses: coursesWithLecciones, categories }
}
