'use client'

/* ─────────────────────────────────────────────
   TeachersSection
   Carrusel de docentes de alta gama con estética
   verde característica de AGENDA 2050 PERÚ.
   ───────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react'

import Link from 'next/link'

import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, GraduationCap, Sparkles, Award } from 'lucide-react'

import ScrollReveal from './ScrollReveal'

interface Teacher {
  id: string
  nombre: string
  apellido: string
  avatar?: string | null
  cargo?: string | null
  biografia?: string | null
  _count?: { cursos_dictados: number }
}

interface Props {
  teachers: Teacher[]
}

function stripHtml(html?: string | null): string {
  if (!html) return ''

  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
}

function TeacherCard({ teacher, index }: { teacher: Teacher; index: number }) {
  const fullName = `${teacher.nombre} ${teacher.apellido}`
  const initials = `${teacher.nombre[0] || ''}${teacher.apellido[0] || ''}`.toUpperCase()
  const cursosCount = teacher._count?.cursos_dictados ?? 0
  const cleanBio = stripHtml(teacher.biografia)

  // Colores de respaldo para avatares sin foto
  const avatarGradients = [
    'linear-gradient(135deg, #012d22 0%, #025E44 100%)',
    'linear-gradient(135deg, #025E44 0%, #25927F 100%)',
    'linear-gradient(135deg, #013b2c 0%, #157359 100%)',
  ]

  const avatarBg = avatarGradients[index % avatarGradients.length]

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #02382a 0%, #01241c 100%)',
        borderRadius: '2rem',
        overflow: 'hidden',
        border: '1.5px solid rgba(37, 146, 127, 0.25)',
        boxShadow: '0 15px 35px rgba(1, 25, 19, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget

        el.style.transform = 'translateY(-8px)'
        el.style.borderColor = '#BDD962'
        el.style.boxShadow = '0 25px 50px rgba(1, 45, 34, 0.6), 0 0 25px rgba(189, 217, 98, 0.15)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget

        el.style.transform = 'translateY(0)'
        el.style.borderColor = 'rgba(37, 146, 127, 0.25)'
        el.style.boxShadow = '0 15px 35px rgba(1, 25, 19, 0.4)'
      }}
    >
      {/* Contenedor de Foto Grande y Elegante */}
      <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', background: '#011c15' }}>
        {teacher.avatar ? (
          <img
            src={teacher.avatar}
            alt={fullName}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: avatarBg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(189,217,98,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2.5rem', color: '#BDD962' }}>
                {initials}
              </span>
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Docente Especialista
            </span>
          </div>
        )}

        {/* Gradiente de integración inferior */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, #02382a 0%, rgba(2,56,42,0.6) 40%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge de cursos dictados */}
        {cursosCount > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(1, 45, 34, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '999px',
              padding: '6px 14px',
              border: '1px solid rgba(189, 217, 98, 0.35)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <BookOpen size={14} color="#BDD962" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#BDD962', fontWeight: 800, letterSpacing: '0.02em' }}>
              {cursosCount} {cursosCount === 1 ? 'Curso' : 'Cursos'}
            </span>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(1, 45, 34, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '999px',
              padding: '6px 14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Award size={14} color="#BDD962" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#ffffff', fontWeight: 700 }}>
              Especialista
            </span>
          </div>
        )}
      </div>

      {/* Contenido / Información del Docente */}
      <div style={{ padding: '1.5rem 1.75rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Cargo / Especialidad */}
        {teacher.cargo ? (
          <span
            style={{
              alignSelf: 'flex-start',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#BDD962',
              background: 'rgba(189, 217, 98, 0.12)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              marginBottom: '0.75rem',
              border: '1px solid rgba(189, 217, 98, 0.2)',
            }}
          >
            {teacher.cargo}
          </span>
        ) : (
          <span
            style={{
              alignSelf: 'flex-start',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.08)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              marginBottom: '0.75rem',
            }}
          >
            Docente Especialista
          </span>
        )}

        {/* Nombre Completo */}
        <h3
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '0.65rem',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          {fullName}
        </h3>

        {/* Biografía limpia de etiquetas HTML */}
        {cleanBio ? (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              color: 'rgba(255, 255, 255, 0.72)',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {cleanBio}
          </p>
        ) : (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              color: 'rgba(255, 255, 255, 0.45)',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              fontStyle: 'italic',
            }}
          >
            Especialista líder comprometido con la formación práctica y estratégica de excelencia.
          </p>
        )}

        {/* Footer del card */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#BDD962',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Ver trayectoria <ArrowRight size={14} />
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            Agenda 2050
          </span>
        </div>
      </div>
    </div>
  )
}

