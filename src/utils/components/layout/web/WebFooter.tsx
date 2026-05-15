'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Award } from 'lucide-react'

import { useConfig } from '@/contexts/ConfigContext'
import HydratedDate from '@/utils/components/HydratedDate'

const WebFooter = () => {
  const configs = useConfig()
  const logoSrc = configs.TEMPLATE_LOGO || '/assets/terramett/logo.png'

  return (
    <footer className="bg-[#1177AB] text-white">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image src={logoSrc} alt="Terramett SAC" width={120} height={36} style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }} unoptimized />
              <div>
                <span className="font-display font-bold text-xl block leading-none">TERRAMETT</span>
                <span className="text-[10px] text-white/60 uppercase tracking-wider">SAC</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Ingeniería que transforma. Más de 12 años brindando soluciones integrales en topografía,
              hidráulica, hidrología, geotecnia e ingeniería civil.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#88C7E6] flex items-center justify-center transition-colors duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 border-l-4 border-[#88C7E6] pl-3">Servicios</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {['Topografía', 'Geodesia', 'Fotogrametría', 'Hidráulica', 'Hidrología', 'Geotecnia', 'Ingeniería Civil'].map(s => (
                <li key={s}>
                  <Link href="/servicios" className="hover:text-[#88C7E6] transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 border-l-4 border-[#88C7E6] pl-3">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Cursos', href: '/cursos' },
                { label: 'Blog', href: '/blogs' },
                { label: 'Contacto', href: '/contacto' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#88C7E6] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/verificar-certificado"
              className="inline-flex items-center gap-2 mt-8 px-5 py-3 bg-white text-[#02115C] font-sans font-bold text-xs tracking-wider uppercase border-2 border-[#02115C] border-dashed hover:bg-[#02115C] hover:text-white hover:border-solid transition-all duration-300 rounded"
            >
              <Award className="w-4 h-4" />
              Validar Certificado
            </Link>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 border-l-4 border-[#88C7E6] pl-3">Contacto</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#88C7E6] mt-0.5 shrink-0" />
                <div>
                  <div>Ingeniería: +51 952 914 761</div>
                  <div>Topografía: +51 989 784 114</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#88C7E6] mt-0.5 shrink-0" />
                <a href="mailto:diego.utrilla@terramett.pe" className="hover:text-[#88C7E6] transition-colors break-all">
                  diego.utrilla@terramett.pe
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#88C7E6] mt-0.5 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/pKD9P1bC3PtDFUqK6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#88C7E6] transition-colors"
                >
                  Lima, Perú
                </a>
              </li>
            </ul>

            <Link href="/libro-de-reclamaciones" className="block mt-6">
              <Image
                src="/assets/terramett/libroreclamaciones-GeFQg5o3.jpeg"
                alt="Libro de Reclamaciones"
                width={140}
                height={56}
                className="rounded-lg opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <div>
              <p>© <HydratedDate date={new Date()} format="year" /> Terramett SAC. Todos los derechos reservados.</p>
              <p>RUC: 20613057791</p>
            </div>
            <div className="flex gap-5">
              <Link href="/libro-de-reclamaciones" className="hover:text-[#88C7E6] transition-colors">Libro de Reclamaciones</Link>
              <Link href="/terminos-y-condiciones" className="hover:text-[#88C7E6] transition-colors">Términos y Condiciones</Link>
              <Link href="/politica-de-cambios-y-devoluciones" className="hover:text-[#88C7E6] transition-colors">Política de Devoluciones</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desarrollado por */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-white/40">
          Desarrollado por{' '}
          <a href="https://flyup.rest" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors font-semibold">
            Fly Creativos
          </a>
        </div>
      </div>
    </footer>
  )
}

export default WebFooter
