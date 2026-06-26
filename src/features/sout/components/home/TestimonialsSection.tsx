import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Carlos Castro",
    role: "Representante",
    company: "SFP Drilling",
    content:
      "El curso ha reducido una enorme brecha que teníamos antes. Lo que más nos gusta es su disponibilidad todos los días en Lima, Trujillo y Arequipa para poder programar a nuestros colaboradores.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jean Pierre",
    role: "Representante",
    company: "Neftis Secure",
    content:
      "Somos aliados hace 3 años y las capacitaciones que brinda SOUT son efectivas. Nos han ayudado a la reducción de accidentes así como cumplir con la exigencia de requisitos de nuestros clientes.",
    rating: 5,
  },
  {
    id: 3,
    name: "Anayka Cruzate",
    role: "Jefa de Seguridad",
    company: "Explomin",
    content:
      "Las capacitaciones de SOUT Training Center han sido fundamentales para reducir los incidentes viales en nuestra operación. El enfoque práctico y la metodología NSC marcan la diferencia.",
    rating: 5,
  },
  {
    id: 4,
    name: "Neyruth Huamani Taipe",
    role: "Coordinador SSOMA",
    company: "Volcan Compañía Minera",
    content:
      "Excelente equipo de instructores con amplia experiencia en el sector minero. Los cursos de manejo 4x4 han mejorado significativamente las competencias de nuestros operadores.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-secondary text-secondary-foreground overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <span className="inline-block font-heading text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Testimonios
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 md:mb-6">
            Lo Que Dicen{" "}
            <span className="text-primary">Nuestros Clientes</span>
          </h2>
          <p className="text-base md:text-lg text-secondary-foreground/80">
            Empresas líderes confían en SOUT Training Center para la capacitación 
            de sus equipos en seguridad vial y manejo defensivo.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 left-6 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-sm text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="font-heading font-bold text-lg text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="font-heading font-bold text-base text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role} - {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
