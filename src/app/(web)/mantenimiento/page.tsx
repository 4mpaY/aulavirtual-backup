import Link from 'next/link'
import Image from 'next/image'

import { CheckCircle2 } from 'lucide-react'

import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { getConfigs } from '@/utils/libs/config'
import PageHeader from '@/utils/components/layout/web/PageHeader'

export const metadata = {
  title: 'Mantenimiento - ARM',
  description: 'Soluciones de mantenimiento predictivo y proactivo',
}

export default async function MantenimientoPage() {
  const configs = await getConfigs()
  const waNumero = configs.WHATSAPP_NUMERO || '51959436827'

  const sections = [
    {
      title: 'Mantenimiento Predictivo',
      images: [
        '/assets/services/mantenimiento/mantenimiento-predictivo.jpg',
      ],
      items: [
        'Programas integrales PdM',
        'Análisis vibracional',
        'Análisis termográfico',
      ],
    },
    {
      title: 'Mantenimiento Proactivo',
      images: [
        '/assets/services/mantenimiento/mantenimiento-proactivo.jpg',
      ],
      items: [
        'Alineamiento Laser de ejes',
        'Balanceo Dinámico In Situ',
        'Balanceo Computarizado',
      ],
    },
    {
      title: 'Gestión de Mantenimiento',
      images: [
        '/assets/services/mantenimiento/gestion-de-mantenimiento.jpeg',
      ],
      items: [
        'Gestión de la lubricación',
        'Mantenimiento Integral',
      ],
    },
  ]

  return (
    <>
      <PageHeader
        label="Nuestros Servicios"
        title="Mantenimiento e Ingeniería de Confiabilidad"
        description="Soluciones avanzadas de mantenimiento predictivo y confiabilidad para maximizar la disponibilidad y optimizar el ciclo de vida de los activos."
        ctaText="Solicitar servicio"
        ctaHref="/contacto"
        imageSrc="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Sections */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {sections.map((section, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="mb-20 last:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                  <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="flex flex-col gap-3 h-full min-h-[380px]">
                      <div className="relative overflow-hidden rounded-2xl shadow-lg flex-1">
                        <Image src={section.images[0]} alt={section.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                      </div>
                      {section.images[1] && (
                        <div className="relative overflow-hidden rounded-2xl shadow-lg h-[150px] shrink-0">
                          <Image src={section.images[1]} alt={section.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm h-full flex flex-col justify-center">
                      <span className="text-[10px] font-display font-black text-[#E2231A] uppercase tracking-[0.35em] mb-3 block">
                        {String(idx + 1).padStart(2, '0')} — Mantenimiento
                      </span>
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
              <a
                href={`https://wa.me/${waNumero}?text=Estoy%20interesado%20en%20el%20servicio%20de%20Mantenimiento%20Predictivo%20e%20Ingenier%C3%ADa%20de%20Confiabilidad%20de%20ARM`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm"
              >
                Solicitar Asesoría
              </a>
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
