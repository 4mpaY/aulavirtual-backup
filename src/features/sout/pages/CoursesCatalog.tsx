'use client'

import { useMemo, useState } from 'react'

import { Filter, Search, X } from 'lucide-react'

import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'
import PageHero from '@sout/components/layout/PageHero'
import SoutDbCourseCard from '@sout/components/courses/SoutDbCourseCard'
import { Input } from '@sout/components/ui/input'
import type { PublicCategory, PublicCourse } from '@sout/lib/getPublicCourses'

type Props = {
  courses: PublicCourse[]
  categories: PublicCategory[]
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function courseMatchesSearch(course: PublicCourse, query: string) {
  if (!query) return true

  const haystack = normalizeSearch(
    [
      course.titulo,
      course.descripcion ?? '',
      course.categoria?.nombre ?? '',
      course.profesor.nombre,
      course.profesor.apellido,
      course.nivel ?? '',
    ].join(' ')
  )

  return haystack.includes(query)
}

export default function SoutCoursesCatalog({ courses, categories }: Props) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = useMemo(() => normalizeSearch(searchQuery), [searchQuery])

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const categoryMatch =
        categoryFilter === 'all' ||
        course.categoria?.slug === categoryFilter ||
        course.categoria?.id === categoryFilter

      return categoryMatch && courseMatchesSearch(course, normalizedQuery)
    })
  }, [courses, categoryFilter, normalizedQuery])

  const hasActiveFilters = categoryFilter !== 'all' || searchQuery.trim().length > 0

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero
          size="lg"
          className="sout-page-hero--with-filters"
          eyebrow="Nuestros Programas"
          title={
            <>
              Cursos de <span className="text-primary">Capacitación Especializada</span>
            </>
          }
          description="Programas certificados internacionalmente para formar profesionales competentes en seguridad vial, manejo defensivo y prevención de riesgos."
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
          }
        />

        <section className="sout-catalog-filters sticky top-[var(--sout-header-height)] z-40 border-b border-border bg-muted">
          <div className="section-container">
            <div className="sout-catalog-filters__row flex flex-col sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative min-w-0 flex-1 sm:max-w-md sm:min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar cursos..."
                  className="sout-catalog-search h-9 pl-9 pr-9 font-heading text-sm"
                  aria-label="Buscar cursos"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {categories.length > 0 ? (
                <div className="flex items-center gap-2 sm:shrink-0">
                  <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
                    <Filter className="h-4 w-4" />
                    <span className="font-heading text-sm font-semibold whitespace-nowrap">Categoría</span>
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="sout-catalog-select h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-heading focus:ring-2 focus:ring-primary sm:min-w-[180px] sm:flex-none"
                    aria-label="Filtrar por categoría"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-2 sm:ml-auto sm:justify-end">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setCategoryFilter('all')
                    }}
                    className="font-heading text-xs font-medium text-primary underline-offset-2 hover:underline sm:text-sm"
                  >
                    Limpiar filtros
                  </button>
                ) : null}
                <span className="font-heading text-xs text-muted-foreground whitespace-nowrap sm:text-sm">
                  {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="sout-catalog-content bg-background">
          <div className="section-container">
            {filteredCourses.length === 0 ? (
              <div className="py-10 text-center font-heading text-muted-foreground">
                {hasActiveFilters
                  ? 'No se encontraron cursos con esos criterios. Prueba otra búsqueda o categoría.'
                  : 'No hay cursos disponibles por el momento.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map(course => (
                  <SoutDbCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
