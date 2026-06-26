import { getAssetSrc } from '@sout/lib/utils'
import reliabe1 from "@sout/assets/reliabe1.jpg";
import servicio2 from "@sout/assets/servicio2.jpg";
import ausenco3 from "@sout/assets/ausenco3.jpg";
import sfp4 from "@sout/assets/sfp4.jpg";
import solmar5 from "@sout/assets/solmar5.jpg";
import core6 from "@sout/assets/core6.jpg";
import planvital7 from "@sout/assets/planvital7.jpg";
import grupo8 from "@sout/assets/grupo8.jpg";
import barrick9 from "@sout/assets/barrick9.jpg";
import laboris10 from "@sout/assets/laboris10.jpg";
import saeg11 from "@sout/assets/saeg11.jpg";
import securitas12 from "@sout/assets/securitas12.jpg";
import electromet13 from "@sout/assets/electromet13.jpg";
import geandina14 from "@sout/assets/geandina14.jpg";
import akd15 from "@sout/assets/akd15.jpg";
import ana16 from "@sout/assets/ana16.jpg";
import mejia17 from "@sout/assets/mejia17.jpg";
import cultinor18 from "@sout/assets/cultinor18.jpg";
import fondo19 from "@sout/assets/fondo19.jpg";
import engie20 from "@sout/assets/engie20.jpg";
import unna21 from "@sout/assets/unna21.jpg";
import provias22 from "@sout/assets/provias22.jpg";
import solarig23 from "@sout/assets/solarig23.jpg";
import adinelsa24 from "@sout/assets/adinelsa24.jpg";
import perforaciones25 from "@sout/assets/perforaciones25.jpg";
import minero26 from "@sout/assets/minero26.jpg";
import dim27 from "@sout/assets/dim27.jpg";
import als28 from "@sout/assets/als28.jpg";
import valor29 from "@sout/assets/valor29.jpg";
import explomin30 from "@sout/assets/explomin30.jpg";
import volcan31 from "@sout/assets/volcan31.jpg";
import oefa32 from "@sout/assets/oefa32.jpg";
import prosegur33 from "@sout/assets/prosegur33.jpg";
import jrc34 from "@sout/assets/jrc34.jpg";
import frontera35 from "@sout/assets/frontera35.jpg";
import neptis36 from "@sout/assets/neptis36.jpg";

const clients = [
  { name: "Reliable Controls", logo: reliabe1 },
  { name: "Servicio", logo: servicio2 },
  { name: "Ausenco", logo: ausenco3 },
  { name: "SFP Drilling", logo: sfp4 },
  { name: "Solmar", logo: solmar5 },
  { name: "Core Tech", logo: core6 },
  { name: "Planvital", logo: planvital7 },
  { name: "Grupo Mejia", logo: grupo8 },
  { name: "Barrick Gold", logo: barrick9 },
  { name: "Salus Laboris", logo: laboris10 },
  { name: "SAEG Security", logo: saeg11 },
  { name: "Securitas", logo: securitas12 },
  { name: "Electrometal", logo: electromet13 },
  { name: "Gevandina Exploraciones", logo: geandina14 },
  { name: "AKD Consultores", logo: akd15 },
  { name: "Ana", logo: ana16 },
  { name: "Grupo Mejia", logo: mejia17 },
  { name: "Cultinor", logo: cultinor18 },
  { name: "Fondo", logo: fondo19 },
  { name: "Engie Energía", logo: engie20 },
  { name: "UNNA Transporte", logo: unna21 },
  { name: "Provias Nacional", logo: provias22 },
  { name: "Solarig", logo: solarig23 },
  { name: "Adinelsa", logo: adinelsa24 },
  { name: "Perforaciones", logo: perforaciones25 },
  { name: "Minera", logo: minero26 },
  { name: "Dim", logo: dim27 },
  { name: "ALS Global", logo: als28 },
  { name: "Valor Sostenible", logo: valor29 },
  { name: "Explomin", logo: explomin30 },
  { name: "Volcan Compañía Minera", logo: volcan31 },
  { name: "Oefa", logo: oefa32 },
  { name: "Prosegur", logo: prosegur33 },
  { name: "JRC", logo: jrc34 },
  { name: "Frontera Energy", logo: frontera35 },
  { name: "Neptis", logo: neptis36 },
];

const ClientsMarquee = () => {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-background border-t border-border overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4">
          <span className="inline-block font-heading text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Nuestros Clientes
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Empresas que <span className="text-primary">Confían</span> en Nosotros
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Más de 500 empresas líderes en los sectores minero, industrial y de transporte
          </p>
        </div>

        {/* Primera fila - Izquierda a Derecha */}
        <div className="relative mb-6 md:mb-8">
          <div className="flex animate-marquee-left hover:pause-marquee">
            {/* Duplicamos los clientes 3 veces para continuidad */}
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex">
                {clients.slice(0, 18).map((client, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex-shrink-0 mx-6 w-40 h-28 bg-card rounded-xl shadow-md border-2 border-border flex items-center justify-center p-4 hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    {client.logo ? (
                      <img
                        src={getAssetSrc(client.logo)}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-heading font-bold text-sm text-center text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {client.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Segunda fila - Derecha a Izquierda */}
        <div className="relative">
          <div className="flex animate-marquee-right hover:pause-marquee">
            {/* Duplicamos los clientes 3 veces para continuidad */}
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex">
                {clients.slice(18, 36).map((client, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex-shrink-0 mx-6 w-40 h-28 bg-card rounded-xl shadow-md border-2 border-border flex items-center justify-center p-4 hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    {client.logo ? (
                      <img
                        src={getAssetSrc(client.logo)}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-heading font-bold text-sm text-center text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {client.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }

          @keyframes marquee-right {
            0% {
              transform: translateX(-33.333%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-marquee-left {
            animation: marquee-left 40s linear infinite;
          }

          .animate-marquee-right {
            animation: marquee-right 40s linear infinite;
          }

          .hover\\:pause-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ClientsMarquee;
