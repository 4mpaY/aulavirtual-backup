'use client'

/* ─────────────────────────────────────────────
   TeachersSection
   Grid de profesores con datos reales de la BD.
   Recibe `teachers` como prop (server-fetched).
   ───────────────────────────────────────────── */

import Link from 'next/link'

import { ArrowRight, BookOpen } from 'lucide-react'

import ScrollReveal from './ScrollReveal'
import { eyebrowDark, sectionH2Dark, sectionDescDark, cardTitle, cardBody, smallText } from './typography'

interface Teacher {
  id: string
  nombre: string
  apellido: string
  avatar?: string | null
  cargo?: string | null
  biografia?: string | null
  _count: { cursos_dictados: number }
}

interface Props {
  teachers: Teacher[]
}

function TeacherCard({ teacher, index }: { teacher: Teacher; index: number }) {
  const fullName = `${teacher.nombre} ${teacher.apellido}`
  const initials = `${teacher.nombre[0]}${teacher.apellido[0]}`.toUpperCase()

  // Colores de fondo para el avatar inicial, cíclicos
  const avatarColors = ['#25927F', '#025E44', '#3AB079', '#BDD962']
  const avatarBg = avatarColors[index % avatarColors.length]
  const avatarFg = avatarBg === '#BDD962' ? '#0A0A0A' : '#ffffff'

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        className="group"
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement

          el.style.transform = 'translateY(-8px)'
          el.style.borderColor = '#25927F'
          el.style.boxShadow = '0 20px 50px rgba(37,146,127,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement

          el.style.transform = 'translateY(0)'
          el.style.borderColor = 'rgba(255,255,255,0.06)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Foto / avatar */}
        <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
          {teacher.avatar ? (
            <img
              src={teacher.avatar}
              alt={fullName}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${avatarBg}cc 0%, ${avatarBg} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '3rem', color: avatarFg, opacity: 0.9 }}>
                {initials}
              </span>
            </div>
          )}

          {/* Gradiente inferior */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, #1a1a2e 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Badge de cursos */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(10,10,10,0.7)',
              backdropFilter: 'blur(8px)',
              borderRadius: '999px',
              padding: '4px 10px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <BookOpen size={11} color="#BDD962" />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.625rem', color: '#BDD962', fontWeight: 700 }}>
              {teacher._count.cursos_dictados} {teacher._count.cursos_dictados === 1 ? 'curso' : 'cursos'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            {fullName}
          </h3>
          {teacher.cargo && (
            <p style={{ ...smallText, color: '#25927F', fontWeight: 600, marginBottom: '0.5rem' }}>
              {teacher.cargo}
            </p>
          )}
          {teacher.biografia && (
            <p
              style={{
                ...cardBody,
                color: 'rgba(255,255,255,0.4)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {teacher.biografia}
            </p>
          )}
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function TeachersSection({ teachers }: Props) {
  if (!teachers || teachers.length === 0) return null

  return (
    <section style={{ backgroundColor: '#0A0A0A', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <ScrollReveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={eyebrowDark}>Nuestro equipo</p>
              <h2 style={sectionH2Dark}>Aprende con los mejores</h2>
              <p style={sectionDescDark}>Profesionales con amplia experiencia en sus áreas</p>
            </div>
            <Link
              href="/docentes"
              className="no-underline inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#25927F' }}
            >
              Ver todos los docentes <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {teachers.map((teacher, i) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
