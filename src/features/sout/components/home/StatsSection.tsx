import { Award, Users, Building2, Shield } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "10+",
    label: "Años de Experiencia",
    description: "Formando profesionales desde 2014",
    color: "primary",
  },
  {
    icon: Shield,
    value: "NSC",
    label: "Autorizado USA",
    description: "National Safety Council Certified",
    color: "accent",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Empresas Capacitadas",
    description: "Minería, industria y transporte",
    color: "primary",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Profesionales Formados",
    description: "Conductores y operadores certificados",
    color: "accent",
  },
];

const StatsSection = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-muted overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="section-container relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  stat.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 md:w-7 md:h-7 ${
                    stat.color === "primary" ? "text-primary" : "text-accent"
                  }`}
                />
              </div>

              {/* Value */}
              <div
                className={`font-heading text-3xl md:text-4xl font-black mb-2 ${
                  stat.color === "primary" ? "text-primary" : "text-accent"
                }`}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div className="font-heading font-semibold text-base md:text-lg text-foreground mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-muted-foreground">{stat.description}</p>

              {/* Decorative Corner */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-[100px] transition-opacity duration-300 group-hover:opacity-20 ${
                  stat.color === "primary" ? "bg-primary" : "bg-accent"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
