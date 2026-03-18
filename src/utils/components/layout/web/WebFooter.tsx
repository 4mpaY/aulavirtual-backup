import React from 'react'

import Link from 'next/link'

import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

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
                { label: 'Capacitación', href: '/cursos' },
                { label: 'Rutas de Aprendizaje', href: '/rutas' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#02115C] transition-colors duration-300 group font-bold"
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
                  className="text-gray-500 hover:text-[#02115C] transition-colors font-bold"
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
                  className="text-gray-500 hover:text-[#02115C] transition-colors font-bold truncate"
                >
                  arm.confiabilidad@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-16 pt-12 border-t border-gray-100">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-[0.2em]">
            ARM Asset Reliability Management © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default WebFooter
