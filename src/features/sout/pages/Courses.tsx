'use client'

import Header from "@sout/components/layout/Header";
import Footer from "@sout/components/layout/Footer";
import { Button } from "@sout/components/ui/button";
import Link from 'next/link';
import { useState } from "react";
import {
  Clock,
  Users,
  ChevronRight,
  Filter,
  Car,
  Heart,
  Flame,
  AlertTriangle,
  GraduationCap,
  Truck,
  Mountain,
} from "lucide-react";
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
import matpel from "@sout/assets/matpel.jpeg";

const courses = [
  {
    id: 1,
    title: "Manejo Defensivo NSC 6-8 Horas",
    description:
      "Programa certificado por el National Safety Council de Estados Unidos. Basado en investigación, multimedia e interactivo. Flexible en duraciones de 4, 6 u 8 horas.",
    duration: "6-8 horas",
    audience: "Conductores profesionales 18+",
    modality: ["presencial", "virtual"],
    sector: ["mineria", "industria", "transporte"],
    image: curso1.src,
    certification: "NSC USA",
    icon: Car,
  },
  {
    id: 2,
    title: "Manejo Defensivo PTD 5ta Edición",
    description:
      "Para conductores profesionales de camiones y buses. Reduce fatalidades significativamente con técnicas probadas de manejo defensivo.",
    duration: "8 horas",
    audience: "Conductores de camiones/buses",
    modality: ["presencial"],
    sector: ["transporte"],
    image: defensivo.src,
    certification: "NSC USA",
    icon: Truck,
  },
  {
    id: 3,
    title: "Manejo Defensivo NSC y Uso de 4x4",
    description:
      "10ma Edición para minería, petróleo e industria. Técnicas de conducción off-road, terrenos difíciles y condiciones extremas.",
    duration: "16 horas",
    audience: "Operadores mineros, industriales",
    modality: ["presencial"],
    sector: ["mineria", "industria"],
    image: carro.src,
    certification: "NSC USA",
    icon: Mountain,
  },
  {
    id: 4,
    title: "Primeros Auxilios - RCP - DEA",
    description:
      "Capacitación en técnicas de primeros auxilios, reanimación cardiopulmonar y uso de desfibrilador externo automático. Cumple normas OSHA.",
    duration: "8 horas",
    audience: "Todo personal",
    modality: ["presencial", "virtual"],
    sector: ["mineria", "industria", "transporte"],
    image: firstAidTraining.src,
    certification: "OSHA/NSC",
    icon: Heart,
  },
  {
    id: 5,
    title: "Uso y Manejo de Extintores",
    description:
      "Entrenamiento práctico en prevención y combate de incendios. Uso correcto de extintores según tipo de fuego.",
    duration: "4 horas",
    audience: "Brigadistas y personal",
    modality: ["presencial"],
    sector: ["mineria", "industria"],
    image: fireTraining.src,
    certification: "Certificado",
    icon: Flame,
  },
  {
    id: 6,
    title: "Manejo Defensivo 4x4 Interior Mina",
    description:
      "Especializado para operación en interior de mina, superficie y zonas de exploración. Condiciones de baja visibilidad y espacios confinados.",
    duration: "8 horas",
    audience: "Operadores mineros",
    modality: ["presencial"],
    sector: ["mineria"],
    image: carrousel2.src,
    certification: "Certificado",
    icon: Mountain,
  },
  {
    id: 7,
    title: "Fatiga y Somnolencia para Conductores",
    description:
      "Programa de 4 horas para reconocer, prevenir y manejar la fatiga durante la conducción. Reduce accidentes por somnolencia.",
    duration: "4 horas",
    audience: "Conductores profesionales",
    modality: ["presencial", "virtual", "grabado"],
    sector: ["mineria", "industria", "transporte"],
    image: fatigaImg.src,
    certification: "Certificado",
    icon: AlertTriangle,
  },
  {
    id: 8,
    title: "Formación de Instructores NSC",
    description:
      "Forma instructores certificados de manejo defensivo NSC. Desarrolla competencias pedagógicas y técnicas para capacitar a otros.",
    duration: "40 horas",
    audience: "Instructores, supervisores SSOMA",
    modality: ["presencial"],
    sector: ["mineria", "industria", "transporte"],
    image: instructorImg.src,
    certification: "NSC USA",
    icon: GraduationCap,
  },
  {
    id: 9,
    title: "Manejo Defensivo NSC - Cuatrimotos",
    description:
      "Técnicas seguras para operación de cuatrimotos (ATVs) en terrenos mineros e industriales.",
    duration: "6 horas",
    audience: "Operadores de ATVs",
    modality: ["presencial"],
    sector: ["mineria", "industria"],
    image: cuatrimoto.src,
    certification: "NSC USA",
    icon: Car,
  },
  {
    id: 10,
    title: "Evaluación de Competencias y Selección",
    description:
      "Evaluación integral de competencias para selección de conductores. Incluye pruebas prácticas y teóricas.",
    duration: "Según evaluación",
    audience: "RRHH, Supervisores",
    modality: ["presencial"],
    sector: ["mineria", "industria", "transporte"],
    image: competencia.src,
    certification: "Certificado",
    icon: Users,
  },
  {
    id: 11,
    title: "Prácticas de Manejo 4x4 por Horas - Modelo Lima",
    description:
      "Entrenamiento práctico en circuito modelo mina. Disponible todos los días en Lima. Sesiones por horas adaptadas a tus necesidades.",
    duration: "Flexible por horas",
    audience: "Conductores, operadores",
    modality: ["presencial"],
    sector: ["mineria", "industria"],
    image: practicaslima.src,
    certification: "Certificado",
    icon: Mountain,
  },
  {
    id: 12,
    title: "Curso de MATPEL (Materiales Peligrosos)",
    description:
      "Curso de MATPEL nivel advertencia presencial o virtual online 3 horas.",
    duration: "3 horas",
    audience: "RRHH, Supervisores",
    modality: ["presencial", "virtual"],
    sector: ["industria", "transporte"],
    image: matpel.src,
    certification: "NSC/SOUT",
    icon: Truck,
  },
  {
    id: 13,
    title: "Operación Segura de Montacargas Presencial",
    description:
      "Curso presencial de 20 horas teórico-práctico para operadores de montacargas. Entrenamiento todos los días en Lima. Doble certificación de NSC y SOUT Training Center.",
    duration: "20 horas",
    audience: "Operadores de montacargas",
    modality: ["presencial"],
    sector: ["industria", "transporte"],
    image: operador.src,
    certification: "NSC/SOUT",
    icon: Truck,
  },
];

