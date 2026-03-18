import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { Construction } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Nosotros - ARM',
  description: 'Conoce más sobre ARM y nuestra misión',
}

export default function NosotrosPage() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-white pt-32">
      <div className="max-w-7xl mx-auto text-center">
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-3xl bg-[#E2231A]/10 flex items-center justify-center">
              <Construction className="w-12 h-12 text-[#E2231A]" />
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 bg-[#02115C]/5 text-[#02115C] text-[10px] font-black uppercase tracking-widest border-l-2 border-[#02115C] mb-8">
            Bienvenido
          </div>
          <h1 className="text-4xl lg:text-7xl font-display font-black text-slate-900 mb-8 uppercase leading-[1.1] tracking-tighter max-w-4xl mx-auto">
            Conozcamos a <span className="text-[#E2231A]">ARM</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed font-sans font-medium mb-12">
            Estamos preparando una página completa sobre nuestra empresa, misión y valores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm">
              Volver al inicio
            </Link>
            <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#02115C] text-[#02115C] font-sans font-bold uppercase tracking-wider hover:bg-[#02115C] hover:text-white transition-all duration-300 text-sm">
              Contactar
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
