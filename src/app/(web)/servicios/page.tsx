import Link from 'next/link'

import { Stethoscope, ArrowRight, CheckCircle, Phone, ClipboardList, Users, ShieldCheck } from 'lucide-react'

import PageHeader from '@/utils/components/layout/web/PageHeader'

export const metadata = {
  title: 'Salud Ocupacional - SSMAT',
  description: 'Servicio integral de salud ocupacional para empresas. Evaluaciones médicas, programas de bienestar y vigilancia de la salud de tus trabajadores.',
}

const beneficios = [
  'Evaluaciones médicas preocupacionales y periódicas',
  'Vigilancia médica continua de trabajadores expuestos',
  'Programas de bienestar y promoción de la salud',
  'Atención de accidentes de trabajo y enfermedades ocupacionales',
  'Elaboración de registros y documentación legal exigida',
  'Asesoría en normativas de salud ocupacional vigentes',
]

const etapas = [
  {
    icon: ClipboardList,
    titulo: 'Diagnóstico Inicial',
    desc: 'Evaluamos las condiciones de salud actuales de tu empresa e identificamos los riesgos ocupacionales presentes en cada puesto de trabajo.',
  },
  {
    icon: Stethoscope,
    titulo: 'Evaluaciones Médicas',
    desc: 'Realizamos exámenes médicos preocupacionales, periódicos y de retiro según los protocolos establecidos por el Ministerio de Salud.',
  },
  {
    icon: Users,
    titulo: 'Programa de Bienestar',
    desc: 'Diseñamos e implementamos programas de salud mental, nutrición, ergonomía y promoción de hábitos saludables para tus colaboradores.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Seguimiento y Reportes',
    desc: 'Entregamos informes periódicos con indicadores de salud, estadísticas de ausentismo y recomendaciones de mejora continua.',
  },
]

export default function ServiciosPage() {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>

      <PageHeader
        label="Nuestros Servicios"
        title="Salud Ocupacional"
        description="Protegemos la salud integral de tus trabajadores con evaluaciones médicas, programas de bienestar y vigilancia ocupacional continua."
        ctaText="Solicitar información"
        ctaHref="/contacto"
        imageSrc="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
      />

      {/* ── BODY: CONTENIDO + IMÁGENES ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>

          {/* ── IZQUIERDA: Contenido ── */}
          <div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#0A0A0A', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              ¿En qué consiste este servicio?
            </h2>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#475569', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              La salud ocupacional es el conjunto de actividades asociadas a disciplinas multidisciplinarias cuyo objetivo es la promoción y mantenimiento del más alto grado de bienestar físico, mental y social de los trabajadores de todas las profesiones.
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#475569', lineHeight: 1.8, marginBottom: '2rem' }}>
              En SSMAT contamos con un equipo de médicos ocupacionales, psicólogos, nutricionistas y especialistas en seguridad que trabajan de manera coordinada para garantizar ambientes de trabajo saludables y productivos, cumpliendo con toda la normativa peruana vigente.
            </p>

            {/* Beneficios */}
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.0625rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '1rem' }}>
              ¿Qué incluye?
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {beneficios.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                  <CheckCircle size={17} color="var(--web-primary, #25927F)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>{b}</span>
                </li>
              ))}
            </ul>

            {/* Etapas */}
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.0625rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '1.25rem' }}>
              ¿Cómo trabajamos?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {etapas.map((e, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1.5px solid hsl(214,20%,92%)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(var(--web-primary-rgb,37,146,127),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <e.icon size={20} color="var(--web-primary, #25927F)" />
                  </div>
                  <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '0.375rem' }}>{e.titulo}</h4>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DERECHA: Espacios para imágenes ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: 'calc(var(--navbar-height) + 2rem)' }}>
            {/* Imagen principal */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: '16px',
                backgroundColor: '#f1f5f9',
                border: '2px dashed #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={24} color="#94a3b8" />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Imagen referencial</span>
            </div>

            {/* Dos imágenes pequeñas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[0, 1].map(i => (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    border: '2px dashed #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stethoscope size={16} color="#94a3b8" />
                  </div>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>Imagen</span>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div
              style={{
                borderRadius: '16px',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--web-dark, #025E44), var(--web-primary, #25927F))',
              }}
            >
              <Phone size={24} color="rgba(255,255,255,0.8)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                ¿Necesitas este servicio?
              </h4>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Contáctanos y te asesoramos sin costo según las necesidades de tu empresa.
              </p>
              <Link
                href="/contacto"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1.25rem', borderRadius: '8px',
                  backgroundColor: '#ffffff', color: 'var(--web-dark, #025E44)',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.8125rem',
                  textDecoration: 'none',
                }}
              >
                Contactar <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
