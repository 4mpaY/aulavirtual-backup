'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BookOpen, Users, ArrowRight } from 'lucide-react'

import CourseThumbnail from '@/utils/components/CourseThumbnail'
import UserAvatar from '@/utils/components/UserAvatar'

interface Course {
  id: string
  titulo: string
  slug: string
  miniatura?: string
  precio: number
  moneda: string
  es_gratis: boolean
  nivel?: string
  tipo_emision?: string
  profesor: { nombre: string; apellido: string; avatar?: string }
  categoria?: { nombre: string }
  _count?: { lecciones: number; inscripciones: number }
}

interface Props {
  courses: Course[]
}

const nivelLabel: Record<string, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
}

export default function HomeCoursesSection({ courses }: Props) {
  const router = useRouter()

  if (courses.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'hsl(215, 16%, 47%)', fontFamily: 'Poppins, sans-serif' }}>
        <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
        <p>Próximamente habrá cursos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div
          key={course.id}
          onClick={() => router.push(`/cursos/${course.slug}`)}
          className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          style={{ border: '1px solid hsl(214, 20%, 88%)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          {/* Thumbnail */}
          <div className="relative overflow-hidden group/thumb" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0">
              <CourseThumbnail
                src={course.miniatura}
                title={course.titulo}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: 'rgba(var(--web-dark-rgb, 2, 94, 68),0.82)', zIndex: 3 }}
            >
              <Link
                href={`/cursos/${course.slug}`}
                onClick={e => e.stopPropagation()}
                className="no-underline inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: 'var(--web-light, #BDD962)',
                  color: '#0A0A0A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                Ver curso <ArrowRight size={14} />
              </Link>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {course.tipo_emision === 'SINCRONO' && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#ef4444', fontFamily: 'Poppins, sans-serif' }}
                >
                  En vivo
                </span>
              )}
            </div>
            {course.nivel && (
              <div className="absolute top-3 right-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--web-primary, #25927F)', fontFamily: 'Poppins, sans-serif' }}
                >
                  {nivelLabel[course.nivel] ?? course.nivel}
                </span>
              </div>
            )}

            {/* Enrollment count */}
            {(course._count?.inscripciones ?? 0) > 0 && (
              <div
                className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-bold"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', fontFamily: 'Poppins, sans-serif' }}
              >
                <Users size={13} />
                {course._count?.inscripciones}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-3">
            {course.categoria && (
              <span
                className="inline-block self-start px-2.5 py-0.5 rounded text-xs font-bold uppercase"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)',
                  color: 'var(--web-dark, #025E44)',
                }}
              >
                {course.categoria.nombre}
              </span>
            )}

            <Link
              href={`/cursos/${course.slug}`}
              onClick={e => e.stopPropagation()}
              className="no-underline font-bold leading-tight transition-colors"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1rem',
                color: '#0A0A0A',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '48px',
              }}
            >
              {course.titulo}
            </Link>

            <div className="flex items-center gap-2">
              <UserAvatar
                src={course.profesor.avatar}
                name={`${course.profesor.nombre} ${course.profesor.apellido}`}
                size={24}
              />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'hsl(215, 16%, 47%)', fontWeight: 500 }}>
                {course.profesor.nombre} {course.profesor.apellido}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid hsl(214, 20%, 92%)' }}>
              <span
                className="font-bold text-lg"
                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--web-primary, #25927F)' }}
              >
                {course.es_gratis ? 'Gratis' : `${course.moneda} ${Number(course.precio).toFixed(2)}`}
              </span>
              <Link
                href={`/cursos/${course.slug}`}
                onClick={e => e.stopPropagation()}
                className="no-underline inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: 'var(--web-primary, #25927F)',
                  color: '#ffffff',
                }}
              >
                Ver curso <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
