import heroImage from "@sout/assets/historial.jpeg";
import nscLogo from "@sout/assets/nsc-menu.png";
import marcaLogo from "@sout/assets/ccl.png";
import saegLogo from "@sout/assets/hodelpe.jpg";

const HistorySection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="px-4 md:px-0">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
              SOUT S.A.C. (SOUT TRAINING CENTER)
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              Somos un centro de entrenamiento, dedicada a la capacitación y certificación de operadores y conductores de equipos, en temas relacionados al Manejo Defensivo y Seguridad y Salud en el Trabajo.
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              Ayudamos a empresas a reducir estadísticas de accidentes viales, diseñando estrategias y capacitaciones específicas de Manejo Defensivo, Certificadas por el NSC, acorde a las condiciones y factores reales de trabajo, en operaciones mineras, petroleras e industria en general.
              Contamos con profesionales, especialistas en Manejo Defensivo, Seguridad y Salud en el Trabajo y Primeros Auxilios. Orientamos la formación de conductores y operadores a Gestionar las 3 condiciones de manejo: el Conductor Como Persona, El equipo o vehículo como herramienta de trabajo e interactuar con las condiciones que nos rodean.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 items-center justify-center lg:justify-start">
              <img src={nscLogo.src} alt="NSC USA" className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain" />
              <img src={saegLogo.src} alt="Hodelpe" className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain" />
              <img src={marcaLogo.src} alt="CCL" className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain" />
            </div>
          </div>
          <div className="relative px-4 md:px-0">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={heroImage.src}
                alt="Equipo de trabajo SOUT"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-primary text-primary-foreground p-4 sm:p-6 rounded-xl shadow-xl">
              <div className="font-heading text-3xl sm:text-4xl font-black">10+</div>
              <div className="text-xs sm:text-sm">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
