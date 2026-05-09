'use client'

import Image from 'next/image'

import { Heart, Sparkles, Leaf, Lightbulb, Handshake, Eye, Target, ShieldCheck, Briefcase } from 'lucide-react'

import AnimatedSection from '@/features/web/visiona/components/AnimatedSection'

const values = [
  { icon: Heart, title: 'Compromiso', desc: 'Nos involucramos profundamente con cada cliente y proyecto.' },
  { icon: Sparkles, title: 'Excelencia', desc: 'Buscamos los más altos estándares en cada servicio.' },
  { icon: Leaf, title: 'Sostenibilidad', desc: 'Soluciones que generan valor en el tiempo.' },
  { icon: Lightbulb, title: 'Innovación', desc: 'Métodos creativos y actualizados para cada desafío.' },
  { icon: Handshake, title: 'Cercanía', desc: 'Trato humano, directo y personalizado con cada organización.' },
]

const team = [
  {
    name: 'FERNANDO ARRELUCEA',
    role: 'Gerente General',
    image: '/visiona/equipo/1.png',
    highlights: [
      'Ing. en Seguridad Industrial y Minera.',
      'Administración y Negocios - IESE Business School - España.',
      'Implementador y Auditor en ISO 9001, 14001, 45001, 37001, 21001.',
      'Bombero Voluntario - Cuerpo General de Bomberos Voluntarios del Perú.'
    ],
    bio: 'Cuenta con más de 10 años de experiencia en consultoría de Sistemas de Gestión, ha liderado la implementación de proyectos a medida, flexibles y alineados a las necesidades de cada organización, ayudando a empresas de los sectores: Construcción, Servicios, Minería, Energía, Industrias Alimentarias, Metalmecánica y entidades públicas.'
  },
  {
    name: 'GABRIELA COSAVALENTE',
    role: 'Jefe de Proyectos ITSE',
    image: '/visiona/equipo/2.png',
    highlights: [
      'Lic. en Arquitectura, colegiada y habilitada.',
      'Especialización en Inspección Técnica de Seguridad en Edificaciones - ITSE.',
      'Dirección de Proyectos (PMO – Metodologías Ágiles / PMI).'
    ],
    bio: 'Cuenta con experiencia en elaboración de expedientes técnicos para los procesos ITSE para los diferentes sectores. Lidera la asesoría, implementación, supervisión y cumplimiento en los proyectos de Inspecciones Técnicas de Seguridad en Edificaciones de nuestra organización.'
  },
  {
    name: 'VICTOR CAMACHO',
    role: 'Jefe de Proyectos ISO',
    image: '/visiona/equipo/3.png',
    highlights: [
      'Ingeniero Pesquero - Universidad Nacional Agraria La Molina.',
      'Auditor Líder IRCA ISO 9001, 14001, 45001.',
      'Auditor de Certificación de Primera y Segunda Parte.',
      'Experiencia en TÜV Rheinland (Argentina/Chile/Perú) y SGS del Perú.'
    ],
    bio: 'Experto en auditorías de sistemas de gestión con amplia trayectoria internacional en certificación de normas ISO, BPM y BPA, así como en la implementación estratégica de las mismas para organizaciones de diversos sectores.'
  },
  {
    name: 'RICARDO MARTINEZ',
    role: 'Jefe en Entrenamiento de Primera Respuesta',
    image: '/visiona/equipo/4.png',
    highlights: [
      'Administración de Empresas - UPC.',
      'Capitán CBP - Cuerpo General de Bomberos Voluntarios del Perú.',
      'Bombero Aeronáutico Senior e Instructor SEI - LAP.',
      'Técnico MATPEL Nivel III.',
      'Operaciones Avanzadas Contra Incendios - TEEX (EE.UU.).'
    ],
    bio: 'Con 25 años de experiencia como instructor, lidera la respuesta ante emergencias y el entrenamiento especializado para equipos de alto desempeño en aeropuertos y entornos industriales complejos.'
  },
  {
    name: 'SILVANA MARILUZ',
    role: 'Jefe en Salud Ocupacional',
    image: '/visiona/equipo/5.png',
    highlights: [
      'Lic. en Enfermería, colegiada y habilitada.',
      'Especialidad en Salud Ocupacional.',
      'Diplomado en Gestión de la Vigilancia y Salud Ocupacional.',
      'Trayectoria en MINSA y Clínicas Ocupacionales.'
    ],
    bio: 'Con amplia experiencia en gestión de la salud ocupacional, ha liderado acciones preventivas que reducen el ausentismo laboral y aumentan la productividad en organizaciones públicas y privadas de diversos sectores industriales.'
  }
]

const timeline = [
  {
    year: '2018',
    title: 'Nace VISIONA',
    text: 'Con el propósito de brindar soluciones especializadas que contribuyan al desarrollo de organizaciones más exitosas y eficientes. Desde su creación, la empresa se enfocó en servicios de Seguridad y Salud en el Trabajo, Capacitación y Asesoría Técnica.',
    img: '/visiona/nosotros/etapa1.jpeg'
  },
  {
    year: 'Crecimiento',
    title: 'Expansión de Impacto',
    text: 'Impulsada por la experiencia de su equipo profesional, VISIONA inició acompañando a pequeñas y medianas empresas, destacándose por su trato cercano, compromiso y enfoque en soluciones adaptadas a cada cliente.',
    img: '/visiona/nosotros/etapa2.jpeg'
  },
  {
    year: 'Consolidación',
    title: 'Aliado Estratégico',
    text: 'Con el tiempo, ha fortalecido su presencia, consolidándose como un aliado estratégico para diversas organizaciones, contribuyendo a mejorar sus estándares de seguridad, gestión y desempeño.',
    img: '/visiona/nosotros/etapa3.jpeg'
  },
  {
    year: 'Hoy',
    title: 'Futuro Sostenible',
    text: 'VISIONA continúa creciendo con el firme compromiso de generar valor, proteger a las personas y aportar al desarrollo sostenible de sus clientes y del país.',
    img: '/visiona/nosotros/etapa4.jpeg'
  },
]

