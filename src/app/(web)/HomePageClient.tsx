'use client'

import Link from 'next/link'
import Image from 'next/image'

import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, GraduationCap, PartyPopper, HardHat,
  CheckCircle2, Users, Target, Leaf, TrendingUp, BarChart3, Award
} from 'lucide-react'

import AnimatedSection from '@/features/web/visiona/components/AnimatedSection'

const solutions = [
  { icon: Shield, title: 'Consultoría', desc: 'Implementamos, auditamos y fortalecemos sistemas ISO, asegurando mejora continua y cumplimiento normativo.', href: '/servicios' },
  { icon: AlertTriangle, title: 'Primera Respuesta', desc: 'Planes, simulacros y cobertura de eventos bajo estándares nacionales e internacionales.', href: '/servicios' },
  { icon: GraduationCap, title: 'Academy - Formación y Entrenamiento', desc: 'Programas formativos dinámicos en SST, alto riesgo y respuesta ante emergencias.', href: '/cursos' },
  { icon: PartyPopper, title: 'Activaciones y Eventos BTL en SST', desc: 'Experiencias de alto impacto que fortalecen la cultura organizacional.', href: '/servicios' },
  { icon: HardHat, title: 'Trabajos de Alto Riesgo', desc: 'Ejecución y supervisión con los más altos estándares de seguridad.', href: '/servicios' },
]

const benefits = [
  { icon: CheckCircle2, title: 'Cumplimiento Normativo', desc: 'Auditorías MINTRA, certificación ISO y cumplimiento legal garantizado.' },
  { icon: Users, title: 'Enfoque en Personas', desc: 'Ponemos a las personas en el centro de cada solución que diseñamos.' },
  { icon: Target, title: 'Resultados Medibles', desc: 'KPIs claros y seguimiento de impacto real en tu operación.' },
  { icon: Shield, title: 'Preparación Resiliente', desc: 'Organizaciones preparadas para cualquier escenario de emergencia.' },
  { icon: Leaf, title: 'Impacto Sostenible', desc: 'Soluciones que generan valor a largo plazo para tu empresa y el país.' },
  { icon: TrendingUp, title: 'Cobertura Nacional', desc: 'Atendemos organizaciones a nivel nacional con soluciones adaptadas.' },
]

const stats = [
  { icon: Award, value: '2018', label: 'Año de fundación' },
  { icon: Users, value: '150+', label: 'Clientes atendidos' },
  { icon: BarChart3, value: '300+', label: 'Proyectos exitosos' },
  { icon: Leaf, value: '100%', label: 'Compromiso sostenible' },
]

