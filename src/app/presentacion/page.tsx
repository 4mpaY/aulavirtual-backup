'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Users,
  MessageSquare,
  Shield,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react'

export default function PresentacionPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--web-primary, #25927F) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, var(--web-light, #BDD962) 0%, transparent 70%)' }}
      />

      {/* ─── NAVIGATION BAR ───────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-teal-700/20 transform transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--web-dark, #025E44) 0%, var(--web-primary, #25927F) 100%)' }}
            >
              AV
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
                Aula<span style={{ color: 'var(--web-primary, #25927F)' }}>Virtual</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider uppercase text-slate-400">Plataforma Educativa</span>
            </div>
          </Link>

          {/* Desktop Nav Buttons */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all no-underline flex items-center gap-1.5"
            >
              Inicio
            </Link>
            <Link 
              href="/nosotros"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all no-underline flex items-center gap-1.5"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all no-underline flex items-center gap-1.5"
            >
              Contáctanos
            </Link>
          </nav>

          {/* CTA Header Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="no-underline inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg shadow-teal-700/10 hover:shadow-teal-700/20 transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                background: 'linear-gradient(135deg, var(--web-primary, #25927F) 0%, var(--web-dark, #025E44) 100%)',
              }}
            >
              Ingresar al Aula
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200/90 shadow-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all no-underline flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                🏠
              </div>
              Inicio
            </Link>
            <Link 
              href="/nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all no-underline flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                👥
              </div>
              Nosotros
            </Link>
            <Link 
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all no-underline flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                ✉️
              </div>
              Contáctanos
            </Link>
            
            <hr className="border-slate-100 my-1" />

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="no-underline w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-teal-700/10"
              style={{ background: 'linear-gradient(135deg, var(--web-primary, #25927F) 0%, var(--web-dark, #025E44) 100%)' }}
            >
              Ingresar al Aula
            </Link>
          </div>
        )}
      </header>

      {/* ─── HERO / CUERPO PRINCIPAL ──────────────────────── */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100/80 shadow-sm">
                <Sparkles size={14} className="text-teal-600 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 font-display">
                  Presentación de la Plataforma
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight font-display">
                Una nueva forma de <br className="hidden sm:inline" />
                aprender y <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">crecer profesionalmente</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Bienvenido a nuestro espacio de presentación. Esta sección está lista para albergar la información más importante sobre nuestra visión educativa, las herramientas innovadoras que ofrecemos y el impacto de nuestros programas.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                <Link 
                  href="/"
                  className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-teal-700/20 transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--web-primary, #25927F)' }}
                >
                  Ir al Inicio <ArrowRight size={18} />
                </Link>
                
                <Link 
                  href="/nosotros"
                  className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-800 border border-slate-200 shadow-md transition-all hover:scale-105 hover:bg-slate-50"
                >
                  Conócenos
                </Link>

                <Link 
                  href="/contacto"
                  className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-teal-700 hover:text-teal-800 bg-teal-50/60 border border-teal-100 transition-all hover:scale-105 hover:bg-teal-50"
                  style={{ color: 'var(--web-dark, #025E44)' }}
                >
                  Contáctanos
                </Link>
              </div>

              {/* Quick Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 mt-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="font-extrabold text-2xl text-slate-900">100%</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Online</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-slate-900">Flexibilidad</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Horaria</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-slate-900">Garantía</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">De Calidad</div>
                </div>
              </div>

            </div>

            {/* Right Mockup Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Glassmorphic Presentation Card */}
              <div className="w-full max-w-[420px] rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-8 relative z-10 hover:shadow-teal-900/5 transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Plantilla
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl">
                    💡
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-950 tracking-tight font-display">
                    Sección Informativa
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Este es un bloque interactivo listo para mostrar información clave sobre cursos, especializaciones, docentes o metodología.
                  </p>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold text-slate-600">
                      Listo para ser editado
                    </span>
                  </div>

                  <Link
                    href="/contacto"
                    className="no-underline w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-850 transition-all hover:scale-[1.02]"
                  >
                    Consultar Ahora <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Background Glow behind Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-teal-400/10 to-emerald-400/10 blur-3xl pointer-events-none" />
            </div>

          </div>
        </section>

        {/* ─── SECCIONES INFORMATIVAS (CONTENEDORES) ───────── */}
        <section className="py-20 bg-white border-t border-slate-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Grid for Pillars/Information Blocks */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Pillar 1: Inicio Quick Link card */}
              <div className="group rounded-3xl p-8 bg-slate-50/50 border border-slate-100 hover:border-teal-200/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center transition-all group-hover:scale-110">
                  <BookOpen size={24} />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 font-display">
                  Nuestros Cursos
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Explora nuestra amplia gama de programas educativos, rutas de aprendizaje y capacitaciones corporativas diseñadas por líderes del sector.
                </p>
                <Link
                  href="/"
                  className="no-underline inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 group/link"
                >
                  Ir al Inicio <ArrowRight size={14} className="transform transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>

              {/* Pillar 2: Nosotros Quick Link card */}
              <div className="group rounded-3xl p-8 bg-slate-50/50 border border-slate-100 hover:border-teal-200/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center transition-all group-hover:scale-110">
                  <Users size={24} />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 font-display">
                  ¿Quiénes Somos?
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Conoce más sobre nuestra misión institucional, visión y los valores fundamentales que orientan el éxito de cada estudiante.
                </p>
                <Link
                  href="/nosotros"
                  className="no-underline inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 group/link"
                >
                  Conocer Nosotros <ArrowRight size={14} className="transform transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>

              {/* Pillar 3: Contacto Quick Link card */}
              <div className="group rounded-3xl p-8 bg-slate-50/50 border border-slate-100 hover:border-teal-200/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center transition-all group-hover:scale-110">
                  <MessageSquare size={24} />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 font-display">
                  Soporte y Contacto
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  ¿Tienes dudas o necesitas una capacitación a la medida? Nuestro equipo de consultores académicos está listo para ayudarte en todo momento.
                </p>
                <Link
                  href="/contacto"
                  className="no-underline inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 group/link"
                >
                  Contáctanos <ArrowRight size={14} className="transform transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>

            </div>

            {/* Empty Segment for future Content */}
            <div className="mt-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Layers size={22} />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 mb-2 font-display">
                Área de Contenido Adicional
              </h4>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed mb-6">
                Este espacio está diseñado para albergar testimonios, logos de clientes, preguntas frecuentes o características detalladas de la plataforma que desees añadir en el futuro.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" /> Testimonios
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" /> Beneficios
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" /> FAQs
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Contacto Segment */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, var(--web-primary, #25927F) 0%, transparent 80%)' }}
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              ¿Listo para empezar a planificar tu contenido?
            </h2>
            <p className="text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
              Esta página de presentación ya está lista. Puedes empezar a agregar los textos definitivos, imágenes representativas y personalizar los enlaces para adaptarlos a tu proyecto.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link 
                href="/contacto"
                className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-50"
              >
                Ir a Contáctanos <ArrowRight size={18} />
              </Link>
              
              <Link 
                href="/nosotros"
                className="no-underline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border border-slate-700 hover:border-slate-600 text-white transition-all hover:scale-105 hover:bg-white/5"
              >
                Ver Página Nosotros
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white text-xs"
              style={{ background: 'linear-gradient(135deg, var(--web-primary, #25927F) 0%, var(--web-dark, #025E44) 100%)' }}
            >
              AV
            </div>
            <span className="font-bold text-sm text-slate-300 font-display">
              AulaVirtual
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link href="/" className="hover:text-slate-300 transition-colors no-underline">Inicio</Link>
            <Link href="/nosotros" className="hover:text-slate-300 transition-colors no-underline">Nosotros</Link>
            <Link href="/contacto" className="hover:text-slate-300 transition-colors no-underline">Contacto</Link>
          </div>
          
          <div className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} AulaVirtual. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