const goldGradient = 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))'
const glassCard = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }

export default function NosotrosClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ background: '#000' }}>
        <div className="w-full relative">
          <Image
            src="/visiona/hero-nosotros.jpeg"
            alt="Equipo VISIONA"
            width={1920}
            height={800}
            className="w-full h-auto"
            style={{ minHeight: '40vh', objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}>
            <div className="container mx-auto px-4 pb-12 md:pb-24">
              <AnimatedSection>
                <div className="max-w-4xl">
                  <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Sobre <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nosotros</span>
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl font-light leading-relaxed">
                    Conoce la historia, misión y valores que impulsan a VISIONA.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="rounded-2xl p-8 md:p-10 h-full" style={glassCard}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: '#2d2db3' }}>
                  <Target className="text-white" size={28} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Nuestra <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Misión</span>
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Brindar soporte profesional y promover el seguimiento constante y el cumplimiento legal para garantizar una cultura sólida de las organizaciones, que aporte valor para el desarrollo y crecimiento empresarial.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="rounded-2xl p-8 md:p-10 h-full" style={glassCard}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(45,45,179,0.2)' }}>
                  <Eye className="text-green-400" size={28} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Nuestra <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Visión</span>
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Ser aliado estratégico para contribuir con el crecimiento empresarial, proponiendo soluciones efectivas de acuerdo a las necesidades, cumpliendo todas las metas y objetivos de nuestros clientes.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-20 md:mb-28">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nuestra <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Historia</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">El camino recorrido construyendo valor y seguridad.</p>
            <div className="w-24 h-1.5 mx-auto rounded-full mt-6 opacity-60" style={{ background: goldGradient }} />
          </AnimatedSection>

          <div className="relative max-w-7xl mx-auto">
            <div className="hidden lg:block absolute top-[180px] left-0 w-full h-1 rounded-full z-0" style={{ background: 'linear-gradient(to right, hsl(43 74% 49% / 0.1), hsl(43 74% 49% / 0.4), hsl(43 74% 49% / 0.1))' }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.15} className="group flex flex-col items-center">
                  <div className="relative w-full mb-8 lg:mb-12 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-4">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-3xl object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center relative -mt-[44px] mb-8 z-20 group-hover:scale-125 transition-transform duration-300" style={{ background: '#0a0f3f', border: '4px solid hsl(43 74% 49%)', boxShadow: '0 0 15px hsl(43 74% 49% / 0.5)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(48 89% 50%)' }} />
                  </div>
                  <span className="inline-flex items-center justify-center px-6 py-2 rounded-full font-bold uppercase text-sm mb-6 border transition-colors duration-300 group-hover:text-white" style={{ background: 'hsl(43 74% 49% / 0.1)', color: 'hsl(43 74% 49%)', borderColor: 'hsl(43 74% 49% / 0.2)', fontFamily: "'Poppins', sans-serif" }}>
                    {item.year}
                  </span>
                  <div className="rounded-2xl w-full text-center flex-1 flex flex-col p-6 md:p-8" style={glassCard}>
                    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">{item.text}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 border-y border-white/5" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nuestros <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Valores</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="rounded-xl p-6 text-center h-full group transition-all duration-300 hover:-translate-y-1.5" style={glassCard}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(45,45,179,0.2)' }}>
                    <v.icon className="text-green-400" size={28} />
                  </div>
                  <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{v.title}</h3>
                  <p className="text-white/60 text-sm">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nuestro <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Equipo</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg font-light">
              Liderazgo especializado comprometido con la excelencia operativa y la seguridad integral.
            </p>
            <div className="w-24 h-1.5 mx-auto rounded-full mt-6 opacity-60" style={{ background: goldGradient }} />
          </AnimatedSection>

          <div className="space-y-32 md:space-y-40 max-w-7xl mx-auto">
            {team.map((m, i) => (
              <AnimatedSection
                key={m.name}
                delay={i * 0.1}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <div className="w-full lg:w-[40%] group">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-[3rem] blur-2xl group-hover:opacity-100 transition-all duration-500 opacity-60" style={{ background: 'hsl(43 74% 49% / 0.1)' }} />
                    <div className="relative p-4 rounded-[3rem] shadow-2xl" style={glassCard}>
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={500}
                        height={500}
                        className="w-full h-auto aspect-square object-cover rounded-[2.5rem] group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="w-full lg:w-[60%]">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{m.name}</h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest border" style={{ background: 'hsl(43 74% 49% / 0.1)', color: 'hsl(43 74% 49%)', borderColor: 'hsl(43 74% 49% / 0.2)' }}>
                        <Briefcase size={16} />
                        {m.role}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-6 rounded-2xl relative overflow-hidden group" style={glassCard}>
                      {m.highlights.map((h, idx) => (
                        <div key={idx} className="flex gap-3 items-start text-sm text-white/90">
                          <div className="mt-1 p-1 rounded" style={{ background: 'rgba(34,197,94,0.1)' }}>
                            <ShieldCheck className="text-green-400 shrink-0" size={16} />
                          </div>
                          <span className="leading-snug">{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative pl-8 border-l-4 py-4 rounded-r-2xl" style={{ borderColor: 'hsl(43 74% 49% / 0.3)', background: 'hsl(43 74% 49% / 0.05)' }}>
                      <p className="text-white/70 leading-relaxed italic text-lg lg:text-xl opacity-90 font-light pr-6">{m.bio}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