const clients = [
  { name: 'Ajinomoto', logo: '/visiona/cliente/Ajinomoto.jpg' },
  { name: 'C.E. Buenas Nuevas', logo: '/visiona/cliente/C.EBuenasNuevas.png' },
  { name: 'Deep Soil Peru', logo: '/visiona/cliente/DeepSoilPeru.png' },
  { name: 'Del Barrio Producciones', logo: '/visiona/cliente/DelBarrioProducciones.jpeg' },
  { name: 'GoodYear', logo: '/visiona/cliente/GoodYear.png' },
  { name: 'ITB Support', logo: '/visiona/cliente/ITBSupport.jpg' },
  { name: 'Impulsar', logo: '/visiona/cliente/Impulsar.jpeg' },
  { name: 'Mayken Peru', logo: '/visiona/cliente/MaykenPeru.png' },
  { name: 'Oceans Bureau', logo: '/visiona/cliente/OceansBureau.png' },
  { name: 'Pasteleria Mariate', logo: '/visiona/cliente/PasteleriaMariate.jpg' },
  { name: 'R&C Servicios Industriales', logo: '/visiona/cliente/RyCServiciosIndustriales.png' },
  { name: 'SC Industrial', logo: '/visiona/cliente/SCIndustrial.png' },
  { name: 'Teinpro', logo: '/visiona/cliente/Teinpro.png' },
  { name: 'Zento', logo: '/visiona/cliente/Zento.jpeg' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/visiona/hero-home.jpg"
            alt="Base VISIONA"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,15,63,0.6)', mixBlendMode: 'multiply' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)', opacity: 0.9 }} />
        </div>

        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                VISIONA
              </h1>
              <div className="space-y-6 mb-10">
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                  Impulsamos organizaciones <span style={{ color: 'hsl(43 74% 49%)' }} className="font-medium">hacia el éxito</span>.
                </p>
                <p className="text-lg text-white/70 leading-relaxed border-l-2 pl-6 py-2" style={{ borderColor: 'hsl(43 74% 49% / 0.3)' }}>
                  Consultoría estratégica, gestión comercial y visión centrada en las personas y los resultados.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-12"
              >
                <p className="text-2xl md:text-3xl font-semibold italic tracking-tight" style={{ color: 'hsl(43 74% 49% / 0.9)', fontFamily: "'Poppins', sans-serif" }}>
                  &quot;Impulsamos el éxito de tu negocio&quot;
                </p>
              </motion.div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/servicios"
                  className="inline-block text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                  style={{ background: '#2d2db3' }}
                >
                  Descubre cómo generamos valor
                </Link>
              </div>

              {/* Pillars */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-16 max-w-2xl"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, hsl(43 74% 49% / 0.4), hsl(43 74% 49% / 0.6))' }} />
                  <span className="text-sm font-black tracking-[0.4em] uppercase" style={{ color: 'hsl(43 74% 49%)' }}>Pilares</span>
                  <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, hsl(43 74% 49% / 0.4), hsl(43 74% 49% / 0.6))' }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {[
                    { title: 'Impacto', subtitle: 'Sostenible' },
                    { title: 'Seguridad', subtitle: '' },
                    { title: 'Mejora', subtitle: 'Contínua' }
                  ].map((pilar, idx) => (
                    <div
                      key={pilar.title}
                      className={`p-8 flex flex-col items-center justify-center text-center group transition-colors hover:bg-[hsl(43_74%_49%/0.05)] ${idx !== 0 ? 'md:border-l border-t md:border-t-0 border-white/10' : ''}`}
                    >
                      <span className="text-base md:text-lg font-black text-white tracking-tighter uppercase leading-tight group-hover:scale-110 transition-transform duration-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {pilar.title}
                        {pilar.subtitle && <br />}
                        <span style={pilar.subtitle ? { color: 'hsl(43 74% 49% / 0.8)' } : {}}>{pilar.subtitle}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              className="relative flex justify-center lg:justify-end mt-16 lg:mt-0"
            >
              <div className="relative z-20 w-full max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] flex flex-col items-center translate-y-8">
                <motion.div
                  animate={{ scale: [1, 0.85, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-[0.5%] left-1/2 -translate-x-1/2 w-[65%] h-[20px] rounded-[100%] pointer-events-none"
                  style={{ background: 'rgba(0,0,0,0.2)', filter: 'blur(20px)' }}
                />
                <motion.img
                  src="/visiona/avatar/Avatar_Visiona_Peru.png"
                  alt="Avatar VISIONA"
                  className="w-full h-auto object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))' }}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full -z-10 pointer-events-none" style={{ background: 'hsl(43 74% 49% / 0.05)', filter: 'blur(120px)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 md:py-28 border-y border-white/5" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nuestras <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Soluciones</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Cinco unidades de negocio diseñadas para impulsar la excelencia en tu organización.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="rounded-xl p-8 h-full group cursor-pointer transition-all duration-300 hover:-translate-y-1.5" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ background: '#2d2db3' }}>
                    <s.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <Link href={s.href} className="text-sm font-semibold hover:underline" style={{ color: 'hsl(43 74% 49%)' }}>
                    Saber más →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Por qué elegir <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VISIONA</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.08}>
                <div className="flex gap-4 p-6 rounded-xl transition-colors group hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: 'rgba(45,45,179,0.2)' }}>
                    <b.icon size={24} style={{ color: '#3a3acc' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{b.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Diagram */}
      <section className="py-24 relative overflow-hidden border-y border-white/5" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Nuestro Ecosistema de <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Valor</span>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Un ciclo continuo de excelencia diseñado para transformar la seguridad y eficiencia de tu organización.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="rounded-[4rem] p-8 md:p-16 shadow-2xl relative z-10" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Image
                  src="/visiona/diagrama-servicios.png"
                  alt="Ecosistema de Servicios VISIONA"
                  width={900}
                  height={600}
                  className="w-full h-auto max-w-4xl mx-auto"
                  style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))' }}
                />
              </div>
              <div className="mt-16 text-center">
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-3 font-bold transition-all duration-300 group"
                  style={{ color: 'hsl(43 74% 49%)' }}
                >
                  Explora cada unidad a detalle
                  <TrendingUp size={20} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 border-b border-white/5" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Impacto <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.15} className="text-center">
                <s.icon className="mx-auto mb-4" size={36} style={{ color: 'hsl(43 74% 49%)' }} />
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                <p className="text-white/60 text-sm">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              ¿Listo para generar <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>impacto real</span>?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10">
              Conversemos sobre cómo podemos impulsar tu organización hacia la excelencia operativa y la sostenibilidad.
            </p>
            <Link
              href="/contacto"
              className="inline-block text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              style={{ background: '#2d2db3' }}
            >
              Contáctanos ahora
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Clients */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0a0f3f', fontFamily: "'Poppins', sans-serif" }}>
              Empresas que <span style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>confían en nosotros</span>
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full opacity-50" style={{ background: 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))' }} />
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 md:gap-12 items-center">
            {clients.map((client, i) => (
              <AnimatedSection key={client.name} delay={i * 0.05} className="flex justify-center">
                <div className="group grayscale hover:grayscale-0 transition-all duration-500 hover:scale-[1.15]">
                  <Image
                    src={client.logo}
                    alt={`Logo de ${client.name}`}
                    width={120}
                    height={80}
                    className="h-16 md:h-20 w-auto object-contain max-w-[120px]"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
