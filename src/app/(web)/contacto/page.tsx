'use client'

import { useState } from 'react'

import { Send, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

const phoneNumbers = {
  ingenieria: '51952914761',
  topografia: '51989784114',
}

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'ingenieria',
    service: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { name, email, phone, area, service, message } = formData
    const selectedPhone = phoneNumbers[area as keyof typeof phoneNumbers]

    const whatsappMessage = encodeURIComponent(
      `¡Hola! Mi nombre es *${name}*.\n\n` +
      `📧 Email: ${email}\n` +
      `📱 Teléfono: ${phone}\n` +
      `🔧 Servicio de interés: ${service || 'No especificado'}\n\n` +
      `📝 Mensaje:\n${message}`
    )

    window.open(`https://wa.me/${selectedPhone}?text=${whatsappMessage}`, '_blank')

    setSent(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', phone: '', area: 'ingenieria', service: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-[#B8DEEF] bg-white text-[#0D3A52] placeholder:text-[#4d6b7d]/50 focus:outline-none focus:ring-2 focus:ring-[#1177AB] focus:border-transparent transition-all text-sm'

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1177AB] py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#88C7E6]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 text-white">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-xs font-bold uppercase tracking-widest mb-6">
            Contáctanos
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            ¿Tienes un proyecto en mente?
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Estamos listos para ayudarte. Completa el formulario y nos pondremos en contacto contigo a la brevedad.
          </p>
        </div>
      </section>

      {/* Formulario + Info */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Formulario */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 shadow-sm border border-[#EBF5FB] h-full flex flex-col"
              >
                {sent && (
                  <div className="mb-6 p-4 rounded-xl bg-[#1177AB]/10 border border-[#1177AB]/20 text-[#1177AB] font-semibold text-sm">
                    ✅ ¡Mensaje preparado! Se abrió WhatsApp para enviar tu consulta.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Nombre completo *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Tu nombre" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Correo electrónico *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" className={inputClass} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Teléfono *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+51 999 999 999" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Área de interés *</label>
                    <select name="area" value={formData.area} onChange={handleChange} required className={inputClass}>
                      <option value="ingenieria">Área Ingeniería</option>
                      <option value="topografia">Área Topografía</option>
                    </select>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Servicio de interés</label>
                  <select name="service" value={formData.service} onChange={handleChange} className={inputClass}>
                    <option value="">Selecciona un servicio</option>
                    <option value="Topografía">Topografía</option>
                    <option value="Geodesia">Geodesia</option>
                    <option value="Fotogrametría">Fotogrametría</option>
                    <option value="Hidráulica">Hidráulica</option>
                    <option value="Hidrología">Hidrología</option>
                    <option value="Geotecnia">Geotecnia</option>
                    <option value="Ingeniería Civil">Ingeniería Civil</option>
                    <option value="Cursos">Cursos y Capacitaciones</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="mb-6 flex-grow">
                  <label className="block text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-2">Mensaje *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Send size={17} />
                  {isSubmitting ? 'Enviando...' : 'Enviar por WhatsApp'}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tarjeta info */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#EBF5FB]">
                <h3 className="font-display text-xl font-bold text-[#0D3A52] mb-6">Información de Contacto</h3>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: 'Área Ingeniería', value: '+51 952 914 761', href: 'tel:+51952914761' },
                    { icon: Phone, label: 'Área Topografía', value: '+51 989 784 114', href: 'tel:+51989784114' },
                    { icon: Mail,  label: 'Correo',          value: 'diego.utrilla@terramett.pe', href: 'mailto:diego.utrilla@terramett.pe' },
                    { icon: MapPin, label: 'Ubicación',      value: 'Lima, Perú', href: 'https://maps.app.goo.gl/pKD9P1bC3PtDFUqK6' },
                    { icon: Clock, label: 'Horario de Atención', value: 'Lun–Vie: 9:00–18:00 / Sáb: 9:00–13:00', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1177AB]/10 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-[#1177AB]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D3A52] uppercase tracking-wider mb-0.5">{label}</div>
                        {href ? (
                          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-[#4d6b7d] hover:text-[#1177AB] transition-colors">
                            {value}
                          </a>
                        ) : (
                          <span className="text-sm text-[#4d6b7d]">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp rápido */}
              <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1177AB 0%, #2892C7 100%)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare size={22} />
                  <h3 className="font-display text-lg font-bold">¿Necesitas ayuda rápida?</h3>
                </div>
                <p className="text-white/80 text-sm mb-5 leading-relaxed">
                  Escríbenos directamente por WhatsApp y te responderemos en minutos.
                </p>
                <a
                  href={`https://wa.me/${phoneNumbers.ingenieria}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 px-6 bg-white text-[#1177AB] font-bold rounded-lg hover:bg-[#EBF5FB] transition-colors text-sm"
                >
                  Chatear ahora
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-16 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1177AB]/8 text-[#1177AB] font-semibold text-xs uppercase tracking-widest border border-[#1177AB]/15 mb-6">
              Ubícanos
            </span>
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#EBF5FB]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.1905467140705!2d-77.05927439999999!3d-11.928236999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d1489688965f%3A0x616595f80aabfbe5!2sCondominio%20Los%20Laureles%202da%20etapa!5e1!3m2!1ses!2spe!4v1768845195723!5m2!1ses!2spe"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Terramett SAC"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
