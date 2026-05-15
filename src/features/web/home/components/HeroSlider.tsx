'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import { ChevronRight, Award } from 'lucide-react'

const backgroundImages = [
  '/assets/terramett/topografia-lev.jpeg',
  '/assets/terramett/fotogrametria.jpg',
  '/assets/terramett/Terramett-hero1.webp',
]

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Fondo negro base */}
      <div className="absolute inset-0 bg-black" />

      {/* Imágenes rotativas */}
      {backgroundImages.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === currentIndex ? 0.18 : 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center text-center text-white px-4 animate-slide-up max-w-3xl mx-auto section-padding">

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
          <Award size={18} className="text-[#88C7E6]" />
          <span className="text-sm font-medium">12 años de experiencia</span>
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Ingeniería que{' '}
          <span className="block text-[#88C7E6]">transforma</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
          Soluciones integrales en topografía, hidráulica, hidrología, geotecnia e ingeniería civil.
          Transformamos tu visión en realidad con precisión y excelencia técnica.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <Link href="/servicios" className="btn-accent inline-flex items-center gap-2">
            Nuestros Servicios
            <ChevronRight size={18} />
          </Link>
          <Link href="/contacto" className="btn-secondary inline-flex items-center gap-2">
            Solicitar Cotización
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-[#88C7E6]">12+</div>
            <div className="text-sm text-white/70 mt-1">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-[#88C7E6]">100%</div>
            <div className="text-sm text-white/70 mt-1">Clientes Satisfechos</div>
          </div>
        </div>
      </div>

      {/* Indicadores de slide */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {backgroundImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="transition-all duration-300 rounded-full cursor-pointer"
            style={{
              width: i === currentIndex ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === currentIndex ? '#88C7E6' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
