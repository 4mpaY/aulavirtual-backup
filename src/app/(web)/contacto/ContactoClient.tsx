'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Mail, Phone, MapPin, Send, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

import AnimatedSection from '@/features/web/visiona/components/AnimatedSection'

const serviceOptions = [
  'Consultoría',
  'Primera Respuesta',
  'Academy - Formación y Entrenamiento',
  'Activaciones y Eventos BTL en SST',
  'Trabajos de Alto Riesgo',
]

const goldGradient = 'linear-gradient(135deg, hsl(43 74% 49%), hsl(48 89% 50%))'
const glassCard = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }
const inputClass = 'w-full px-4 py-3 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all text-sm'
const inputStyle = { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': '#2d2db3' } as React.CSSProperties

const socialLinks = [
  { icon: 'facebook', url: 'https://www.facebook.com/people/Visiona-Per%C3%BA/100083109343369/' },
  { icon: 'instagram', url: 'https://www.instagram.com/visionaperu_/' },
  { icon: 'linkedin', url: 'https://www.linkedin.com/company/82089696/' },
  { icon: 'youtube', url: 'https://www.youtube.com/@Visionaperu_Academy' },
]

export default function ContactoClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    }, 1500)
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 relative" style={{ background: 'linear-gradient(90deg, #000000 0%, #0a0f3f 30%, #1f1f7a 65%, #2d2db3 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contáctanos</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Contáctanos y generemos impacto real en tu organización.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 md:py-28 border-y border-white/5" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0f3f 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Columna Izquierda: Avatar + Mapa */}
            <div className="space-y-8 order-2 lg:order-1">
              <AnimatedSection delay={0.1}>
                <div className="rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden h-full flex flex-col items-center text-center group" style={glassCard}>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 animate-pulse" style={{ background: 'hsl(43 74% 49% / 0.1)', filter: 'blur(100px)' }} />

                  <div className="relative z-10 w-full mb-10">
                    <motion.div
                      animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-56 h-56 md:w-72 md:h-72 mx-auto relative cursor-pointer"
                    >
                      <div className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: 'hsl(43 74% 49% / 0.2)', filter: 'blur(40px)' }} />
                      <Image
                        src="/visiona/avatar/AvatarVisionaPeru-Agendareunion.png"
                        alt="Agendar reunión con VISIONA"
                        width={300}
                        height={300}
                        className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                      />
                    </motion.div>
                  </div>

                  <div className="relative z-10 space-y-6 max-w-lg">
                    <div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ¿Prefieres una <span style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>reunión</span>?
                      </h3>
                      <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
                        Agendemos una videollamada para conocer a fondo tus necesidades y cómo podemos ayudarte de manera personalizada.
                      </p>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://wa.me/51922873669?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20reuni%C3%B3n"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-xl active:scale-95 group/btn"
                        style={{ background: '#2d2db3' }}
                      >
                        <Calendar className="group-hover/btn:rotate-12 transition-transform" size={24} />
                        Agendar ahora
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Mapa */}
              <AnimatedSection delay={0.3}>
                <div className="rounded-3xl overflow-hidden shadow-2xl h-[350px] relative" style={glassCard}>
                  <iframe
                    title="Ubicación VISIONA"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249744.05579972845!2d-77.12562075!3d-12.0463731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f619ee3ec7%3A0x14206cb9cc452e4a!2sLima!5e0!3m2!1ses!2spe!4v1700000000000"
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    allowFullScreen
                  />
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="px-4 py-2 rounded-lg border shadow-sm" style={{ background: 'rgba(10,15,63,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                        <MapPin size={14} style={{ color: 'hsl(43 74% 49%)' }} />
                        Las Brenias 116 - Chorrillos
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="space-y-8 order-1 lg:order-2">
              <AnimatedSection delay={0.2}>
                <div className="rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden" style={glassCard}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ background: 'hsl(43 74% 49% / 0.05)', filter: 'blur(40px)' }} />

                  <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Envíanos un mensaje</h2>

                  {sent && (
                    <div className="mb-6 p-4 rounded-xl text-green-300 text-sm font-medium" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      ✓ ¡Mensaje enviado! Nos pondremos en contacto pronto.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Nombre *</label>
                        <input type="text" className={inputClass} style={inputStyle} placeholder="Tu nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Email *</label>
                        <input type="email" className={inputClass} style={inputStyle} placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Teléfono</label>
                        <input type="tel" className={inputClass} style={inputStyle} placeholder="+51 922 873 669" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Servicio</label>
                        <select className={inputClass} style={{ ...inputStyle, background: '#0a0f3f' }} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                          <option value="">Selecciona un servicio</option>
                          {serviceOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Mensaje *</label>
                      <textarea className={`${inputClass} min-h-[150px] resize-none pb-4`} style={inputStyle} placeholder="Cuéntanos sobre tu proyecto o necesidad..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full text-white py-5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl"
                      style={{ background: '#2d2db3' }}
                    >
                      {sending ? 'Enviando...' : <><Send size={20} /> Enviar mensaje</>}
                    </button>
                  </form>

                  {/* Info de contacto */}
                  <div className="mt-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-8" style={{ color: 'hsl(43 74% 49%)' }}>Información de contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                      <a href="mailto:visionasafetysolutions@gmail.com" className="flex items-center gap-4 group/item">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all" style={{ background: 'hsl(43 74% 49% / 0.1)' }}>
                          <Mail size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-white/40">Email</span>
                          <span className="text-sm font-medium text-white">visionasafetysolutions@gmail.com</span>
                        </div>
                      </a>
                      <a href="tel:+51922873669" className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'hsl(43 74% 49% / 0.1)' }}>
                          <Phone size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-white/40">Teléfono</span>
                          <span className="text-sm font-medium text-white">+51 922 873 669</span>
                        </div>
                      </a>
                      <a href="https://wa.me/51922873669" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                          <Image src="/visiona/logos/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-white/40">WhatsApp</span>
                          <span className="text-sm font-medium text-white">+51 922 873 669</span>
                        </div>
                      </a>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'hsl(43 74% 49% / 0.1)' }}>
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-white/40">Ubicación</span>
                          <span className="text-sm font-medium text-white">Las Brenias 116 - Chorrillos</span>
                        </div>
                      </div>
                    </div>
                    {/* Social */}
                    <div className="mt-10 flex items-center gap-4">
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest mr-2">Síguenos</span>
                      <div className="flex gap-3">
                        {socialLinks.map((s) => (
                          <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 transition-all" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span className="sr-only">{s.icon}</span>
                            {s.icon === 'facebook' && <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                            {s.icon === 'instagram' && <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>}
                            {s.icon === 'linkedin' && <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}
                            {s.icon === 'youtube' && <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