const Courses = () => {
  const [filter, setFilter] = useState({
    modality: "all",
    sector: "all",
  });

  const filteredCourses = courses.filter((course) => {
    const modalityMatch =
      filter.modality === "all" || course.modality.includes(filter.modality);
    const sectorMatch =
      filter.sector === "all" || course.sector.includes(filter.sector);
    return modalityMatch && sectorMatch;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-[var(--sout-header-height)] pb-20 bg-secondary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
          <div className="section-container relative">
            <div className="max-w-3xl">
              <span className="inline-block font-heading text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                Nuestros Programas
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Cursos de{" "}
                <span className="text-primary">Capacitación</span> Especializada
              </h1>
              <p className="text-xl text-secondary-foreground/80">
                Programas certificados internacionalmente para formar profesionales
                competentes en seguridad vial, manejo defensivo y prevención de riesgos.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-muted border-b border-border sticky top-16 z-40">
          <div className="section-container">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-5 h-5" />
                <span className="font-heading font-semibold">Filtrar:</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  value={filter.modality}
                  onChange={(e) => setFilter({ ...filter, modality: e.target.value })}
                  className="bg-background border border-border rounded-lg px-4 py-2 text-sm font-heading focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas las Modalidades</option>
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="grabado">Grabado</option>
                </select>
                <select
                  value={filter.sector}
                  onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
                  className="bg-background border border-border rounded-lg px-4 py-2 text-sm font-heading focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos los Sectores</option>
                  <option value="mineria">Minería</option>
                  <option value="industria">Industria</option>
                  <option value="transporte">Transporte</option>
                </select>
              </div>
              <span className="text-sm text-muted-foreground ml-auto">
                {filteredCourses.length} cursos encontrados
              </span>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg card-hover border border-border"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />

                    {/* Icon */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <course.icon className="w-6 h-6 text-primary-foreground" />
                    </div>

                    {/* Certification Badge */}
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-heading font-bold">
                      {course.certification}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Users className="w-3 h-3 text-accent" />
                        <span>{course.audience}</span>
                      </div>
                    </div>

                    {/* Modalities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.modality.map((mod) => (
                        <span
                          key={mod}
                          className="text-xs font-heading font-semibold text-primary bg-primary/10 px-2 py-1 rounded capitalize"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/51977959001?text=${encodeURIComponent(
                          `Hola, estoy interesado en el curso: ${course.title}\n\nDuración: ${course.duration}\nCertificación: ${course.certification}\nModalidad: ${course.modality.join(", ")}\n\n¿Podrían brindarme más información?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="default" className="w-full">
                          Iniciar
                        </Button>
                      </a>
                      <Link href="/contacto" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Contacto
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary">
          <div className="section-container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              ¿No Encuentras el Curso que Necesitas?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Diseñamos programas personalizados según las necesidades específicas
              de tu empresa. Contáctanos para una cotización a medida.
            </p>
            <Link href="/contacto">
              <Button variant="heroOutline" size="xl">
                Solicitar Cotización Personalizada
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
