import { motion } from "framer-motion";
import heroImg from "@/assets/hero-clinic.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Clínica Vitale"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block bg-accent/20 text-accent-foreground backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-accent/30">
            Saúde & Bem-Estar
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Cuide de você com quem
            <span className="block text-accent"> entende de resultados</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-lg">
            Tratamentos personalizados com tecnologia de ponta e acompanhamento profissional para transformar sua saúde e qualidade de vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#agendamento"
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Agendar Avaliação Gratuita
            </a>
            <a
              href="#servicos"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg text-base font-medium hover:bg-primary-foreground/10 transition-colors text-center"
            >
              Conheça Nossos Serviços
            </a>
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "5.000+", label: "Pacientes atendidos" },
            { num: "98%", label: "Satisfação" },
            { num: "15+", label: "Anos de experiência" },
            { num: "20+", label: "Especialidades" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{s.num}</p>
              <p className="font-body text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
