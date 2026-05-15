import Image from 'next/image'
import Link from 'next/link'

import { MapPin, Droplets, CloudRain, Mountain, Building2, Globe, Camera, CheckCircle2, ArrowRight } from 'lucide-react'

import ScrollReveal from '@/features/web/home/components/ScrollReveal'

export const metadata = {
  title: 'Servicios — Terramett SAC',
  description: 'Topografía, Geodesia, Fotogrametría, Hidráulica, Hidrología, Geotecnia e Ingeniería Civil. Soluciones integrales de ingeniería en todo el Perú.',
}

const services = [
  {
    icon: MapPin,
    title: 'Topografía',
    description: 'Levantamientos topográficos de alta precisión, replanteos, control geodésico y estudios catastrales con equipos de última generación.',
    features: ['Levantamientos topográficos', 'Replanteo de obras', 'Control geodésico', 'Estudios catastrales'],
    image: '/assets/terramett/topografia-lev.jpeg',
  },
  {
    icon: Globe,
    title: 'Geodesia',
    description: 'Georreferenciación de predios y posicionamiento GNSS de alta precisión para proyectos de gran envergadura.',
    features: ['Georreferenciación de Predios', 'Posicionamiento GNSS (Estático y RTK)', 'Certificación de puntos Orden A, B y C', 'Fotogrametría Georreferenciada'],
    image: '/assets/terramett/Geodesia-GNNS-4.jpg',
  },
  {
    icon: Camera,
    title: 'Fotogrametría',
    description: 'Ortomosaicos de altísima resolución y modelos digitales para un análisis detallado del terreno.',
    features: ['Ortomosaicos de Altísima Resolución', 'Nubes de Puntos 3D', 'Modelos Digitales de Elevación (MDT/MDE)', 'Cálculo Preciso de Volúmenes'],
    image: '/assets/terramett/fotogrametria.jpg',
  },
  {
    icon: Droplets,
    title: 'Hidráulica',
    description: 'Diseño y análisis de sistemas hidráulicos, redes de agua potable, alcantarillado y obras de conducción.',
    features: ['Redes de agua potable', 'Sistemas de alcantarillado', 'Obras de conducción', 'Modelamiento hidráulico'],
    image: '/assets/terramett/hidraulica.jpg',
  },
  {
    icon: CloudRain,
    title: 'Hidrología',
    description: 'Estudios hidrológicos, análisis de cuencas, modelamiento de escorrentía y gestión de recursos hídricos.',
    features: ['Estudios de cuencas', 'Análisis de escorrentía', 'Gestión de recursos hídricos', 'Drenaje pluvial'],
    image: '/assets/terramett/hidrologia.jpg',
  },
  {
    icon: Mountain,
    title: 'Geotecnia',
    description: 'Estudios geotécnicos, análisis de suelos, estabilidad de taludes y diseño de cimentaciones.',
    features: ['Estudios de suelos', 'Estabilidad de taludes', 'Diseño de cimentaciones', 'Capacidad portante'],
    image: '/assets/terramett/cursos-geotecnia.jpg',
  },
  {
    icon: Building2,
    title: 'Ingeniería Civil',
    description: 'Diseño estructural, supervisión de obras, expedientes técnicos y gestión integral de proyectos.',
    features: ['Diseño estructural', 'Expedientes técnicos', 'Supervisión de obras', 'Gestión de proyectos'],
    image: '/assets/terramett/civil.jpg',
  },
]

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1177AB] py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#88C7E6]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-xs font-bold uppercase tracking-widest mb-6">
            Nuestros Servicios
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Soluciones integrales de ingeniería
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Más de 12 años brindando servicios de alta precisión técnica en topografía, geomática e ingeniería civil para proyectos en todo el Perú.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="space-y-20">
            {services.map((service, i) => {
              const Icon = service.icon
              const isEven = i % 2 === 0

              return (
                <ScrollReveal key={service.title} delay={0.1}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                    {/* Imagen */}
                    <div className="relative group rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={600}
                        height={400}
                        className="w-full object-cover aspect-[3/2] group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#1177AB]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-[#1177AB] flex items-center justify-center shadow-lg">
                        <Icon size={22} className="text-white" />
                      </div>
                    </div>

                    {/* Contenido */}
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1177AB]/10 text-[#1177AB] text-xs font-bold uppercase tracking-widest mb-4">
                        {service.title}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0D3A52] mb-4 leading-tight">
                        {service.title}
                      </h2>
                      <p className="text-[#4d6b7d] text-lg leading-relaxed mb-8">{service.description}</p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map(f => (
                          <li key={f} className="flex items-center gap-3 text-[#0D3A52]">
                            <CheckCircle2 size={18} className="text-[#1177AB] shrink-0" />
                            <span className="font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contacto"
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        Solicitar Cotización <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#EBF5FB] py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0D3A52] mb-4">
            ¿Necesitas un servicio personalizado?
          </h2>
          <p className="text-[#4d6b7d] text-lg mb-8">
            Contáctanos y nuestro equipo te brindará una solución a medida para tu proyecto.
          </p>
          <Link href="/contacto" className="btn-primary inline-flex items-center gap-2">
            Contáctanos <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
