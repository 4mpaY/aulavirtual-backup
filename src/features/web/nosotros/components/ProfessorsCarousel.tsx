'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

import { sectionH2, sectionDesc } from '@/features/web/home/components/typography'

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

function useVisible() {
  const [visible, setVisible] = useState(4)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth

      setVisible(w < 640 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4)
    }

    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [])

  return visible
}

interface ProfessorsCarouselProps {
  teachers: Teacher[]
  title?: string
  subtitle?: string
}

export default function ProfessorsCarousel({
  teachers,
  title = '',
  subtitle = '',
}: ProfessorsCarouselProps) {
  const [current, setCurrent] = useState(0)
  const visible = useVisible()
  const total = teachers.length
  const maxStart = Math.max(0, total - visible)

  useEffect(() => {
    setCurrent(c => Math.min(c, maxStart))
  }, [maxStart])

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(maxStart, c + 1))

  const dots = Math.ceil(total / visible)
  const activeDot = Math.floor(current / visible)

  if (total === 0) return null

  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1.5rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        {subtitle?.trim() && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ ...sectionH2, textAlign: 'center', marginBottom: '0.75rem' }}>
              {title}
            </h2>
            <p style={{ ...sectionDesc, textAlign: 'center', maxWidth: '100%', margin: '0 auto' }}>
              {subtitle}
            </p>
          </div>
        )}

        {/* Carousel */}
        <div style={{ position: 'relative', padding: '0 3rem' }}>
          {/* Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(visible, total)}, minmax(0, 280px))`,
              justifyContent: 'center',
              gap: '1.25rem',
            }}
          >
            {teachers.slice(current, current + visible).map((teacher, i) => {
              const initials = `${teacher.nombre[0]}${teacher.apellido[0]}`
              const color = AVATAR_COLORS[(current + i) % AVATAR_COLORS.length]

              const href = teacherHref(teacher)

              return (
                <Link
                  key={teacher.id}
                  href={href}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1.5px solid hsl(214,20%,91%)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement

                    el.style.transform = 'translateY(-6px)'
                    el.style.boxShadow = '0 12px 36px rgba(var(--web-primary-rgb, 37, 146, 127),0.13)'
                    el.style.borderColor = 'var(--web-primary, #25927F)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement

                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                    el.style.borderColor = 'hsl(214,20%,91%)'
                  }}
                >
                  {/* Photo — cuadrado perfecto con padding-top hack */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: `${color}14`, overflow: 'hidden' }}>
                    {teacher.avatar ? (
                      <Image
                        src={teacher.avatar}
                        alt={`${teacher.nombre} ${teacher.apellido}`}
                        fill
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
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1.75rem',
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

                  {/* Info */}
                  <div style={{ padding: '1.25rem 1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#0A0A0A',
                        lineHeight: 1.35,
                        marginBottom: '0.375rem',
                      }}
                    >
                      {teacher.nombre} {teacher.apellido}
                    </h3>

                    {teacher.cargo && (
                      <p
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.8rem',
                          color: '#64748b',
                          lineHeight: 1.45,
                          marginBottom: '1rem',
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
                    <Link
                      href={href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        padding: '0.625rem 1rem',
                        borderRadius: '999px',
                        backgroundColor: 'transparent',
                        color: '#0A0A0A',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: '1.5px solid #d1d5db',
                        transition: 'all 0.2s',
                        marginTop: 'auto',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement

                        el.style.borderColor = 'var(--web-primary, #25927F)'
                        el.style.color = 'var(--web-primary, #25927F)'
                        el.style.backgroundColor = 'rgba(var(--web-primary-rgb, 37, 146, 127),0.05)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement

                        el.style.borderColor = '#d1d5db'
                        el.style.color = '#0A0A0A'
                        el.style.backgroundColor = 'transparent'
                      }}
                    >
                      <ChevronDown size={14} />
                      Ver cursos
                    </Link>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Arrows */}
          {total > visible && (
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

        {/* Dots */}
        {dots > 1 && (
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
