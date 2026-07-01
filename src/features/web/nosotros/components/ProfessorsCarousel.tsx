'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

import { eyebrow, sectionH2, sectionDesc } from '@/features/web/home/components/typography'

type Teacher = {
  id: string
  nombre: string
  apellido: string
  slug: string | null
  avatar: string | null
  cargo: string | null
  biografia: string | null
  _count: { cursos_dictados: number }
}

function teacherHref(t: Teacher) {
  return t.slug ? `/docentes/${t.slug}` : `/docentes/${t.id}`
}

const AVATAR_COLORS = [
  'var(--web-primary, #25927F)', 'var(--web-dark, #025E44)', '#3AB079', '#0f4438',
  '#1a73e8', '#d93025', '#e37400', '#6d4c41', '#4527a0', '#00838f',
]

function useVisible(compact: boolean) {
  const [visible, setVisible] = useState(compact ? 3 : 4)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth

      if (compact) {
        setVisible(w < 640 ? 1 : 3)

        return
      }

      setVisible(w < 640 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4)
    }

    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [compact])

  return visible
}

type TeacherCardProps = {
  teacher: Teacher
  href: string
  color: string
  compact: boolean
}

function TeacherCard({ teacher, href, color, compact }: TeacherCardProps) {
  const initials = `${teacher.nombre[0]}${teacher.apellido[0]}`

  return (
    <Link
      href={href}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: compact ? '12px' : '16px',
        overflow: 'hidden',
        border: '1.5px solid hsl(214,20%,91%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        cursor: 'pointer',
        maxWidth: compact ? '280px' : undefined,
        width: '100%',
        justifySelf: compact ? 'center' : undefined,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement

        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 10px 28px rgba(var(--web-primary-rgb, 37, 146, 127),0.12)'
        el.style.borderColor = 'var(--web-primary, #25927F)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
        el.style.borderColor = 'hsl(214,20%,91%)'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: compact ? '72%' : '100%',
          backgroundColor: `${color}14`,
          overflow: 'hidden',
        }}
      >
        {teacher.avatar ? (
          <Image
            src={teacher.avatar}
            alt={`${teacher.nombre} ${teacher.apellido}`}
            fill
            sizes={compact ? '280px' : '320px'}
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: compact ? '56px' : '80px',
                height: compact ? '56px' : '80px',
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif',
                fontSize: compact ? '1.125rem' : '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                border: '3px solid rgba(255,255,255,0.5)',
                boxShadow: `0 4px 20px ${color}44`,
              }}
            >
              {initials}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: compact ? '0.75rem 0.875rem 1rem' : '1.25rem 1.25rem 1.5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: compact ? '0.8125rem' : '0.9375rem',
            fontWeight: 700,
            color: '#0A0A0A',
            lineHeight: 1.35,
            marginBottom: '0.25rem',
          }}
        >
          {teacher.nombre} {teacher.apellido}
        </h3>

        {teacher.cargo && (
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: compact ? '0.6875rem' : '0.8rem',
              color: '#64748b',
              lineHeight: 1.45,
              marginBottom: compact ? '0.75rem' : '1rem',
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {teacher.cargo}
          </p>
        )}

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            padding: compact ? '0.45rem 0.75rem' : '0.625rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'transparent',
            color: '#0A0A0A',
            fontFamily: 'Poppins, sans-serif',
            fontSize: compact ? '0.6875rem' : '0.8125rem',
            fontWeight: 600,
            border: '1.5px solid #d1d5db',
            marginTop: 'auto',
          }}
        >
          <ChevronDown size={compact ? 12 : 14} />
          Ver más
        </span>
      </div>
    </Link>
  )
}

export default function ProfessorsCarousel({
  teachers,
  compact = false,
}: {
  teachers: Teacher[]
  compact?: boolean
}) {
  const [current, setCurrent] = useState(0)
  const visible = useVisible(compact)
  const total = teachers.length
  const showAll = compact || total <= visible
  const maxStart = Math.max(0, total - visible)

  useEffect(() => {
    setCurrent(c => Math.min(c, maxStart))
  }, [maxStart])

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(maxStart, c + 1))

  const dots = Math.ceil(total / visible)
  const activeDot = Math.floor(current / visible)
  const displayed = showAll ? teachers : teachers.slice(current, current + visible)

  if (total === 0) return null

  return (
    <section
      style={{
        backgroundColor: '#f8fafc',
        padding: compact ? '3.5rem 1rem' : '5rem 1.5rem',
        borderTop: '1px solid hsl(214,20%,92%)',
      }}
    >
      <div style={{ maxWidth: compact ? '960px' : '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: compact ? '2rem' : '3rem' }}>
          <p style={{ ...eyebrow, display: 'block', textAlign: 'center' }}>
            Nuestro equipo docente
          </p>
          <h2 style={{ ...sectionH2, textAlign: 'center', marginBottom: '0.75rem' }}>
            Nuestros Profesores
          </h2>
          <p style={{ ...sectionDesc, textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
            Aprende de profesionales con amplia experiencia en el sector industrial y académico.
          </p>
        </div>

        <div style={{ position: 'relative', padding: showAll ? 0 : '0 3rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: compact
                ? `repeat(${Math.min(visible, total)}, minmax(0, 1fr))`
                : `repeat(${Math.min(visible, total)}, 1fr)`,
              gap: compact ? '1rem' : '1.25rem',
              justifyItems: compact ? 'center' : 'stretch',
            }}
          >
            {displayed.map((teacher, i) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                href={teacherHref(teacher)}
                color={AVATAR_COLORS[(showAll ? i : current + i) % AVATAR_COLORS.length]}
                compact={compact}
              />
            ))}
          </div>

          {!showAll && total > visible && (
            <>
              <button
                onClick={prev}
                disabled={current === 0}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '45%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: `1.5px solid ${current === 0 ? '#e2e8f0' : 'var(--web-primary, #25927F)'}`,
                  cursor: current === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                  zIndex: 2,
                }}
              >
                <ChevronLeft size={18} color={current === 0 ? '#cbd5e1' : 'var(--web-primary, #25927F)'} />
              </button>
              <button
                onClick={next}
                disabled={current >= maxStart}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: `1.5px solid ${current >= maxStart ? '#e2e8f0' : 'var(--web-primary, #25927F)'}`,
                  cursor: current >= maxStart ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                  zIndex: 2,
                }}
              >
                <ChevronRight size={18} color={current >= maxStart ? '#cbd5e1' : 'var(--web-primary, #25927F)'} />
              </button>
            </>
          )}
        </div>

        {!showAll && dots > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '2rem' }}>
            {Array.from({ length: dots }).map((_, di) => (
              <button
                key={di}
                onClick={() => setCurrent(di * visible)}
                style={{
                  width: di === activeDot ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: di === activeDot ? 'var(--web-primary, #25927F)' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
