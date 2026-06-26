'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { Button } from '@sout/components/ui/button'
import type { PublicCourse } from '@sout/lib/getPublicCourses'
import SoutDbCourseCard from '@sout/components/courses/SoutDbCourseCard'

type Props = {
  courses: PublicCourse[]
  limit?: number
}

export default function SoutDbCoursesSection({ courses, limit = 3 }: Props) {
  const featured = courses.slice(0, limit)

  if (featured.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="section-container text-center py-12">
          <p className="text-muted-foreground font-heading">
            Próximamente habrá cursos disponibles en la plataforma.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <span className="inline-block font-heading text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Nuestros Programas
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Cursos de{' '}
            <span className="text-primary">Capacitación Especializada</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Programas certificados disponibles en nuestra plataforma. Inscríbete, compra en línea y accede
            a tu panel de estudiante.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map(course => (
            <SoutDbCourseCard key={course.id} course={course} compact />
          ))}
        </div>

        {courses.length > limit ? (
          <div className="text-center mt-12">
            <Link href="/cursos">
              <Button variant="hero" size="lg">
                Ver todos los cursos
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
