import { motion } from "framer-motion";
import heroImg from "@/assets/hero-dra.jpg";

const WHATSAPP_URL = "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Dra Roberta Castro - Dermatologista" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-block bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/30">
            Tratamentos Estéticos
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
            Dra Roberta Castro
            <span className="block text-3xl md:text-4xl lg:text-5xl font-medium mt-2 text-primary-foreground/80">
              Dermatologista
            </span>
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 mb-4 leading-relaxed">
            Especialista em Dermatologia Clínica, Cirúrgica e Estética Avançada.
          </p>
          <p className="font-body text-base text-primary-foreground/70 mb-10">
            Valorizando sua autoestima, saúde e beleza de forma natural.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-gradient text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity text-center shadow-lg"
            >
              Agendar Consulta
            </a>
            <a
              href="#tratamentos"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-primary-foreground/10 transition-colors text-center"
            >
              Ver Tratamentos
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
