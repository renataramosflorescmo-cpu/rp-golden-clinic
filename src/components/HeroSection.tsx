import { motion } from "framer-motion";
import heroImg from "@/assets/hero-golden.jpg";

const WHATSAPP_URL = "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background base — cream/nude from brandbook */}
      <div className="absolute inset-0 bg-card" />

      {/* Image positioned to the right */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[50%] lg:w-[55%]">
          <img
            src={heroImg}
            alt="RP Golden Clinic"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center"
          />
          {/* Wide soft gradient for seamless blend */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, hsl(38, 40%, 95%) 0%, hsl(38, 40%, 95% / 0.95) 15%, hsl(38, 40%, 95% / 0.7) 35%, hsl(38, 40%, 95% / 0.3) 55%, hsl(38, 40%, 95% / 0.05) 75%, transparent 100%)' }} />
        </div>
      </div>

      {/* Text content — constrained to left half */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-md lg:max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Dermatologia Estética Avançada
            </p>
            <div className="w-12 h-px bg-accent mb-6" />
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] mb-6 tracking-tight">
            RP
            <span className="block font-semibold">Golden</span>
            <span className="block italic font-light text-primary">Clinic</span>
          </h1>

          <p className="font-body text-base font-light text-muted-foreground mb-4 leading-relaxed max-w-sm">
            Especialista em Dermatologia Clínica, Cirúrgica e Estética Avançada.
          </p>
          <p className="font-body text-sm text-muted-foreground/70 mb-10 max-w-xs">
            Autoestima, confiança e transformação através da ciência e do cuidado refinado com a pele.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-gradient text-primary-foreground px-8 py-4 rounded-sm text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity text-center"
            >
              Agendar Consulta
            </a>
            <a
              href="#tratamentos"
              className="border border-foreground/20 text-foreground px-8 py-4 rounded-sm text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/5 transition-colors text-center"
            >
              Tratamentos
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
