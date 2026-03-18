"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSlider() {
  const content = {
    tag: "Confiabilidad Industrial",
    title: ["Transformamos", "mantenimiento", "en", "confiabilidad"],
    subtitle: "Soluciones de ingeniería de clase mundial para maximizar la disponibilidad y el rendimiento de sus activos industriales.",
    cta: "Solicita Asesoría Gratuita",
    href: "/contacto",
  };

  return (
    <section className="relative w-full min-h-[600px] lg:h-[85vh] overflow-hidden bg-white">
      {/* Technical Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center z-10 py-20 lg:py-0">
        <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Col: Main Content */}
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <span className="w-12 h-[2px] bg-[#E2231A]" />
                    <span className="text-[#02115C] text-[10px] lg:text-xs font-sans font-extrabold uppercase tracking-[0.4em]">
                      {content.tag}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-black text-slate-900 leading-[1.1] mb-6 uppercase tracking-tighter"
                  >
                    {content.title.map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-sm sm:text-base text-slate-600 mb-10 max-w-xl leading-relaxed font-sans font-medium"
                  >
                    {content.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link
                      href={content.href}
                      className="inline-flex items-center justify-center px-8 py-4 bg-[#02115C] text-white font-sans font-bold uppercase tracking-wider hover:bg-[#0A50A1] transition-all duration-300 text-sm shadow-xl min-w-[220px] group"
                    >
                      {content.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/proyectos"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-200 text-slate-900 font-sans font-bold uppercase tracking-wider hover:bg-slate-50 transition-all duration-300 text-sm min-w-[220px]"
                    >
                      Explorar Soluciones
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Right Col: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block lg:col-span-5"
            >
              <div className="relative group overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-100 hover:ring-slate-200 transition-all duration-700">
                <div className="absolute inset-0 bg-[#02115C]/5 mix-blend-multiply z-10 pointer-events-none" />
                <div className="w-full h-[480px] bg-gradient-to-br from-[#02115C]/10 via-slate-100 to-[#E2231A]/10 flex items-center justify-center">
                  <div className="text-center p-12">
                    <div className="text-7xl font-display font-black text-[#02115C]/20 uppercase tracking-tighter leading-none mb-4">
                      ARM
                    </div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-[0.4em]">
                      Asset Reliability Management
                    </div>
                  </div>
                </div>
                <div className="absolute top-8 right-8 flex flex-col gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-[2px] bg-[#E2231A]" />
                  <div className="w-6 h-[2px] bg-[#E2231A]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-[#02115C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-[#E2231A]/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
