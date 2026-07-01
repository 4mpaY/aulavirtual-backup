import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Facebook } from 'lucide-react'
import libroReclamaciones from '@sout/assets/libroreclamaciones.jpeg'
import logo from '@sout/assets/logoblanco.png'
import marca from '@sout/assets/logo.svg'
import wstp from '@sout/assets/wstp.svg'

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="section-container py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center group">
              <img
                src={logo.src}
                alt="SOUT Training Center"
                className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              Centro de entrenamiento especializado en manejo defensivo, seguridad vial
              y prevención de riesgos para el sector minero, industrial y de transporte.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/SOUTTrainingCenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/51977959001"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300 p-1.5"
              >
                <img src={wstp.src} alt="WSTP" className="w-full h-full object-contain" />
              </a>
            </div>
            <Link href="/libro-de-reclamaciones" className="mt-4 inline-block">
              <img
                src={libroReclamaciones.src}
                alt="Libro de Reclamaciones"
                className="w-40 h-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Quiénes Somos', href: '/nosotros' },
                { name: 'Cursos', href: '/cursos' },
                { name: 'Contacto', href: '/contacto' },
                { name: 'Libro de Reclamaciones', href: '/libro-de-reclamaciones' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">Cursos Destacados</h4>
            <ul className="space-y-3">
              {[
                'Manejo Defensivo NSC',
                'Manejo 4x4 Minería',
                'Primeros Auxilios RCP',
                'Uso de Extintores',
                'Fatiga y Somnolencia',
                'Formación de Instructores',
              ].map((course) => (
                <li key={course}>
                  <Link
                    href="/cursos"
                    className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">Contáctenos</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/80 text-sm">
                  Av. Alameda del Corregidor 1769, La Molina, Lima, Perú
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-secondary-foreground/80 text-sm">
                  <p>+51 977 959 001</p>
                  <p>+51 932 191 033</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-secondary-foreground/80 text-sm">
                  <p>capacitaciones@soutrainingcenter.com</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-secondary-foreground/80 text-sm">Lun - Vie: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-foreground/5">
        <div className="section-container py-4 md:py-6">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 text-secondary-foreground/60">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs sm:text-sm text-center">
              <p>© 2026 SOUT Training Center. Todos los derechos reservados.</p>
              <div className="hidden md:block text-secondary-foreground/40">|</div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                <Link href="/politica-de-privacidad" className="hover:text-primary transition-colors duration-300">
                  Política de Privacidad
                </Link>
                <Link href="/terminos-de-uso" className="hover:text-primary transition-colors duration-300">
                  Términos de Uso
                </Link>
                <Link href="/politica-de-cambios-y-devoluciones" className="hover:text-primary transition-colors duration-300">
                  Política de Devoluciones
                </Link>
              </div>
            </div>
            <a
              href="https://wa.me/51912603970?text=Hola%20Fly%2C%20vengo%20de%20SOUT%20TRAINING%20CENTER%2C%20estoy%20interesado%20en%20crear%20mi%20p%C3%A1gina%20web%20profesional"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity duration-300"
            >
              <span className="text-xs sm:text-sm font-medium">Desarrollado por</span>
              <img src={marca.src} alt="1FLY" className="h-6 sm:h-8 w-auto object-contain" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
