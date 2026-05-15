import Image from 'next/image'
import Link from 'next/link'

import { Target, Shield, TrendingUp, Users, CheckCircle2, Award, Eye } from 'lucide-react'

import ScrollReveal from '@/features/web/home/components/ScrollReveal'

export const metadata = {
  title: 'Nosotros — Terramett SAC',
  description: 'Empresa peruana especializada en topografía e ingeniería civil con más de 12 años de experiencia.',
}

const values = [
  { icon: Target,     title: 'Precisión',    description: 'Utilizamos equipos de última generación para garantizar resultados exactos en cada medición.' },
  { icon: Shield,     title: 'Confianza',    description: '12 años de experiencia nos respaldan en cada proyecto que emprendemos.' },
  { icon: TrendingUp, title: 'Innovación',   description: 'Incorporamos las últimas tecnologías en topografía, geomática y sistemas BIM.' },
  { icon: Users,      title: 'Equipo',       description: 'Profesionales certificados y comprometidos con la excelencia técnica en cada obra.' },
]

const achievements = [
  'Clientes en todos los sectores de la industria',
  'Equipos topográficos de precisión milimétrica',
  'Cobertura en todo el territorio peruano',
  'Garantía de puntualidad y calidad',
]

const staff = [
  {
    name: 'Diego Alfonso Utrilla Ruiz',
    role: 'Civil Engineering Design Leader',
    image: '/assets/terramett/profe-1.jpg',
    bio: 'Ingeniero Civil, con experiencia previa en el sector construcción desempeñándose como técnico y proyectista, participando en proyectos de infraestructura vial, saneamiento y minería. Cuenta con manejo de herramientas aplicadas al desarrollo, modelamiento y apoyo en el diseño de ingeniería.',
  },
  {
    name: 'Christian Mariano Rios Guerra',
    role: 'Civil Engineering Design Leader',
    image: '/assets/terramett/profe-2.jpg',
    bio: 'Proyectista Civil, con amplia experiencia en el rubro de ingeniería y construcción dentro del sector minero e industrial, participando en grandes y medianos proyectos multidisciplinarios. Especialista en Movimientos de Tierras y Obras de concreto.',
  },
  {
    name: 'Anddy Miranda Japa',
    role: 'Senior Surveyor',
    image: '/assets/terramett/profe-3.jpg',
    bio: 'Topógrafo con sólida formación técnica y experiencia en levantamientos topográficos y geodésicos aplicados a proyectos de ingeniería civil, obras viales y control de obras. Manejo de equipos topográficos convencionales y de alta precisión como estación total, nivel automático y GPS/GNSS.',
  },
  {
    name: 'Pedro Fabricio Ricaldi Dávila',
    role: 'Civil Engineering Design Leader',
    image: '/assets/terramett/profe-4.jpg',
    bio: 'Ingeniero civil, con conocimiento en la industria de la construcción, desempeño eficaz en coordinación y dirección de proyectos de consultoría. Desarrollo de múltiples funciones con alta motivación, confianza, trabajo en equipo, empatía y adaptación al cambio.',
  },
]

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1177AB] py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#88C7E6]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Nosotros</h1>
          <p className="text-white/80 text-xl">Más de una década transformando la ingeniería en el Perú.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">

          {/* Nuestra Historia */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <ScrollReveal direction="left">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0D3A52] mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-[#4d6b7d] text-lg mb-8 leading-relaxed">
                <p>
                  <strong className="text-[#0D3A52]">Terramett SAC</strong> nació con la visión de elevar los estándares de la ingeniería topográfica y civil en el Perú. Desde nuestros inicios, nos hemos comprometido con la innovación tecnológica y la excelencia técnica.
                </p>
                <p>
                  A lo largo de 12 años, hemos participado en proyectos emblemáticos de infraestructura, minería y saneamiento, ganándonos la confianza de nuestros clientes gracias a nuestra precisión y cumplimiento.
                </p>
              </div>

              {/* Visión y Misión */}
              <div className="space-y-4">
                <div className="bg-[#EBF5FB]/60 rounded-2xl p-6 border border-[#EBF5FB]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#88C7E6]/20 rounded-xl flex items-center justify-center shrink-0">
                      <Eye className="text-[#1177AB]" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#0D3A52] mb-2">Visión</h3>
                      <p className="text-[#4d6b7d] text-sm leading-relaxed">
                        Brindar formación y servicios especializados en diseño de ingeniería, desarrollando competencias técnicas y profesionales que permitan a nuestros estudiantes y clientes ejecutar proyectos con altos estándares de calidad, eficiencia y precisión.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#EBF5FB]/60 rounded-2xl p-6 border border-[#EBF5FB]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1177AB]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Target className="text-[#1177AB]" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#0D3A52] mb-2">Misión</h3>
                      <p className="text-[#4d6b7d] text-sm leading-relaxed">
                        Ser una empresa líder y referente en la capacitación y servicios para diseño de ingeniería a nivel nacional, reconocida por la excelencia en sus servicios, la innovación tecnológica y el impacto positivo en la empleabilidad y desempeño profesional de nuestros egresados y clientes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <Image
                  src="/assets/terramett/Terramett-hero1.webp"
                  alt="Equipo Terramett"
                  width={600}
                  height={450}
                  className="rounded-2xl shadow-2xl w-full object-cover object-left aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -left-6 bg-[#1177AB] p-8 rounded-xl text-white shadow-xl hidden md:block">
                  <div className="text-4xl font-bold font-display mb-1">100%</div>
                  <div className="text-sm opacity-90">Compromiso con<br />la calidad</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Staff de Profesionales */}
          <div className="mb-20">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0D3A52] mb-4">Staff de Profesionales</h2>
                <p className="text-[#4d6b7d] text-lg max-w-2xl mx-auto">Nuestro equipo de expertos altamente calificados</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {staff.map((person, i) => (
                <ScrollReveal key={person.name} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#EBF5FB] hover:shadow-xl transition-all duration-300 group">
                    <div className="relative overflow-hidden bg-[#EBF5FB]">
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={400}
                        height={300}
                        className="w-full h-auto max-h-[300px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className="font-display text-lg font-bold mb-1 leading-tight">{person.name}</h3>
                        <p className="text-sm font-medium text-[#88C7E6]">{person.role}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[#4d6b7d] text-sm leading-relaxed">{person.bio}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Valores Corporativos */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0D3A52]">Valores Corporativos</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {values.map((v, i) => {
              const Icon = v.icon

              return (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl bg-[#EBF5FB]/40 border border-[#EBF5FB] hover:border-[#88C7E6]/50 transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-[#88C7E6]/20 text-[#1177AB] mx-auto mb-6 flex items-center justify-center group-hover:bg-[#1177AB] group-hover:text-white transition-colors">
                      <Icon size={32} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#0D3A52] mb-3">{v.title}</h3>
                    <p className="text-[#4d6b7d]">{v.description}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          {/* ¿Por qué elegirnos? */}
          <ScrollReveal>
            <div className="bg-[#1177AB] rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#88C7E6]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#2892C7]/10 rounded-full blur-[80px]" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8">¿Por qué elegir Terramett?</h2>
                  <p className="opacity-90 text-lg mb-10 leading-relaxed max-w-xl">
                    Nuestra experiencia y equipamiento nos permiten abordar los proyectos más desafiantes con total garantía de precisión y cumplimiento.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                    {achievements.map(a => (
                      <div key={a} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#88C7E6] transition-colors shadow-lg">
                          <CheckCircle2 className="text-white" size={20} />
                        </div>
                        <span className="text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div className="relative group w-full max-w-[320px]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#88C7E6] to-[#2892C7] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                    <div className="relative bg-white/10 backdrop-blur-xl p-10 rounded-3xl text-center border border-white/20 shadow-2xl overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#88C7E6]/10 rounded-full blur-2xl" />
                      <div className="w-20 h-20 bg-[#88C7E6]/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold text-7xl font-display text-white tracking-tighter">12+</div>
                        <div className="text-xl font-semibold text-white/90">Años de Trayectoria</div>
                        <p className="text-sm text-white/60 font-medium">Liderando la ingeniería en el Perú</p>
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
                        <div className="text-center">
                          <div className="font-bold text-2xl text-white">100%</div>
                          <div className="text-[10px] uppercase tracking-wider font-bold text-white/50">Garantía de Calidad</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/contacto" className="btn-primary inline-flex items-center gap-2">
              Contáctanos
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
