import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, MapPin, Droplets, CloudRain, Mountain, Building2, Globe, Camera, Target, Shield, TrendingUp, Users, CheckCircle2, Calendar, Clock, Award, Eye, RotateCcw, Maximize2 } from 'lucide-react'

import HeroSlider from '@/features/web/home/components/HeroSlider'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import ContactSection from '@/features/web/home/components/ContactSection'
import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'

export const metadata = {
  title: 'Terramett SAC — Ingeniería que transforma',
  description: 'Soluciones integrales en topografía, hidráulica, hidrología, geotecnia e ingeniería civil. Más de 12 años de experiencia en el Perú.',
}

// ─── Datos ─────────────────────────────────────────────────────────────────

const services = [
  { icon: MapPin, title: 'Topografía', description: 'Levantamientos topográficos de alta precisión, replanteos, control geodésico y estudios catastrales con equipos de última generación.', image: '/assets/terramett/topografia-lev.jpeg' },
  { icon: Globe, title: 'Geodesia', description: 'Georreferenciación de predios y posicionamiento GNSS de alta precisión para proyectos de gran envergadura.', image: '/assets/terramett/Geodesia-GNNS-4.jpg' },
  { icon: Camera, title: 'Fotogrametría', description: 'Ortomosaicos de altísima resolución y modelos digitales para un análisis detallado del terreno con drones de última generación.', image: '/assets/terramett/fotogrametria.jpg' },
  { icon: Droplets, title: 'Hidráulica', description: 'Diseño y análisis de sistemas hidráulicos, redes de agua potable, alcantarillado y obras de conducción.', image: '/assets/terramett/hidraulica.jpg' },
  { icon: CloudRain, title: 'Hidrología', description: 'Estudios hidrológicos, análisis de cuencas, modelamiento de escorrentía y gestión de recursos hídricos.', image: '/assets/terramett/hidrologia.jpg' },
  { icon: Mountain, title: 'Geotecnia', description: 'Estudios geotécnicos, análisis de suelos, estabilidad de taludes y diseño de cimentaciones.', image: '/assets/terramett/cursos-geotecnia.jpg' },
  { icon: Building2, title: 'Ingeniería Civil', description: 'Diseño estructural, supervisión de obras, expedientes técnicos y gestión integral de proyectos de infraestructura.', image: '/assets/terramett/civil.jpg' },
]

const values = [
  { icon: Target, title: 'Precisión', description: 'Utilizamos equipos de última generación para garantizar resultados exactos.' },
  { icon: Shield, title: 'Confianza', description: '12 años de experiencia nos respaldan en cada proyecto.' },
  { icon: TrendingUp, title: 'Innovación', description: 'Incorporamos las últimas tecnologías en topografía y geomática.' },
  { icon: Users, title: 'Equipo', description: 'Profesionales certificados y comprometidos con la excelencia.' },
]

