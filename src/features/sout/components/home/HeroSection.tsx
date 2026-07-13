'use client'

import { useState, useEffect } from "react";

import Link from 'next/link';

import { ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@sout/components/ui/button";
import { cn } from "@sout/lib/utils";
import heroImage from "@sout/assets/curso1.jpeg";
import drivingImage from "@sout/assets/carrousel1.jpeg";
import firstAidImage from "@sout/assets/carrousel3.jpeg";
import logoHomologado from "@sout/assets/LOGO_DE_HOMOLOGADO.png";
import logoNSC from "@sout/assets/National_Safety_Council.svg.png";

const slides = [
  {
    id: 1,
    title: "Cursos y Certificaciones",
    subtitle: "Programas especializados con certificación internacional avalada",
    backgroundImage: drivingImage.src,
    features: [
      { text: "Certificación NSC USA" },
      { text: "Instructores Certificados" },
      { text: "Material Actualizado" },
      { text: "Modalidad Presencial y Virtual" }
    ]
  },
  {
    id: 2,
    title: "Estamos Acreditados",
    subtitle: "Respaldados por instituciones de reconocimiento internacional",
    backgroundImage: heroImage.src,
    showLogo: true,
    accreditations: [
      
    ]
  },
  {
    id: 3,
    title: "Lo Que Ofrecemos",
    subtitle: "Soluciones integrales para tu desarrollo profesional y empresarial",
    backgroundImage: firstAidImage.src,
    offerings: [
      {
        title: "Capacitación",
        description: "Programas de formación especializada en manejo defensivo y seguridad vial"
      },
      {
        title: "Certificación",
        description: "Validación internacional de competencias profesionales"
      },
      {
        title: "Consultoría",
        description: "Asesoría especializada para implementación de sistemas de seguridad"
      },
      {
        title: "Soporte",
        description: "Acompañamiento continuo post-certificación y actualización"
      }
    ]
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentOfferingIndex, setCurrentOfferingIndex] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-rotate features in slide 1 (mobile only)
  useEffect(() => {
    const featuresCount = slides[0].features?.length || 0;

    if (featuresCount === 0) return;

    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % featuresCount);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate offerings in slide 3 (mobile only)
  useEffect(() => {
    const offeringsCount = slides[2].offerings?.length || 0;

    if (offeringsCount === 0) return;

    const interval = setInterval(() => {
      setCurrentOfferingIndex((prev) => (prev + 1) % offeringsCount);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images - Change with slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.backgroundImage}
            alt={slide.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {/* Minimal overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-200" />
      </div>

      {/* Carousel Content */}
      <div className="relative section-container py-20 sm:py-24 md:py-32 lg:py-40 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Slides Container */}
          <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out",
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                )}
              >
                {/* Slide 1: Cursos y Certificaciones */}
                {slide.id === 1 && (
                  <div className="text-center space-y-8 animate-fade-up">
                    <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4">
                      <span className="text-xs sm:text-sm font-medium text-primary-foreground text-center">
                        CENTRO DE ENTRENAMIENTO AUTORIZADO POR EL NSC DE USA
                      </span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                      {slide.subtitle}
                    </p>

                    {/* Features Grid - Desktop */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
                      {slide.features?.map((feature, idx) => {
                        return (
                          <div 
                            key={idx}
                            className="group relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-2 border-white/40 hover:border-accent/60"
                          >
                            {/* Decorative gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Content */}
                            <div className="relative z-10">
                              <p className="text-lg font-bold text-gray-900 leading-snug text-center">
                                {feature.text}
                              </p>
                            </div>
                            
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                          </div>
                        );
                      })}
                    </div>

                    {/* Features Carousel - Mobile */}
                    <div className="md:hidden relative max-w-sm mx-auto mt-12">
                      <div className="relative overflow-hidden">
                        {slide.features?.map((feature, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "transition-all duration-500 ease-in-out",
                              idx === currentFeatureIndex 
                                ? "opacity-100 scale-100" 
                                : "opacity-0 scale-95 absolute inset-0"
                            )}
                          >
                            <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/40">
                              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 rounded-2xl" />
                              <div className="relative z-10">
                                <p className="text-lg font-bold text-gray-900 leading-snug text-center">
                                  {feature.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Dots indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {slide.features?.map((_, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              idx === currentFeatureIndex 
                                ? "bg-primary w-8" 
                                : "bg-primary-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link href="/cursos">
                        <Button variant="hero" size="xl" className="group">
                          Ver Cursos
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <a
                        href="https://wa.me/51977959001?text=Hola%2C%20estoy%20interesado%20en%20solicitar%20una%20cotizaci%C3%B3n%20para%20los%20*Cursos%20de%20Capacitaci%C3%B3n%20NSC*.%0A%0AMe%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%3A%0A%E2%9C%85%20Cursos%20disponibles%0A%E2%9C%85%20Certificaciones%20internacionales%0A%E2%9C%85%20Modalidades%20%28presencial%2C%20virtual%29%0A%E2%9C%85%20Precios%20y%20descuentos%20empresariales%0A%0A%C2%BFPodr%C3%ADan%20ayudarme%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="heroOutline" size="xl">
                          Solicitar Cotización
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                {/* Slide 2: Estamos Acreditados */}
                {slide.id === 2 && (
                  <div className="text-center space-y-8 md:space-y-10 animate-fade-up px-4">
                    
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight px-4">
                      {slide.title}
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/80 max-w-3xl mx-auto px-4">
                      {slide.subtitle}
                    </p>

                    {/* Logos Container - Two logos side by side */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 py-6 md:py-8 max-w-4xl mx-auto">
                      
                      {/* Logo Homologado Hodelpe */}
                      <div className="relative group w-full max-w-[140px] sm:max-w-[180px] md:max-w-[200px]">
                        {/* Glow effect circular */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                        
                        {/* Logo sin fondo */}
                        <div className="relative">
                          <img 
                            src={logoHomologado.src}
                            alt="Homologado Corporación Hodelpe SAC" 
                            className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="mt-3">
                          <p className="text-xs md:text-sm font-semibold text-primary-foreground">
                            Empresa Homologada
                          </p>
                        </div>
                      </div>

                      {/* Logo National Safety Council */}
                      <div className="relative group w-full max-w-[140px] sm:max-w-[180px] md:max-w-[200px]">
                        {/* Glow effect circular */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                        
                        {/* Logo sin fondo */}
                        <div className="relative">
                          <img 
                            src={logoNSC.src}
                            alt="National Safety Council" 
                            className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                          />
                        </div>
                        
                        {/* Label */}
                        <div className="mt-3">
                          <p className="text-xs md:text-sm font-semibold text-primary-foreground">
                            Certificación Internacional NSC
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link href="/nosotros">
                        <Button variant="hero" size="xl">
                          Conocer Más
                        </Button>
                      </Link>
                      <a
                        href="https://wa.me/51977959001?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20las%20*Acreditaciones%20y%20Certificaciones*%20de%20SOUT%20Training%20Center.%0A%0AEstoy%20interesado%20en%20conocer%3A%0A%E2%9C%85%20Certificaci%C3%B3n%20NSC%20USA%0A%E2%9C%85%20Homologaci%C3%B3n%20empresarial%0A%E2%9C%85%20Validez%20internacional%0A%E2%9C%85%20Requisitos%20y%20proceso%0A%0AGracias."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="heroOutline" size="xl">
                          Solicitar Información
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                {/* Slide 3: Lo Que Ofrecemos */}
                {slide.id === 3 && (
                  <div className="text-center space-y-8 animate-fade-up">

                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                      {slide.subtitle}
                    </p>

                    {/* Offerings Grid - Desktop */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
                      {slide.offerings?.map((offering, idx) => (
                        <div 
                          key={idx}
                          className="group relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-2 border-white/40 hover:border-accent/60"
                        >
                          {/* Decorative gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                              {offering.title}
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {offering.description}
                            </p>
                          </div>
                          
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                        </div>
                      ))}
                    </div>

                    {/* Offerings Carousel - Mobile */}
                    <div className="md:hidden relative max-w-sm mx-auto mt-12">
                      <div className="relative overflow-hidden">
                        {slide.offerings?.map((offering, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "transition-all duration-500 ease-in-out",
                              idx === currentOfferingIndex 
                                ? "opacity-100 scale-100" 
                                : "opacity-0 scale-95 absolute inset-0"
                            )}
                          >
                            <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/40">
                              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 rounded-2xl" />
                              <div className="relative z-10">
                                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 text-center">
                                  {offering.title}
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed text-center">
                                  {offering.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Dots indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {slide.offerings?.map((_, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              idx === currentOfferingIndex 
                                ? "bg-primary w-8" 
                                : "bg-primary-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link href="/servicios">
                        <Button variant="hero" size="xl" className="group">
                          Ver Servicios
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <a
                        href="https://wa.me/51977959001?text=Hola%2C%20estoy%20interesado%20en%20los%20servicios%20de%20SOUT%20Training%20Center.%0A%0AMe%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%3A%0A%F0%9F%93%8B%20Capacitaci%C3%B3n%20profesional%0A%F0%9F%8E%93%20Certificaciones%0A%F0%9F%92%BC%20Consultor%C3%ADa%20empresarial%0A%F0%9F%A4%9D%20Soporte%20continuo%0A%0A%C2%BFPodr%C3%ADan%20contactarme%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="heroOutline" size="xl">
                          Contactar Ahora
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-full p-2 sm:p-3 hover:bg-accent hover:border-accent transition-all duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-full p-2 sm:p-3 hover:bg-accent hover:border-accent transition-all duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
