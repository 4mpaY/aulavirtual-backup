import React from 'react'

import Link from 'next/link'

import { Phone, Mail, MapPin, ArrowRight, BookOpenCheck } from 'lucide-react'

import HydratedDate from '@/utils/components/HydratedDate'

import Logo from '@components/layout/shared/Logo'

const WebFooter = () => {
  return (
    <footer className="bg-white text-[#202020] border-t border-gray-100">
      {/* Top accent line */}
      <div className="h-1.5 bg-[#02115C]/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-base text-gray-500 leading-relaxed max-w-md font-medium">
              ARM | Asset Reliability Management — Liderando la confiabilidad industrial desde 2018.
              Implementamos soluciones de ingeniería de precisión para la gestión de activos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[#02115C] font-display font-black mb-8 text-xs uppercase tracking-[0.2em] border-l-4 border-[#02115C] pl-4">
              Soluciones
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { label: 'Proyectos', href: '/proyectos' },
                { label: 'Mantenimiento', href: '/mantenimiento' },
                { label: 'Consultoría', href: '/consultoria' },
                { label: 'Capacitación', href: '/cursos' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#02115C] transition-colors duration-300 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#02115C] font-display font-black mb-8 text-xs uppercase tracking-[0.2em] border-l-4 border-[#02115C] pl-4">
              Contacto
            </h4>

            {/* Redes sociales */}
            <div className="flex items-center gap-2 mb-6">
              <a
                href="https://tiktok.com/@arm.confiabilidad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-[#02115C]/5 hover:bg-[#02115C] text-[#02115C] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@ARM.confiabilidad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#02115C]/5 hover:bg-[#E2231A] text-[#02115C] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://wa.link/r2mn94"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#02115C]/5 hover:bg-[#25D366] text-[#02115C] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-[#02115C]/5 rounded-lg group-hover:bg-[#02115C]/10 transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 text-[#02115C]" />
                </div>
                <span className="text-gray-500 leading-relaxed font-medium mt-1">
                  Piura, Av. Sanchez Cerro Mz O&apos; Lote 10 Urb. Santa Ana
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#02115C]/5 rounded-lg group-hover:bg-[#02115C]/10 transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-[#02115C]" />
                </div>
                <a
                  href="https://wa.me/51959436827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#02115C] transition-colors"
                >
                  +51 959 436 827
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#02115C]/5 rounded-lg group-hover:bg-[#02115C]/10 transition-colors">
                  <Mail className="w-4 h-4 shrink-0 text-[#02115C]" />
                </div>
                <a
                  href="mailto:arm.confiabilidad@gmail.com"
                  className="text-gray-500 hover:text-[#02115C] transition-colors truncate"
                >
                  arm.confiabilidad@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-gray-100">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
            ARM Asset Reliability Management © <HydratedDate date={new Date()} format="year" />
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <Link href="/libro-de-reclamaciones" className="flex items-center gap-2 hover:text-[#02115C] transition-colors">
              <BookOpenCheck size={14} />
              Libro de Reclamaciones
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:text-[#02115C] transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/politica-de-cambios-y-devoluciones" className="hover:text-[#02115C] transition-colors">
              Política de Devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default WebFooter