const achievements = [
  'Clientes en todos los sectores de la industria',
  'Equipos topográficos de precisión milimétrica',
  'Cobertura en todo el territorio peruano',
  'Garantía de puntualidad y calidad',
]

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
]

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1177AB]/8 text-[#1177AB] font-semibold text-xs uppercase tracking-widest border border-[#1177AB]/15 mb-4">
                Nuestros Servicios
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A52] mb-4 leading-tight">
                Soluciones integrales de <span className="text-[#1177AB]">ingeniería</span>
              </h2>
              <p className="text-[#4d6b7d] text-lg max-w-2xl mx-auto">
                Brindamos servicios de alta precisión técnica para proyectos de infraestructura en todo el Perú.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon

              return (
                <ScrollReveal key={service.title} delay={i * 0.07}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EBF5FB] hover:border-[#88C7E6]/50 card-hover">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#1177AB]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-[#1177AB] flex items-center justify-center shadow-lg">
                        <Icon size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-bold text-[#0D3A52] mb-2 group-hover:text-[#1177AB] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[#4d6b7d] leading-relaxed mb-4 line-clamp-3">{service.description}</p>
                      <Link
                        href="/servicios"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1177AB] uppercase tracking-wider hover:gap-3 transition-all duration-300"
                      >
                        Ver más <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link href="/servicios" className="btn-primary inline-flex items-center gap-2">
                Ver todos los servicios <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── VISTA 360° ── */}
      <section id="viewer360" className="section-padding bg-[#EBF5FB]/40">
        <div className="container-custom mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1177AB]/8 text-[#1177AB] font-semibold text-xs uppercase tracking-widest border border-[#1177AB]/15 mb-4">
                Experiencia Inmersiva
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A52] mb-4">
                Vista <span className="text-[#1177AB]">360°</span> de Nuestros Proyectos
              </h2>
              <p className="text-[#4d6b7d] text-lg max-w-2xl mx-auto">
                Explora nuestros trabajos con una vista panorámica interactiva. Navega libremente y descubre cada detalle.
              </p>
            </div>

            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-sm text-[#4d6b7d]">
                <Eye size={17} className="text-[#1177AB]" />
                <span>Arrastra para explorar</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4d6b7d]">
                <RotateCcw size={17} className="text-[#1177AB]" />
                <span>Rotación automática</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4d6b7d]">
                <Maximize2 size={17} className="text-[#1177AB]" />
                <span>Pantalla completa</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#B8DEEF]">
              <div className="aspect-video w-full">
                <iframe
                  src="https://momento360.com/e/u/a17052d2ee764a04ba02662a4f36c075?loop=1&autoplay=1"
                  className="w-full h-full"
                  allowFullScreen
                  title="Vista 360° de proyecto Terramett"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-center text-sm text-[#4d6b7d] mt-4">
              Proyecto de levantamiento topográfico — Vista panorámica interactiva
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className="section-padding bg-[#EBF5FB]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#88C7E6]/10 -skew-x-12 translate-x-1/2 -z-10" />
        <div className="container-custom mx-auto">
          <ScrollReveal>
            <div className="flex justify-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1177AB]/8 text-[#1177AB] font-semibold text-xs uppercase tracking-widest border border-[#1177AB]/15">
                Sobre Nosotros
              </span>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            {/* Texto */}
            <ScrollReveal direction="left">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0D3A52] leading-[1.1] mb-8">
                Terramett: <span className="text-[#1177AB]">Precisión</span> que respalda el diseño, control que garantiza la obra.
              </h2>
              <div className="space-y-5 text-[#4d6b7d] text-base leading-relaxed">
                <p>
                  <strong className="text-[#0D3A52] font-bold text-lg">TERRAMETT SAC</strong> es una empresa peruana especializada en mediciones topográficas aplicadas al diseño, ejecución y supervisión de obras de infraestructura, con más de 12 años de experiencia en el rubro de la ingeniería.
                </p>
                <p>
                  Brindamos soluciones técnicas confiables en levantamientos topográficos, control geométrico, replanteos y monitoreo de obras, integrando precisión, criterio ingenieril y tecnología especializada para garantizar una correcta toma de decisiones en cada etapa del proyecto.
                </p>
                <p>
                  Trabajamos bajo estándares técnicos y control de calidad, empleando equipos modernos y metodologías compatibles con entornos <strong className="text-[#0D3A52]">CAD y BIM</strong>, aportando valor en proyectos viales, saneamiento, edificaciones e infraestructura en general.
                </p>
                <p className="font-medium text-[#0D3A52] italic border-l-4 border-[#88C7E6] pl-5 py-2 bg-[#88C7E6]/10 rounded-r-lg">
                  TERRAMETT es su aliado estratégico para asegurar precisión, control y cumplimiento en obras de infraestructura.
                </p>
              </div>

              {/* Valores */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                {values.map(v => {
                  const Icon = v.icon

                  return (
                    <div key={v.title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#EBF5FB] hover:border-[#88C7E6]/50 hover:shadow-md transition-all duration-300">
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-[#1177AB]/10 flex items-center justify-center">
                        <Icon size={18} className="text-[#1177AB]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0D3A52] text-sm">{v.title}</div>
                        <div className="text-xs text-[#4d6b7d] leading-snug mt-0.5">{v.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollReveal>

            {/* Imagen + logros */}
            <ScrollReveal direction="right">
              <div className="relative group mb-8">
                <div className="absolute -inset-4 bg-[#88C7E6]/20 rounded-[2rem] blur-2xl group-hover:bg-[#88C7E6]/30 transition-colors duration-500" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/assets/terramett/Terramett-hero1.webp"
                    alt="Equipo profesional TERRAMETT"
                    width={600}
                    height={450}
                    className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Badge flotante */}
                  <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl">
                    <div className="w-12 h-12 rounded-xl bg-[#1177AB] flex items-center justify-center">
                      <Award className="text-white" size={24} />
                    </div>
                    <div className="text-white">
                      <div className="font-display text-2xl font-black leading-none">12+</div>
                      <div className="text-[10px] font-bold uppercase tracking-wide opacity-90">Años de<br />Experiencia</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {achievements.map(a => (
                  <div key={a} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#EBF5FB] hover:border-[#88C7E6]/50 hover:shadow-md transition-all duration-300 group">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-[#1177AB] transition-colors">
                      <CheckCircle2 size={18} className="text-[#1177AB] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-[#0D3A52]/80 leading-snug">{a}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/nosotros" className="btn-primary inline-flex items-center gap-2">
                  Conoce Nuestra Historia <ArrowRight size={18} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Verificación de Certificados */}
      <SearchCertificateSection />

      {/* ── BLOGS ── */}
      <section id="blogs" className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1177AB]/8 text-[#1177AB] font-semibold text-xs uppercase tracking-widest border border-[#1177AB]/15 mb-4">
                Blog & Recursos
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A52] mb-4">
                Artículos y <span className="text-[#1177AB]">Novedades</span>
              </h2>
              <p className="text-[#4d6b7d] text-lg max-w-2xl mx-auto">
                Mantente actualizado con las últimas tendencias, tecnologías y mejores prácticas en ingeniería.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <Link href={`/blogs/${post.id}`} className="block group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EBF5FB] hover:border-[#88C7E6]/50 card-hover h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1177AB] text-white px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-[#4d6b7d] mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#0D3A52] mb-3 leading-snug group-hover:text-[#1177AB] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#4d6b7d] leading-relaxed line-clamp-3 flex-grow">{post.excerpt}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[#1177AB] font-semibold text-sm group-hover:gap-3 transition-all">
                        Leer más <ArrowRight size={15} />
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link href="/blogs" className="btn-primary inline-flex items-center gap-2">
                Ver todos los artículos <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <ContactSection />

      {/* ── CTA ── */}
      <section className="relative bg-[#1177AB] px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#88C7E6]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <span className="inline-flex items-center px-3 py-1 bg-white/15 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
              Consultoría Técnica
            </span>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              ¿Listo para transformar tu proyecto?
            </h2>
            <p className="text-white/80 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
              Contacta con nuestro equipo de ingenieros especializados y obtén una cotización personalizada para tu proyecto.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1177AB] font-bold uppercase tracking-wider hover:bg-[#EBF5FB] transition-all duration-300 text-sm shadow-xl rounded-lg group"
              >
                Solicitar Cotización
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300 text-sm rounded-lg"
              >
                Ver Servicios
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
