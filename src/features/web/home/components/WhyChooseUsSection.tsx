'use client'

/* ─────────────────────────────────────────────
   WhyChooseUsSection — grid 2x3 de tarjetas
   ("¿Por qué elegirnos?"), contenido 100%
   administrable (icono + título + descripción).
   ───────────────────────────────────────────── */

import type { LucideIcon } from 'lucide-react'
import { Presentation, GraduationCap, Monitor, ClipboardList, FileCheck, BookOpen, Award, Users, Star, ShieldCheck, Clock, Video } from 'lucide-react'

import ScrollReveal from './ScrollReveal'
import { sectionH2, cardTitle, cardBody } from './typography'

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
    <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ ...sectionH2, textAlign: 'center' }}>¿Por qué elegirnos?</h2>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {cards.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <WhyCard item={item} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCard({ item }: { item: WhyChooseUsItem }) {
  const Icon = WHY_CHOOSE_US_ICONS[item.icono] || Award

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        padding: '2rem 1.75rem',
        border: '1.5px solid hsl(214,20%,91%)',
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 12px 36px rgba(var(--web-primary-rgb, 37, 146, 127),0.12)'
        el.style.borderColor = 'var(--web-primary, #25927F)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'hsl(214,20%,91%)'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={26} color="var(--web-primary, #25927F)" />
      </div>
      <h3 style={{ ...cardTitle, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>{item.titulo}</h3>
      <p style={cardBody}>{item.descripcion}</p>
    </div>
  )
}