export default function TeachersSection({ teachers }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [isHovered, setIsHovered] = useState(false)
  const touchStartX = useRef<number | null>(null)

  // Ajuste responsive de elementos visibles por slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, teachers.length - itemsPerPage)

  // Autoplay continuo cuando no hay hover
  useEffect(() => {
    if (isHovered || teachers.length <= itemsPerPage) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
    }, 4500)

    return () => clearInterval(interval)
  }, [isHovered, maxIndex, teachers.length, itemsPerPage])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }

    touchStartX.current = null
  }

  if (!teachers || teachers.length === 0) return null

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #011d16 0%, #012d22 50%, #011913 100%)',
        padding: '7rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Resplandores y elementos ambientales de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(37, 146, 127, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(189, 217, 98, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-page" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Principal con Controles de Carrusel */}
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3.5rem',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(189, 217, 98, 0.12)',
                  border: '1px solid rgba(189, 217, 98, 0.25)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '999px',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={15} color="#BDD962" />
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#BDD962',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Plana Docente de Excelencia
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: '0 0 0.5rem 0',
                }}
              >
                Aprende con <span style={{ color: '#BDD962' }}>Líderes de la Industria</span>
              </h2>

              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.05rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: '650px',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Especialistas, consultores y directivos con amplia trayectoria en el mercado productivo e institucional.
              </p>
            </div>

            {/* Controles de Navegación del Carrusel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                onClick={handlePrev}
                aria-label="Docente anterior"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#BDD962'
                  e.currentTarget.style.color = '#012d22'
                  e.currentTarget.style.borderColor = '#BDD962'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Siguiente docente"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#BDD962'
                  e.currentTarget.style.color = '#012d22'
                  e.currentTarget.style.borderColor = '#BDD962'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <ChevronRight size={22} />
              </button>

              <Link
                href="/docentes"
                className="hidden sm:inline-flex"
                style={{
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: '#BDD962',
                  background: 'rgba(189, 217, 98, 0.1)',
                  border: '1px solid rgba(189, 217, 98, 0.3)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '999px',
                  marginLeft: '0.5rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#BDD962'
                  e.currentTarget.style.color = '#012d22'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(189, 217, 98, 0.1)'
                  e.currentTarget.style.color = '#BDD962'
                }}
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Ventana del Carrusel */}
        <div
          style={{ overflow: 'hidden', margin: '0 -0.75rem', padding: '0.75rem' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {teachers.map((teacher, i) => (
              <div
                key={teacher.id}
                style={{
                  flex: `0 0 ${100 / itemsPerPage}%`,
                  padding: '0 0.75rem',
                  boxSizing: 'border-box',
                }}
              >
                <TeacherCard teacher={teacher} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Paginador de puntos inferior */}
        {teachers.length > itemsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a slide ${idx + 1}`}
                style={{
                  width: currentIndex === idx ? '28px' : '9px',
                  height: '9px',
                  borderRadius: '999px',
                  background: currentIndex === idx ? '#BDD962' : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Botón Ver Todos en versión móvil */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }} className="sm:hidden">
          <Link
            href="/docentes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#012d22',
              background: '#BDD962',
              padding: '0.85rem 2rem',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            Ver todos los docentes <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
