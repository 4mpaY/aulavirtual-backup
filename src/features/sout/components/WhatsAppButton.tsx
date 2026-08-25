'use client'

import { Phone } from 'lucide-react'

import whatsappIcon from '@sout/assets/wstp.svg'

const FloatingContactButtons = () => {
  const whatsappNumber = '51977959001'
  const phoneNumber = '+51977959001'
  const message = 'Hola, me interesa conocer más sobre sus cursos de capacitación.'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <>
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 group">
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-glow"
          aria-label="Llamar ahora"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </a>
        <div className="hidden sm:block absolute left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold shadow-xl">
            Llamar ahora
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-glow"
          aria-label="Contactar por WhatsApp"
        >
          <img src={whatsappIcon.src} alt="WhatsApp" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </a>
        <div className="hidden sm:block absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold shadow-xl">
            ¿Necesitas ayuda?
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FloatingContactButtons
