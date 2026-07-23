'use client'

/* ─────────────────────────────────────────────
   WhyChooseUsSection — grid 2x3 de tarjetas
   ("¿Por qué elegirnos?"), contenido 100%
   administrable (icono + título + descripción).
   ───────────────────────────────────────────── */

import { useRef } from 'react'

import type { LucideIcon } from 'lucide-react'
import { Presentation, GraduationCap, Monitor, ClipboardList, FileCheck, BookOpen, Award, Users, Star, ShieldCheck, Clock, Video } from 'lucide-react'

import ScrollReveal from './ScrollReveal'
import { eyebrow, sectionH2, cardTitle, cardBody } from './typography'

export const WHY_CHOOSE_US_ICONS: Record<string, LucideIcon> = {
  Presentation,
  GraduationCap,
  Monitor,
  ClipboardList,
  FileCheck,
  BookOpen,
  Award,
  Users,
  Star,
  ShieldCheck,
  Clock,
  Video,
}

export interface WhyChooseUsItem {
  icono: string
  titulo: string
  descripcion: string
}

const DEFAULT_ITEMS: WhyChooseUsItem[] = [
  { icono: 'Presentation', titulo: 'Clases en vivo', descripcion: 'Contamos con las mejores clases online con nuestros especialistas.' },
  { icono: 'GraduationCap', titulo: 'Asesoría Académica', descripcion: 'Contamos con un foro de preguntas y respuestas en todos nuestros cursos.' },
  { icono: 'Monitor', titulo: 'Plataforma Virtual', descripcion: 'Finalizado el curso o especialización y una vez obtenida la certificación, contarás con un periodo adicional de acceso a la plataforma virtual, conforme a las políticas académicas vigentes.' },
  { icono: 'ClipboardList', titulo: 'Seguimiento académico', descripcion: 'Realizamos seguimiento y asesoramiento continuo en el proceso de tu aprendizaje.' },
  { icono: 'FileCheck', titulo: 'Certificación Única', descripcion: 'Nuestros certificados cuentan con código único de validación además de un código QR para poder verificar la autenticidad.' },
  { icono: 'BookOpen', titulo: 'Cursos asincrónicos', descripcion: 'Contamos con cursos o especializaciones grabadas con acceso 24/7.' },
]

export default function WhyChooseUsSection({ items }: { items: WhyChooseUsItem[] }) {
  const cards = items.length > 0 ? items : DEFAULT_ITEMS

  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '5.5rem 1rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ ...eyebrow, textAlign: 'center' }}>Beneficios</span>
            <h2 style={{ ...sectionH2, textAlign: 'center' }}>¿Por qué elegirnos?</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <WhyCard item={item} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCard({ item, index }: { item: WhyChooseUsItem; index: number }) {
  const Icon = WHY_CHOOSE_US_ICONS[item.icono] || Award
  const number = String(index + 1).padStart(2, '0')

  const cardRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(-6px)'
      cardRef.current.style.boxShadow = '0 16px 40px rgba(var(--web-primary-rgb, 37, 146, 127),0.14)'
      cardRef.current.style.borderColor = 'var(--web-primary, #25927F)'
    }

    if (accentRef.current) accentRef.current.style.width = '100%'
    if (iconRef.current) iconRef.current.style.transform = 'scale(1.08) rotate(-4deg)'
  }

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(0)'
      cardRef.current.style.boxShadow = 'none'
      cardRef.current.style.borderColor = 'hsl(214,20%,91%)'
    }

    if (accentRef.current) accentRef.current.style.width = '0%'
    if (iconRef.current) iconRef.current.style.transform = 'scale(1) rotate(0deg)'
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.25rem 1.75rem 2rem',
        border: '1.5px solid hsl(214,20%,91%)',
        height: '100%',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Número decorativo */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1.25rem',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '2.75rem',
          fontWeight: 800,
          color: 'hsl(214,20%,94%)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {number}
      </span>

      {/* Icono */}
      <div
        ref={iconRef}
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '15px',
          background: 'linear-gradient(135deg, var(--web-primary, #25927F), var(--web-dark, #025E44))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 20px rgba(var(--web-primary-rgb, 37, 146, 127),0.28)',
          transition: 'transform 0.3s ease',
        }}
      >
        <Icon size={26} color="#ffffff" />
      </div>

      <h3 style={{ ...cardTitle, fontSize: '1.0625rem', marginBottom: '0.5rem', position: 'relative' }}>
        {item.titulo}
      </h3>
      <p style={{ ...cardBody, position: 'relative' }}>{item.descripcion}</p>

      {/* Barra de acento inferior */}
      <div
        ref={accentRef}
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '3px',
          width: '0%',
          background: 'linear-gradient(90deg, var(--web-primary, #25927F), var(--web-light, #BDD962))',
          transition: 'width 0.35s ease',
        }}
      />
    </div>
  )
}
