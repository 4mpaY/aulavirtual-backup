'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Shield, AlertTriangle, GraduationCap, PartyPopper, HardHat, CheckCircle2 } from 'lucide-react'

import AnimatedSection from '@/features/web/visiona/components/AnimatedSection'

const goldGradient = 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))'
const glassCard = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }

const services = [
  {
    icon: Shield,
    title: 'Consultoría',
    desc: 'Impulsamos la excelencia y cumplimiento normativo a través de la implementación y evaluación de sistemas de gestión integrados.',
    image: '/visiona/servicios/Consultoria.png',
    benefits: [
      'Implementación y seguimiento de los Sistemas de Gestión (ISO 9001, 14001, 45001, 21001, entre otros)',
      'Transiciones y migraciones en sistemas de gestión',
      'Diagnóstico de línea base de sistemas de gestión',
      'Digitalización de sistemas de gestión',
      'Formación de auditores internos ISO',
      'Auditoría interna y externa ISO / MINTRA',
      'Procesos de homologación de proveedores',
      'Asesoría para procesos ITSE',
      'Inspecciones de seguridad',
      'Supervisión de proyectos en SST',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Primera Respuesta',
    desc: 'Atención especializada y equipos altamente capacitados para la prevención y control de emergencias.',
    image: '/visiona/servicios/PrimeraRespuesta.png',
    benefits: [
      'Equipos de profesionales para emergencias (Bomberos, Rescatistas, Profesionales de la Salud)',
      'Atención en eventos corporativos, conciertos y ferias',
      'Unidades móviles para atención y respuesta a emergencias',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Academy - Formación y Entrenamiento',
    desc: 'Programas integrales de formación en seguridad, salud ocupacional y respuesta ante crisis.',
    image: '/visiona/servicios/Entrenamiento.png',
    additionalImage: '/visiona/servicios/capacitacion2.png',
    subcategories: [
      {
        title: 'Capacitación en SST',
        items: [
          'Introducción y formación ISO (9001, 14001, 45001, 31001, 21001)',
          'Ley de SST, Reglamento y Modificatorias',
          'Inducción en Seguridad y Salud en el Trabajo',
          'Comité de SST / Subcomité y Supervisores',
          'IPERC (Identificación de Peligros)',
          'Ergonomía Laboral',
          'Comité frente al Hostigamiento Sexual Laboral',
        ],
      },
      {
        title: 'Trabajos de Alto Riesgo',
        items: [
          'Trabajos en altura (andamios, accesos verticales)',
          'Seguridad eléctrica',
          'Espacios confinados',
          'Trabajos en caliente',
          'Izaje de cargas',
          'Excavación y zanjas',
        ],
      },
      {
        title: 'Brigadas de Emergencias',
        items: [
          'Respuesta MATPEL I, II y III',
          'Control y extinción de incendios a nivel industrial',
          'Uso y manejo de extintores',
          'Primeros auxilios',
        ],
      },
    ],
  },
  {
    icon: PartyPopper,
    title: 'Activaciones y Eventos BTL en SST',
    desc: 'Transformamos la cultura de prevención mediante campañas creativas y activaciones inolvidables.',
    image: '/visiona/servicios/Activaciones.png',
    subcategories: [
      {
        title: 'Eventos y Fechas Conmemorativas',
        items: [
          'Día Mundial de la SST',
          'Día Mundial de la Salud',
          'Día Internacional de los Trabajadores',
          'Día Internacional para la Reducción del Riesgo de Desastres',
          'Día Mundial de la Salud Mental',
        ],
      },
      {
        title: 'Campañas Preventivas y Activaciones',
        items: [
          'Seguridad Basada en el Comportamiento',
          'Simulacros de Respuesta a Emergencias',
          'Uso de Realidad Virtual en SST',
          'Campaña de Seguridad Vial Laboral',
        ],
      },
    ],
  },
  {
    icon: HardHat,
    title: 'Trabajos de Alto Riesgo',
    desc: 'Ejecución experta y control metódico de actividades críticas para toda industria.',
    image: '/visiona/servicios/AltoRiesgo.png',
    subcategories: [
      {
        title: 'Trabajos Verticales (Altura)',
        items: [
          'Mantenimiento de fachadas de edificios',
          'Mantenimiento de paneles publicitarios',
          'Mantenimiento de paneles de estaciones de servicios',
        ],
      },
      {
        title: 'Espacios Confinados',
        items: [
          'Inspección y control de espacios confinados',
          'Mantenimiento de pozos',
          'Mantenimiento de tanques',
        ],
      },
    ],
  },
]

export default function ServiciosClient() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: 'hsl(43 74% 49% / 0.1)', filter: 'blur(100px)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nuestros <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Servicios</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed font-light">
              Cinco ejes estratégicos y especializados listos para impulsar la seguridad, eficiencia y sostenibilidad de tu organización.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-24 md:space-y-32">
            {services.map((s, index) => {
              const Icon = s.icon
              const isEven = index % 2 === 0

              return (
                <AnimatedSection key={s.title} delay={0.1}>
                  <div className={`flex flex-col gap-12 lg:gap-16 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start`}>
                    {/* Imagen */}
                    <div className="w-full lg:w-5/12 relative group shrink-0 flex flex-col gap-6">
                      <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(135deg, hsl(43 74% 49% / 0.2), rgba(45,45,179,0.3))' }} />
                      <div className={`p-2 rounded-3xl relative z-10 overflow-hidden shadow-2xl transition-all duration-500 ${s.additionalImage ? 'h-[350px] lg:h-[450px]' : 'h-[400px] lg:h-[550px]'}`} style={glassCard}>
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 rounded-2xl flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}>
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border border-white/20 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ background: 'rgba(45,45,179,0.9)', backdropFilter: 'blur(10px)' }}>
                            <Icon size={32} className="text-white" />
                          </div>
                        </div>
                      </div>
                      {s.additionalImage && (
                        <div className="p-2 rounded-3xl relative z-10 overflow-hidden shadow-2xl h-[350px] lg:h-[450px] group-hover:-translate-y-[10px] transition-transform duration-500" style={glassCard}>
                          <Image src={s.additionalImage} alt={`${s.title} - Adicional`} fill className="object-cover rounded-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Texto */}
                    <div className="w-full lg:w-7/12 flex flex-col justify-center">
                      <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h2>
                        <p className="text-lg text-gray-300 leading-relaxed border-l-4 pl-4" style={{ borderColor: 'hsl(43 74% 49%)' }}>{s.desc}</p>
                      </div>

                      <div className="rounded-2xl p-6 md:p-8 border shadow-xl w-full" style={{ ...glassCard, borderColor: 'rgba(255,255,255,0.05)' }}>
                        {s.benefits && (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {s.benefits.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3">
                                <CheckCircle2 style={{ color: 'hsl(43 74% 49%)', flexShrink: 0, marginTop: 4 }} size={18} />
                                <span className="text-sm md:text-base text-gray-200 leading-snug">{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {s.subcategories && (
                          <div className="space-y-8">
                            {s.subcategories.map((sub, idx) => (
                              <div key={idx} className="space-y-4">
                                <h4 className="font-bold tracking-widest uppercase text-xs md:text-sm pb-2 flex items-center gap-2" style={{ color: '#3a3acc', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <div className="w-2 h-2 rounded-full inline-block" style={{ background: 'hsl(43 74% 49%)' }} />
                                  {sub.title}
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                  {sub.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2 p-3 rounded-lg border transition-colors hover:bg-black/40" style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.05)' }}>
                                      <CheckCircle2 style={{ color: 'hsl(43 74% 49% / 0.7)', flexShrink: 0, marginTop: 2 }} size={16} />
                                      <span className="text-sm text-gray-300 leading-tight">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                          href="/contacto"
                          className="inline-flex text-white px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-xl items-center gap-3"
                          style={{ background: '#2d2db3' }}
                        >
                          Solicitar {s.title.toLowerCase().replace(/[0-9.]/g, '')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'hsl(43 74% 49% / 0.1)', filter: 'blur(120px)', transform: 'translate(50%, -50%)' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              ¿Listo para dar el <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>siguiente paso</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
              Nuestro equipo de expertos está preparado para diseñar y ejecutar la estrategia perfecta para tu empresa.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-2xl"
              style={{ background: 'white', color: '#0a0f3f' }}
            >
              Contactar a un Especialista
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
