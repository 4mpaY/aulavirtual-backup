'use client'

import Link from 'next/link';
import { Button } from "@sout/components/ui/button";
import { Clock, Users, Award, ChevronRight } from "lucide-react";
import curso1 from "@sout/assets/curso1.jpeg";
import firstAidTraining from "@sout/assets/rcp.png";
import fireTraining from "@sout/assets/fire-training.jpg";
import competencia from "@sout/assets/competencia.jpeg";
import carro from "@sout/assets/carro.jpeg";
import cuatrimoto from "@sout/assets/cuatrimoto.jpeg";
import carrousel2 from "@sout/assets/carrousel2.jpeg";
import defensivo from "@sout/assets/defensivo.jpeg";
import fatigaImg from "@sout/assets/fatiga.jpeg";
import instructorImg from "@sout/assets/intructor.jpeg";
import practicaslima from "@sout/assets/modelolima.jpeg";
import operador from "@sout/assets/operador.jpeg";

const courses = [
  {
    id: 1,
    title: "Manejo Defensivo NSC 6-8 Horas",
    description:
      "Programa certificado por el National Safety Council de Estados Unidos. Basado en investigación, multimedia e interactivo. Flexible en duraciones de 4, 6 u 8 horas.",
    duration: "6-8 horas",
    audience: "Conductores profesionales 18+",
    modality: "Presencial y Virtual",
    image: curso1.src,
    certification: "NSC USA",
    featured: true,
  },
  {
    id: 2,
    title: "Primeros Auxilios - RCP - DEA",
    description:
      "Capacitación en técnicas de primeros auxilios, reanimación cardiopulmonar y uso de desfibrilador externo automático. Cumple normas OSHA.",
    duration: "8 horas",
    audience: "Todo personal",
    modality: "Presencial y Virtual",
    image: firstAidTraining.src,
    certification: "OSHA/NSC",
    featured: true,
  },
  {
    id: 3,
    title: "Prácticas de Manejo 4x4 por Horas - Modelo Mina",
    description:
      "Entrenamiento práctico en circuito modelo mina. Disponible todos los días en Lima. Sesiones por horas adaptadas a tus necesidades.",
    duration: "Flexible por horas",
    audience: "Conductores, operadores",
    modality: "Presencial",
    image: practicaslima.src,
    certification: "Certificado",
    featured: true,
  },
  {
    id: 4,
    title: "Operación Segura de Montacargas Presencial",
    description:
      "Curso presencial de 20 horas teórico-práctico para operadores de montacargas. Entrenamiento todos los días en Lima. Doble certificación de NSC y SOUT Training Center.",
    duration: "20 horas",
    audience: "Operadores de montacargas",
    modality: "Presencial",
    image: operador.src,
    certification: "NSC/SOUT",
    featured: false,
  },
];

const CoursesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <span className="inline-block font-heading text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Nuestros Programas
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Cursos de{" "}
            <span className="text-primary">Capacitación Especializada</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Programas certificados internacionalmente diseñados para formar profesionales 
            competentes en seguridad vial, manejo defensivo y prevención de riesgos.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.filter(course => course.featured).map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg card-hover border border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                
                {/* Certification Badge */}
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-heading font-bold">
                  {course.certification}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {course.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent flex-shrink-0" />
                    <span>{course.audience}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://wa.me/51977959001?text=${encodeURIComponent(
                      `Hola, estoy interesado en el curso: ${course.title}\n\nDuración: ${course.duration}\nCertificación: ${course.certification}\nModalidad: ${course.modality}\n\n¿Podrían brindarme más información y cotización?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="default" className="w-full text-sm md:text-base">
                      Contactar
                    </Button>
                  </a>
                  <Link href="/cursos" className="flex-1">
                    <Button variant="outline" className="w-full text-sm md:text-base">
                      Ver Más
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MATPEL Information Card */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-2xl border-2 border-primary/20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Content Section */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    Certificado
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    Curso de MATPEL (Materiales Peligrosos)
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm md:text-base mb-6">
                  Curso de MATPEL nivel advertencia presencial o virtual online. 
                  Capacitación especializada para el manejo seguro de materiales peligrosos según normativa vigente.
                </p>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">3 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-medium text-foreground">Conductores y personal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">Presencial / Virtual</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="md:flex-shrink-0 md:w-64">
                <a
                  href={`https://wa.me/51977959001?text=${encodeURIComponent(
                    `Hola, estoy interesado en el Curso de MATPEL (Materiales Peligrosos)\n\nDuración: 3 horas\nModalidad: Presencial o Virtual Online\nOrientado a: Conductores y personal que manipula materiales peligrosos\n\n¿Podrían brindarme más información y cotización?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="default" size="lg" className="w-full">
                    Contactar por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/cursos">
            <Button variant="hero" size="lg">
              Ver Todos los Cursos
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
