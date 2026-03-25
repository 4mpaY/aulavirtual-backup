import Link from 'next/link'

import { ArrowRight, Shield, BarChart3, Users, Award, Cog, Activity } from 'lucide-react'

import HeroSlider from '@/features/web/home/components/HeroSlider'
import ServiceCard from '@/features/web/home/components/ServiceCard'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'

export const metadata = {
  title: 'ARM - Soluciones de Ingeniería Industrial',
  description: 'Gestión de activos, mantenimiento predictivo y consultoría en confiabilidad industrial.',
}

const services = [
  {
    image: '/assets/services/proyectos/gerencia-de-proyectos.png',
    title: 'Proyectos',
    description: 'Gerencia y supervisión de proyectos industriales con enfoque técnico, metodológico y orientado a resultados.',
    href: '/proyectos',
  },
  {
    image: '/assets/services/mantenimiento/mantenimiento-predictivo.jpg',
    title: 'Mantenimiento',
    description: 'Soluciones avanzadas de mantenimiento predictivo y proactivo para maximizar disponibilidad y reducir fallas.',
    href: '/mantenimiento',
  },
  {
    image: '/assets/services/consultoria/gestion-iso-5500.jpeg',
    title: 'Consultoría',
    description: 'Implementación de estrategias de gestión de activos y mantenimiento alineadas con ISO 55000.',
    href: '/consultoria',
  },
  {
    image: '/images/cursos.jpg',
    title: 'Capacitación',
    description: 'Programas de formación técnica con metodología ARM Active Mastery™ — teoría, práctica y casos reales.',
    href: '/cursos',
  },
]

const stats = [
  { icon: Shield, value: '8+', label: 'Años de experiencia' },
  { icon: BarChart3, value: '100+', label: 'Proyectos ejecutados' },
  { icon: Users, value: '50+', label: 'Clientes satisfechos' },
  { icon: Award, value: 'ISO', label: 'Alineados a ISO 55001' },
]

const news = [
  {
    title: 'La importancia del mantenimiento predictivo en la industria moderna',
    excerpt: 'Descubra cómo las técnicas predictivas pueden reducir costos operativos hasta en un 30% y aumentar la disponibilidad de sus equipos.',
    date: '15 Feb 2026',
  },
  {
    title: 'Gestión de activos: claves para una operación eficiente',
    excerpt: 'Conozca las mejores prácticas en gestión de activos según la norma ISO 55001 y cómo implementarlas en su organización.',
    date: '8 Feb 2026',
  },
  {
    title: 'ARM lanza nuevo programa de capacitación virtual',
    excerpt: 'Nuestro aula virtual ofrece cursos especializados en confiabilidad y mantenimiento para profesionales de toda la región.',
    date: '1 Feb 2026',
  },
]

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      {/* Intro */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <div className="w-20 h-1.5 bg-[#E2231A] mx-auto mb-8" />
              <h2 className="text-4xl lg:text-6xl font-display font-black text-[#02115C] mb-10 leading-[1.1] uppercase">
                Soluciones de ingeniería que generan resultados
              </h2>
              <p className="text-gray-500 leading-relaxed text-xl max-w-3xl mx-auto font-sans">
                En ARM ayudamos a que las empresas operen con mayor seguridad, eficiencia y rentabilidad.
                Desde 2018 acompañamos a organizaciones industriales que buscan elevar el desempeño de sus
                activos y transformar su gestión de mantenimiento en una ventaja competitiva.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-32 relative overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 border border-[#02115C]/10 mb-8 group-hover:bg-[#02115C] group-hover:border-[#02115C] transition-all duration-500 rounded-2xl bg-white shadow-sm">
                    <stat.icon className="w-8 h-8 text-[#02115C] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="text-5xl lg:text-6xl font-display font-black text-[#02115C] transition-transform group-hover:scale-110 duration-500">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-4 uppercase tracking-[0.3em] font-black">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="w-20 h-1.5 bg-[#E2231A] mx-auto mb-8" />
              <h2 className="text-4xl lg:text-6xl font-display font-black text-[#02115C] mb-6 uppercase">
                Nuestros Servicios
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg font-sans">
                Brindamos servicios de principios de confiabilidad, servicios predictivos y consultorías a empresas con precisión técnica.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <ServiceCard {...s} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="w-20 h-1.5 bg-[#E2231A] mb-8" />
                <h2 className="text-4xl lg:text-5xl font-display font-black text-[#02115C] uppercase leading-none">
                  Noticias y Blog
                </h2>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-10">
            {news.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <article className="group bg-white border border-gray-200 p-10 hover:shadow-2xl hover:border-[#02115C]/20 transition-all duration-500">
                  <time className="text-xs text-[#E2231A] font-sans font-black uppercase tracking-widest">
                    {item.date}
                  </time>
                  <h3 className="text-2xl font-display font-black text-[#02115C] mt-4 mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-relaxed font-sans mb-8">{item.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs font-sans font-black text-[#E2231A] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Cog className="absolute -right-20 -top-20 w-96 h-96 text-[#02115C] animate-[spin_60s_linear_infinite]" />
          <Activity className="absolute -left-10 -bottom-10 w-80 h-80 text-[#02115C]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center px-3 py-1 bg-[#02115C]/5 text-[#02115C] text-[10px] font-black uppercase tracking-widest border-l-2 border-[#02115C] mb-8">
              Consultoría de Precisión
            </div>
            <h2 className="text-4xl lg:text-7xl font-display font-black text-[#02115C] mb-10 leading-[1] uppercase mx-auto">
              ¿Listo para transformar su operación?
            </h2>
            <p className="text-gray-500 mb-14 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
              Descubra cómo nuestras soluciones de ingeniería pueden elevar la confiabilidad de sus activos a estándares de clase mundial.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-12 py-5 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm shadow-xl group"
              >
                Solicita Asesoría Gratuita
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center px-12 py-5 border-2 border-[#02115C] text-[#02115C] font-sans font-bold uppercase tracking-wider hover:bg-[#02115C] hover:text-white transition-all duration-300 text-sm bg-transparent"
              >
                Explorar Soluciones
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
