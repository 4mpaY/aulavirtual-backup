'use client'

import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'
import PageHero from '@sout/components/layout/PageHero'
import { Button } from '@sout/components/ui/button'
import Link from 'next/link'
import { Target, Eye, CheckCircle } from 'lucide-react'
import heroImage from '@sout/assets/historial.jpeg'
import nscLogo from '@sout/assets/nsc-menu.png'
import marcaLogo from '@sout/assets/ccl.png'
import saegLogo from '@sout/assets/hodelpe.jpg'

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero
          eyebrow="Quiénes Somos"
          title={
            <>
              Líderes en <span className="text-primary">Capacitación</span> de Seguridad Vial
            </>
          }
          description="Más de 10 años formando conductores y operadores responsables, seguros y eficientes para los sectores minero, industrial y de transporte en Perú."
          background={
            <>
              <div className="absolute inset-0">
                <img
                  src={heroImage.src}
                  alt="Equipo de SOUT Training Center en capacitación"
                  className="h-full w-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
              </div>
            </>
          }
        />

        {/* About Content */}
        <section className="section-padding-tight bg-background">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  SOUT S.A.C. (SOUT TRAINING CENTER)
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Somos un centro de entrenamiento, dedicada a la capacitación y certificación de operadores y conductores de equipos, en temas relacionados al Manejo Defensivo y Seguridad y Salud en el Trabajo.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Ayudamos a empresas a reducir estadísticas de accidentes viales, diseñando estrategias y capacitaciones específicas de Manejo Defensivo, Certificadas por el NSC, acorde a las condiciones y factores reales de trabajo, en operaciones mineras, petroleras e industria en general.
                  Contamos con profesionales, especialistas en Manejo Defensivo, Seguridad y Salud en el Trabajo y Primeros Auxilios. Orientamos la formación de conductores y operadores a Gestionar las 3 condiciones de manejo: el Conductor Como Persona, El equipo o vehículo como herramienta de trabajo e interactuar con las condiciones que nos rodean.
                </p>
                <div className="flex gap-6 md:gap-8 items-center">
                  <img src={nscLogo.src} alt="NSC USA" className="h-32 w-32 md:h-40 md:w-40 object-contain" />
                  <img src={saegLogo.src} alt="Hodelpe" className="h-32 w-32 md:h-40 md:w-40 object-contain" />
                  <img src={marcaLogo.src} alt="CCL" className="h-32 w-32 md:h-40 md:w-40 object-contain" />
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={heroImage.src}
                    alt="Equipo de trabajo SOUT"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl">
                  <div className="font-heading text-4xl font-black">10+</div>
                  <div className="text-sm">Años de Experiencia</div>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Brindar servicios de capacitación y entrenamiento especializados en
                  seguridad vial, manejo defensivo y operación responsable de vehículos
                  y equipos, formando conductores competentes y conscientes del riesgo,
                  bajo estándares nacionales e internacionales, contribuyendo a la
                  prevención de accidentes, la protección de la vida y el desarrollo
                  sostenible de las organizaciones del sector minero, industrial y de transporte.
                </p>
              </div>
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Nuestra Visión
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser un centro de entrenamiento líder y referente a nivel nacional en
                  capacitación de manejo defensivo, seguridad vial y prevención de riesgos,
                  reconocido por la excelencia de sus instructores, el uso de metodologías
                  modernas y el cumplimiento de estándares internacionales, contribuyendo
                  a una cultura de seguridad y cero accidentes en los sectores minero,
                  industrial y de transporte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-secondary">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Nuestros Valores
              </h2>
              <p className="text-secondary-foreground/80">
                Los principios que guían cada una de nuestras capacitaciones.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Excelencia", description: "Compromiso con la calidad en cada capacitación" },
                { title: "Seguridad", description: "La vida y el bienestar como prioridad absoluta" },
                { title: "Innovación", description: "Metodologías modernas y actualizadas" },
                { title: "Integridad", description: "Transparencia y ética en todo lo que hacemos" },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-background rounded-xl p-6 text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-lg text-foreground mb-2">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary">
          <div className="section-container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              ¿Listo para Capacitar a Tu Equipo?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Contáctanos hoy y descubre cómo nuestros programas certificados pueden
              transformar la seguridad de tu organización.
            </p>
            <Link href="/contacto">
              <Button variant="heroOutline" size="xl">
                Solicitar Cotización
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
