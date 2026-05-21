'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  ArrowRight,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Map,
  Building2,
  Award,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react'

export default function HomePage() {
  const [certCode, setCertCode] = useState('')
  const [certResult, setCertResult] = useState<string | null>(null)
  const [navbarVisible, setNavbarVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Sincroniza con el scroll-reveal del WebHeader
  useEffect(() => {
    if (window.scrollY > 10) {
      setHasScrolled(true)
      setNavbarVisible(true)
    }

    const onScroll = () => {
      if (window.scrollY > 10 && !hasScrolled) {
        setHasScrolled(true)
        setNavbarVisible(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [hasScrolled])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!certCode.trim()) return

    if (certCode.toUpperCase() === 'CEGAE-2026') {
      setCertResult('VALIDO: Certificado oficial emitido a favor de Juan Pérez en Neuroeducación.')
    } else {
      setCertResult('No se encontró ningún certificado con ese código. Intente de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative" style={{ marginTop: 'calc(-1 * var(--navbar-height))', overflowX: 'hidden' }}>
      
      {/* ─── FLOATING BACKGROUND DECORATIONS ─── */}
      <div 
        className="absolute top-[-100px] right-[-100px] w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-30 animate-pulse"
        style={{ background: 'radial-gradient(circle, var(--web-primary, #25927F) 0%, transparent 70%)', animationDuration: '8s' }}
      />
      <div 
        className="absolute top-[40%] left-[-200px] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--web-light, #BDD962) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[10%] right-[-100px] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, var(--web-primary, #25927F) 0%, transparent 70%)' }}
      />

      <main className="flex-1">
        
        {/* ─── HERO SECTION (GRADIENT & DIAGONALS) ─── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1e1b] to-slate-950 text-white border-b border-teal-950/40 flex items-center"
          style={{
            minHeight: '100vh',
            paddingTop: navbarVisible ? 'var(--navbar-height)' : '0',
            transition: 'padding-top 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
          
          <div className="max-w-7xl w-full mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-16 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex self-center lg:self-start items-center gap-2.5 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 shadow-inner backdrop-blur-md">
                <Sparkles size={14} className="text-teal-300 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-teal-200">
                  TE ACOMPAÑAMOS EN TU PERFECCIONAMIENTO PROFESIONAL
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-display">
                Formación profesional <br className="hidden sm:inline" />
                que <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-300 bg-clip-text text-transparent drop-shadow-sm">transforma tu futuro</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                En <strong className="text-white">CEGAE Ribeyro</strong> diseñamos especializaciones, capacitaciones y diplomados virtuales orientados a resultados reales para educadores y profesionales del Perú.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                <Link 
                  href="/cursos"
                  className="no-underline inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-slate-950 shadow-xl shadow-teal-400/10 transition-all hover:scale-105 hover:shadow-teal-400/20 active:scale-95"
                  style={{ backgroundColor: 'var(--web-light, #BDD962)' }}
                >
                  Ver Cursos Disponibles <ArrowRight size={18} />
                </Link>
                
                <a 
                  href="https://wa.me/51943570195"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white border border-teal-500/30 hover:border-teal-400 bg-teal-950/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 hover:bg-teal-950/70"
                >
                  Escríbenos por WhatsApp
                </a>
              </div>

              {/* Stats / Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 mt-6 max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col gap-1">
                  <div className="font-black text-3xl text-teal-400">+10</div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Especialidades</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-black text-3xl text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Aula Virtual</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-black text-3xl text-lime-400">Oficial</div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Certificación</div>
                </div>
              </div>

            </div>

            {/* Right Graphic card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[420px] rounded-[32px] bg-slate-900/90 border border-teal-500/20 shadow-2xl overflow-hidden relative z-10 hover:border-teal-500/40 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" 
                  alt="Clase Virtual CEGAE Ribeyro" 
                  className="w-full h-52 object-cover border-b border-teal-500/15 filter brightness-95 hover:brightness-100 transition-all duration-300"
                />
                <div className="p-8 flex flex-col gap-5">
                  <div className="text-[10px] font-black text-slate-900 bg-gradient-to-r from-teal-400 to-lime-300 px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start shadow-sm">
                    CLASES EN VIVO Y GRABADAS
                  </div>
                  <h3 className="font-extrabold text-xl text-white tracking-tight font-display">
                    Tu carrera magisterial y profesional empieza aquí
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Accede a simulacros, casuística oficial y asesoría personalizada de primer nivel con especialistas en educación.
                  </p>
                  <Link
                    href="/cursos"
                    className="no-underline w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff' }}
                  >
                    Explorar Programas <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full bg-gradient-to-tr from-teal-500/10 to-lime-500/10 blur-3xl pointer-events-none" />
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 1: NOSOTROS (DISEÑO ASIMÉTRICO Y COLORIDO) ─── */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Image with double border frame */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-dashed border-teal-500/30 rounded-[32px] pointer-events-none" />
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-white relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" 
                  alt="Historia de CEGAE Ribeyro" 
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent" />
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40"
                style={{ backgroundColor: 'var(--web-light, #BDD962)' }}
              />
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-xs font-bold text-teal-800">
                <Users size={14} className="text-teal-600" /> SOBRE NOSOTROS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
                Nacidos para acompañar tu <span className="text-teal-600">perfeccionamiento profesional</span>
              </h2>
              <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--web-primary, #25927F)' }} />
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                La historia de CEGAE Ribeyro comenzó en el año 2020, en uno de los momentos más desafiantes para la educación en el Perú. Ideamos un espacio educativo accesible, humano y enfocado en capacitar a miles de docentes de manera práctica.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Hoy en día estructuramos diplomados y especializaciones de alto impacto curricular, dotados de herramientas virtuales y una metodología enfocada en resultados magisteriales reales.
              </p>
              <div className="mt-2">
                <Link
                  href="/nosotros"
                  className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--web-primary, #25927F)' }}
                >
                  Conoce nuestra Misión y Visión <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 2: CURSOS (TARJETAS DINÁMICAS CON GRADIENTES) ─── */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950 via-slate-950 to-slate-950 opacity-80" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
              <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <GraduationCap size={14} /> PROGRAMAS ACADÉMICOS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight">
                Especialidades de <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-300 bg-clip-text text-transparent">Alto Impacto Curricular</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium max-w-xl mx-auto">
                Selecciona la categoría de tu interés y potencia tu currículum y competencias con nuestros docentes especializados.
              </p>
            </div>

            {/* Grid of Areas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Preparación Docente',
                  desc: 'Nombramiento docente, ascenso de escala magisterial, cargos directivos y auxiliares.',
                  img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
                  color: 'from-emerald-500 to-teal-600',
                  accent: 'var(--web-light, #BDD962)'
                },
                {
                  title: 'Salud y Psicología',
                  desc: 'Estimulación temprana, problemas de aprendizaje, psicopedagogía y salud emocional.',
                  img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
                  color: 'from-teal-500 to-cyan-600',
                  accent: '#38bdf8'
                },
                {
                  title: 'Gestión Pública',
                  desc: 'Diplomados y cursos de administración pública, gobernabilidad y contrataciones del Estado.',
                  img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
                  color: 'from-amber-500 to-orange-600',
                  accent: '#fb923c'
                },
                {
                  title: 'Tecnología e IA',
                  desc: 'Inteligencia artificial aplicada a la docencia, herramientas digitales y metodologías activas.',
                  img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
                  color: 'from-indigo-500 to-purple-600',
                  accent: '#c084fc'
                }
              ].map((area, i) => (
                <div key={i} className="group rounded-[28px] border border-slate-800 overflow-hidden bg-slate-950/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-950/50 transition-all duration-300 flex flex-col relative">
                  
                  {/* Decorative Gradient Background Glow on Card hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="h-44 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
                    <img 
                      src={area.img} 
                      alt={area.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90"
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3 flex-1 relative z-20">
                    {/* Badge Indicator */}
                    <div 
                      className="w-8 h-1 rounded-full mb-1" 
                      style={{ backgroundColor: area.accent }}
                    />
                    <h3 className="font-extrabold text-lg text-white font-display">
                      {area.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium flex-1">
                      {area.desc}
                    </p>
                    <Link
                      href="/cursos"
                      className="no-underline inline-flex items-center gap-1.5 text-xs font-bold transition-all hover:translate-x-1"
                      style={{ color: area.accent }}
                    >
                      Explorar área <ChevronRight size={14} />
                    </Link>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 3: RUTAS (DISEÑO ILUSTRATIVO DE LÍNEA DE TIEMPO) ─── */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
                <Map size={14} className="text-teal-600" /> RUTAS DE APRENDIZAJE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
                El camino estructurado <br />
                hacia tu <span className="text-teal-600">certificación profesional</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Evita cursos aislados sin rumbo. Nuestras rutas combinan módulos secuenciales diseñados por expertos pedagógicos para formarte integralmente.
              </p>

              {/* Timeline Cards */}
              <div className="flex flex-col gap-6 mt-4 relative pl-4 border-l-2 border-teal-100">
                {[
                  { num: '1', title: 'Planificación de la Ruta', desc: 'Identificas tu objetivo y te inscribes en el itinerario sugerido.', color: 'bg-teal-500' },
                  { num: '2', title: 'Ejecución y Talleres', desc: 'Clases participativas con análisis de casos y foros permanentes.', color: 'bg-emerald-500' },
                  { num: '3', title: 'Certificación e Inscripción', desc: 'Recibes tu certificado oficial válido para concursos públicos.', color: 'bg-lime-500' },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex gap-4 items-start">
                    {/* Circle timeline bullet */}
                    <span className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full ${step.color} border-4 border-white shadow-sm`} />
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex-1 hover:shadow-md transition-shadow">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">Paso {step.num}:</span> {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href="/rutas"
                  className="no-underline inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--web-primary, #25927F)' }}
                >
                  Ver Rutas de Aprendizaje <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Image with glowing frame */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-lime-300 rounded-[40px] rotate-3 blur-sm scale-95 opacity-30 pointer-events-none" />
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80" 
                  alt="Rutas de Aprendizaje CEGAE Ribeyro" 
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 4: EMPRESAS (DISEÑO CONTRASTANTE Y ELEGANTE) ─── */}
        <section className="py-24 bg-[#071613] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-950/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
            
            {/* Left Image */}
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-emerald-500/20 rounded-[32px] pointer-events-none" />
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#071613] relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" 
                  alt="CEGAE Ribeyro para Empresas" 
                  className="w-full h-[400px] object-cover filter brightness-90 hover:brightness-100 transition-all duration-300"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
              <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                <Building2 size={14} /> CAPACITACIÓN INSTITUCIONAL
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight text-white">
                Potenciamos colegios e <br />
                <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">instituciones públicas</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Ofrecemos programas de actualización pedagógica y administración pública adaptados a los requerimientos de UGELs, Municipalidades y Colegios a nivel nacional.
              </p>
              
              {/* Check features list */}
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                {[
                  'Temarios personalizados a su realidad',
                  'Certificados con código QR único',
                  'Flexibilidad de horarios sincrónicos',
                  'Plataforma multi-usuario para control',
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href="/empresas"
                  className="no-underline inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs bg-white text-[#071613] shadow-lg hover:shadow-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
                >
                  Consultar Planes Colectivos <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 5: CERTIFICADOS (DISEÑO FUTURISTA / GLASS) ─── */}
        <section className="py-24 bg-gradient-to-br from-slate-950 via-[#0b1f1a] to-slate-900 text-white relative overflow-hidden">
          
          {/* Neon blobs */}
          <div className="absolute top-1/2 left-[-100px] w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
            
            {/* Left Form Box and Text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-teal-300 backdrop-blur-md">
                <Award size={14} /> VALIDACIÓN MAGISTERIAL
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                Verifica tus horas académicas <br />
                y <span className="bg-gradient-to-r from-teal-400 to-lime-300 bg-clip-text text-transparent">certificaciones oficiales</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Nuestros diplomas y certificados incorporan un folio único respaldado por nuestra base de datos. Compártelo en convocatorias de MINEDU y ascensos.
              </p>

              {/* Glassmorphic Form Box */}
              <form onSubmit={handleVerify} className="bg-white/5 border border-white/10 rounded-[28px] p-8 flex flex-col gap-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-lime-300" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Código de certificado de prueba: <span className="text-lime-300">CEGAE-2026</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Ej. CEGAE-2026" 
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-teal-400 transition-colors placeholder-slate-500 font-bold"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20 active:scale-95"
                  >
                    Verificar Código
                  </button>
                </div>
                {certResult && (
                  <div className={`text-xs p-4 rounded-xl border font-semibold leading-relaxed animate-fade-in ${
                    certResult.startsWith('VALIDO') 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {certResult}
                  </div>
                )}
              </form>

              <div>
                <Link
                  href="/verificar-certificado"
                  className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Ir a Consulta por DNI / RUC <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Mockup Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-lime-500/10 rounded-[32px] blur-3xl pointer-events-none" />
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/15 relative z-10 w-full max-w-[420px] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80" 
                  alt="Certificado Oficial de CEGAE" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ─── SECCIÓN 6: CONTACTO (DISEÑO MODERNO CON GRADIENTES SUAVES) ─── */}
        <section className="py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col gap-4">
              <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
                <MessageSquare size={14} className="text-teal-600" /> ATENCIÓN AL ESTUDIANTE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
                ¿Necesitas asesoría?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
                Nuestros gestores académicos están disponibles para guiarte en tu matrícula, certificados y facilidades de pago.
              </p>
            </div>

            {/* Grid of Contact Info */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* WhatsApp Card */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 flex flex-col gap-5 text-center items-center shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                  <Phone size={26} />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 font-display">Canal WhatsApp</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  Escríbenos en vivo para absolver tus dudas e inscribirte rápidamente.
                </p>
                <a 
                  href="https://wa.me/51943570195" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="no-underline text-xs font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Mensaje al +51 943 570 195
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 flex flex-col gap-5 text-center items-center shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
                  <Mail size={26} />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 font-display">Correo Institucional</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  Envíanos solicitudes formales, corporativas o empresariales directamente a nuestra bandeja.
                </p>
                <a 
                  href="mailto:cegae.ribeyro@gmail.com" 
                  className="no-underline text-xs font-extrabold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-lg transition-colors"
                >
                  cegae.ribeyro@gmail.com
                </a>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 flex flex-col gap-5 text-center items-center shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
                  <MapPin size={26} />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 font-display">Oficina Central</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  Manuel Segura 206 - Dep. 1201, Lince, Lima
                </p>
                <Link 
                  href="/contacto" 
                  className="no-underline text-xs font-extrabold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Ver Mapa de Google
                </Link>
              </div>

            </div>

          </div>
        </section>

      </main>
    </div>
  )
}
