'use client'

import { useState } from "react";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
} from "lucide-react";

import Header from "@sout/components/layout/Header";
import Footer from "@sout/components/layout/Footer";
import PageHero from "@sout/components/layout/PageHero";
import { Button } from "@sout/components/ui/button";
import { Input } from "@sout/components/ui/input";
import { Textarea } from "@sout/components/ui/textarea";

import { useToast } from "@sout/hooks/use-toast";
import wstp from "@sout/assets/wstp.svg";

const Contact = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    course: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar teléfono (solo números)
    const phoneRegex = /^[0-9\s+()-]*$/;

    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Error en el teléfono",
        description: "El teléfono debe contener solo números y símbolos válidos (+, -, espacios)",
        variant: "destructive",
      });
      
return;
    }

    // Validar longitud mínima de mensaje
    if (formData.message.trim().length < 10) {
      toast({
        title: "Mensaje muy corto",
        description: "Por favor, describe con más detalle tus necesidades (mínimo 10 caracteres)",
        variant: "destructive",
      });
      
return;
    }

    // Construir mensaje para WhatsApp con todos los campos
    const message = `Hola, solicito información y cotización de SOUT Training Center.

📋 *DATOS DEL CONTACTO:*
👤 Nombre: ${formData.name.trim()}
🏢 Empresa: ${formData.company.trim() || 'No especificado'}
📧 Email: ${formData.email.trim()}
📱 Teléfono: ${formData.phone.trim()}

📚 *CURSO DE INTERÉS:*
${formData.course ? formData.course.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'No especificado'}

💬 *MENSAJE:*
${formData.message.trim()}

Espero su respuesta. Gracias.`;

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/51977959001?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    // Limpiar formulario
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      course: "",
      message: "",
    });

    toast({
      title: "¡Redirigiendo a WhatsApp!",
      description: "Te estamos conectando con nuestro equipo de atención.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero
          eyebrow="Contáctanos"
          title={
            <>
              Estamos Aquí para <span className="text-primary">Ayudarte</span>
            </>
          }
          description="¿Tienes preguntas sobre nuestros cursos? ¿Necesitas una cotización personalizada? Contáctanos y te responderemos en menos de 24 horas."
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
          }
        />

        {/* Contact Content */}
        <section className="section-padding-tight bg-background">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Información de Contacto
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        Dirección
                      </h4>
                      <p className="text-muted-foreground">
                        Av. Alameda del Corregidor 1769<br />
                        La Molina, Lima, Perú
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        RUC: 20605873872
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        Teléfonos
                      </h4>
                      <p className="text-muted-foreground">
                        <a href="tel:+51977959001" className="hover:text-primary transition-colors">
                          +51 977 959 001
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="tel:+51932191033" className="hover:text-primary transition-colors">
                          +51 932 191 033
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="tel:+51966424257" className="hover:text-primary transition-colors">
                          +51 966 424 257
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        Correos Electrónicos
                      </h4>
                      <p className="text-muted-foreground">
                        <a href="mailto:capacitaciones@soutrainingcenter.com" className="hover:text-primary transition-colors">
                          capacitaciones@soutrainingcenter.com
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="mailto:administracion@soutrainingcenter.com" className="hover:text-primary transition-colors">
                          administracion@soutrainingcenter.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        Horario de Atención
                      </h4>
                      <p className="text-muted-foreground">
                        Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                        Sábados: 9:00 AM - 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://facebook.com/SOUTTrainingCenter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 hover:shadow-lg hover:scale-110 transition-all duration-300 border-2 border-blue-600"
                  >
                    <Facebook className="w-7 h-7 text-white" />
                  </a>
                  <a
                    href="https://wa.me/51977959001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center hover:bg-green-600 hover:shadow-lg hover:scale-110 transition-all duration-300 p-2.5 border-2 border-green-500"
                  >
                    <img src={wstp.src} alt="WSTP" className="w-full h-full object-contain" />
                  </a>
                </div>

                {/* Map */}
                <div className="mt-10 rounded-2xl overflow-hidden h-64 bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.0377851694086!2d-76.9301!3d-12.0744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA0JzI3LjgiUyA3NsKwNTUnNDguNCJX!5e0!3m2!1sen!2spe!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de SOUT Training Center"
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                  Solicitar Cotización
                </h3>
                <p className="text-muted-foreground mb-8">
                  Completa el formulario y te contactaremos en menos de 24 horas.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre Completo *
                      </label>
                      <Input
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        minLength={3}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Empresa
                      </label>
                      <Input
                        type="text"
                        placeholder="Nombre de tu empresa (opcional)"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Correo Electrónico *
                      </label>
                      <Input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Teléfono *
                      </label>
                      <Input
                        type="tel"
                        placeholder="999999999"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9+\s()-]/g, '');

                          setFormData({ ...formData, phone: value });
                        }}
                        required
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Curso de Interés
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      className="w-full bg-background border border-input rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    >
                      <option value="">Selecciona un curso (opcional)</option>
                      <option value="manejo-defensivo-nsc">Manejo Defensivo NSC</option>
                      <option value="manejo-4x4-mineria">Manejo 4x4 Minería</option>
                      <option value="primeros-auxilios-rcp">Primeros Auxilios - RCP - DEA</option>
                      <option value="uso-extintores">Uso de Extintores</option>
                      <option value="fatiga-somnolencia">Fatiga y Somnolencia</option>
                      <option value="formacion-instructores">Formación de Instructores NSC</option>
                      <option value="practicas-modelo-mina">Prácticas Modelo Mina Lima</option>
                      <option value="otro">Otro servicio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      placeholder="Cuéntanos sobre tus necesidades: cantidad de participantes, fechas preferidas, ubicación, modalidad (presencial/virtual), etc."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      minLength={10}
                      maxLength={500}
                      rows={5}
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
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
