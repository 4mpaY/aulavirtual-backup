import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Mantenimiento - ARM',
  description: 'Soluciones de mantenimiento predictivo y proactivo',
}

export default function MantenimientoPage() {
  const sections = [
    {
      title: 'Mantenimiento Predictivo',
      image: '/assets/service-1.jpg',
      items: [
        'Programas integrales PdM',
        'Análisis vibracional',
        'Análisis termográfico',
      ],
    },
    {
      title: 'Mantenimiento Proactivo',
      image: '/assets/service-2.jpg',
      items: [
        'Alineamiento Laser de ejes',
        'Balanceo Dinámico In Situ',
        'Balanceo Computarizado',
      ],
    },
    {
      title: 'Gestión de Mantenimiento',
      image: '/assets/service-3.jpg',
      items: [
        'Gestión de la lubricación',
        'Mantenimiento Integral',
      ],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white pt-32 pb-16">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-slate-900 mb-8 uppercase leading-[1.1] tracking-tighter">
              Mantenimiento Predictivo e{' '}
              <span className="text-[#E2231A]">Ingeniería de Confiabilidad</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-12 font-sans font-medium">
              Ofrecemos soluciones avanzadas de mantenimiento predictivo y confiabilidad para maximizar la disponibilidad, reducir fallas y optimizar el ciclo de vida de los activos.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sections */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {sections.map((section, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="mb-20 last:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                  <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg h-full min-h-[350px]">
                      <Image src={section.image} alt={section.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                    </div>
                  </div>
                  <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm h-full flex flex-col justify-center">
                      <h3 className="text-3xl font-display font-black text-slate-900 mb-8 uppercase">{section.title}</h3>
                      <ul className="space-y-4">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#E2231A] flex-shrink-0 mt-1" />
                            <span className="text-slate-600 font-sans font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-slate-900 mb-8 uppercase">
              Maximiza la disponibilidad de tus activos
            </h2>
            <p className="text-lg text-slate-600 mb-12 font-sans font-medium">
              Implementa estrategias de mantenimiento predictivo basadas en datos para optimizar el desempeño de tu operación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-4 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm">
                Solicitar Asesoría
              </Link>
              <Link href="/" className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#02115C] text-[#02115C] font-sans font-bold uppercase tracking-wider hover:bg-[#02115C] hover:text-white transition-all duration-300 text-sm">
                Volver al inicio
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
