import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contacto - ARM',
  description: 'Ponte en contacto con nosotros',
}

export default function ContactoPage() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white pt-32">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="w-20 h-1.5 bg-[#E2231A] mx-auto mb-8" />
            <h1 className="text-4xl lg:text-7xl font-display font-black text-slate-900 mb-8 uppercase leading-[1.1] tracking-tighter">
              Ponte en <span className="text-[#E2231A]">Contacto</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed font-sans font-medium">
              Estamos listos para ayudarte. Contáctanos por cualquiera de estos medios.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: MapPin,
              title: 'Dirección',
              info: 'Piura, Av. Sanchez Cerro Mz O\' Lote 10 Urb. Santa Ana',
              href: null,
            },
            {
              icon: Phone,
              title: 'WhatsApp',
              info: '+51 959 436 827',
              href: 'https://wa.me/51959436827',
            },
            {
              icon: Mail,
              title: 'Email',
              info: 'arm.confiabilidad@gmail.com',
              href: 'mailto:arm.confiabilidad@gmail.com',
            },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-slate-50 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#02115C]/10 rounded-2xl mb-6 group-hover:bg-[#02115C] transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-[#02115C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-black text-slate-900 uppercase text-sm tracking-wider mb-3">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#E2231A] font-medium transition-colors">
                    {item.info}
                  </a>
                ) : (
                  <p className="text-slate-600 font-medium">{item.info}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <a
              href="https://wa.me/51959436827"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-12 py-5 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm mr-4"
            >
              Enviar WhatsApp
            </a>
            <Link href="/" className="inline-flex items-center justify-center px-12 py-5 border-2 border-[#02115C] text-[#02115C] font-sans font-bold uppercase tracking-wider hover:bg-[#02115C] hover:text-white transition-all duration-300 text-sm">
              Volver al inicio
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
