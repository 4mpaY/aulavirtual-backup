import Image from 'next/image'
import Link from 'next/link'

import { Calendar, Clock, ArrowRight } from 'lucide-react'

import ScrollReveal from '@/features/web/home/components/ScrollReveal'

export const metadata = {
  title: 'Blog — Terramett SAC',
  description: 'Artículos, novedades y recursos sobre topografía, geodesia, fotogrametría e ingeniería civil.',
}

const blogPosts = [
  {
    id: 'fotogrametria-drones-futuro',
    title: 'Fotogrametría con Drones: El Futuro de la Topografía',
    excerpt: 'Descubre cómo los drones están revolucionando los levantamientos topográficos con mayor precisión y eficiencia. La fotogrametría con drones ha transformado radicalmente la manera en que realizamos levantamientos topográficos.',
    image: '/assets/terramett/fotogrametria.jpg',
    date: '15 Enero 2026',
    readTime: '5 min',
    category: 'Tecnología',
  },
  {
    id: 'gnss-alta-precision',
    title: 'GNSS de Alta Precisión en Proyectos de Ingeniería',
    excerpt: 'La tecnología GNSS permite obtener coordenadas con precisión milimétrica para proyectos de gran escala. Los sistemas globales de navegación por satélite son hoy indispensables en la ingeniería moderna.',
    image: '/assets/terramett/geodesia-gnss.jpg',
    date: '10 Enero 2026',
    readTime: '7 min',
    category: 'Geodesia',
  },
  {
    id: 'estaciones-totales-guia',
    title: 'Estaciones Totales: Guía Completa para Topógrafos',
    excerpt: 'Todo lo que necesitas saber sobre el uso y mantenimiento de estaciones totales modernas. A pesar del auge de nuevas tecnologías, la estación total sigue siendo el caballo de batalla de la topografía.',
    image: '/assets/terramett/equipos-et.jpg',
    date: '5 Enero 2026',
    readTime: '10 min',
    category: 'Equipos',
  },
  {
    id: 'que-es-bim-importancia-ingenieria',
    title: '¿Qué es BIM y por qué es importante en la ingeniería?',
    excerpt: 'El BIM es una metodología que permite diseñar y supervisar proyectos mediante modelos digitales inteligentes. En TERRAMETT, el BIM se apoya en información topográfica confiable.',
    image: '/assets/terramett/cursos-naviswork.jpg',
    date: '20 Enero 2026',
    readTime: '6 min',
    category: 'BIM',
  },
]

export default function BlogsPage() {
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
            Blog & Recursos
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Artículos y Novedades
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Mantente actualizado con las últimas tendencias, tecnologías y mejores prácticas en topografía e ingeniería.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <Link href={`/blogs/${post.id}`} className="block group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EBF5FB] hover:border-[#88C7E6]/50 h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1177AB] text-white px-3 py-1.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-[#4d6b7d] mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </div>
                      <h2 className="font-display text-xl font-bold text-[#0D3A52] mb-3 leading-snug group-hover:text-[#1177AB] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-[#4d6b7d] leading-relaxed flex-grow">{post.excerpt}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-[#1177AB] font-semibold text-sm group-hover:gap-3 transition-all">
                        Leer más <ArrowRight size={15} />
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#EBF5FB] py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[#0D3A52] mb-4">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-[#4d6b7d] text-lg mb-8">
            Contacta con nuestros especialistas y obtén una asesoría técnica personalizada.
          </p>
          <Link href="/contacto" className="btn-primary inline-flex items-center gap-2">
            Contáctanos <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
