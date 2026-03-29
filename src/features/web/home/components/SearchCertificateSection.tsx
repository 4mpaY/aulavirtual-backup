'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Search, Award, CheckCircle } from 'lucide-react'

import ScrollReveal from './ScrollReveal'

export default function SearchCertificateSection() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedCodigo = codigo.trim()

    if (!trimmedCodigo) {
      setError('Por favor, ingresa un código de certificado')

      return
    }

    if (trimmedCodigo.length < 5) {
      setError('El código parece ser demasiado corto')

      return
    }

    // Redirige a la página de verificación del certificado
    router.push(`/verificar-certificado/${encodeURIComponent(trimmedCodigo)}`)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Award className="w-64 h-64 text-[#02115C] -mt-12 -mr-12" />
            </div>

            <div className="relative z-10 text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#02115C]/10 rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8 text-[#02115C]" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-[#02115C] mb-4 uppercase leading-tight">
                Verificar Certificado
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                Ingresa el código único ubicado en la parte inferior de tu certificado para comprobar su validez, 
                autenticidad y los detalles del alumno.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative z-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value.toUpperCase())
                      setError('')
                    }}
                    placeholder="Ej. CER-2026-X8F9A"
                    className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#02115C]/10 focus:border-[#02115C] transition-all font-sans text-lg uppercase"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!codigo.trim()}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#E2231A] border border-transparent rounded-xl text-white font-sans font-bold uppercase tracking-wider hover:bg-[#C11B14] transition-colors focus:outline-none focus:ring-4 focus:ring-[#E2231A]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E2231A]/20 whitespace-nowrap"
                >
                  Buscar <Search className="ml-2 w-5 h-5" />
                </button>
              </div>
              
              {error && (
                <p className="mt-3 text-[#E2231A] text-sm font-medium text-center">
                  {error}
                </p>
              )}
              
              <p className="mt-6 text-sm text-gray-400 text-center font-sans max-w-lg mx-auto">
                Nuestro sistema garantiza la autenticidad e inmutabilidad de todos los certificados emitidos a través de nuestra plataforma.
              </p>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
