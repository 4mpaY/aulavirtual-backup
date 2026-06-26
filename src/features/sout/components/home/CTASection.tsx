'use client'

import { useState } from "react";
import { Button } from "@sout/components/ui/button";
import { Input } from "@sout/components/ui/input";
import { Textarea } from "@sout/components/ui/textarea";
import { Send, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@sout/hooks/use-toast";

const CTASection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construir mensaje para WhatsApp
    const message = `Hola, solicito una cotización de SOUT Training Center.

📋 *Datos de contacto:*
👤 Nombre: ${formData.name}
📧 Email: ${formData.email}
📱 Teléfono: ${formData.phone}

💬 *Mensaje:*
${formData.message}

Espero su respuesta. Gracias.`;

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/51977959001?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Limpiar formulario
    setFormData({ name: "", email: "", phone: "", message: "" });

    toast({
      title: "¡Redirigiendo a WhatsApp!",
      description: "Te estamos conectando con nuestro equipo.",
    });
  };

  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="section-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="px-4 md:px-0">
            <span className="inline-block font-heading text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Contáctenos
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              ¿Listo para{" "}
              <span className="text-primary">Capacitar</span> a Tu Equipo?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
              Solicita una cotización personalizada para tu empresa. Nuestro equipo 
              te contactará en menos de 24 horas con una propuesta adaptada a tus necesidades.
            </p>

            {/* Benefits */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Cotizaciones sin compromiso",
                "Cursos presenciales, virtuales o grabados",
                "Certificaciones internacionales NSC",
                "Precios especiales para empresas",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 md:space-y-4">
              <a
                href="tel:+51977959001"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base">+51 977 959 001</span>
              </a>
              <a
                href="mailto:capacitaciones@soutrainingcenter.com"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base break-all">capacitaciones@soutrainingcenter.com</span>
              </a>
              <div className="flex items-start gap-3 text-foreground">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <span>Av. Alameda del Corregidor 1769, La Molina, Lima</span>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-background rounded-2xl shadow-xl p-8 border border-border">
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">
              Solicitar Cotización
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre Completo
                </label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    placeholder="+51 999 999 999"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mensaje
                </label>
                <Textarea
                  placeholder="Cuéntanos sobre tus necesidades de capacitación..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
              >
                Enviar Solicitud
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
