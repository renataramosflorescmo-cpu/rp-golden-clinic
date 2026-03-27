import { motion } from "framer-motion";
import heroImg from "@/assets/hero-golden.jpg";

const WHATSAPP_URL = "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="RP Golden Clinic"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-top"
          style={{ objectPosition: '70% 15%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-4">
              Dermatologia Estética Avançada
            </p>
            <div className="w-12 h-px bg-accent mb-6" />
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground leading-[0.95] mb-6 tracking-tight">
            RP
            <span className="block font-semibold">Golden</span>
            <span className="block italic font-light text-accent">Clinic</span>
          </h1>

          <p className="font-body text-base font-light text-primary-foreground/70 mb-4 leading-relaxed max-w-md">
            Especialista em Dermatologia Clínica, Cirúrgica e Estética Avançada.
          </p>
          <p className="font-body text-sm text-primary-foreground/50 mb-10 max-w-sm">
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
              className="border border-primary-foreground/20 text-primary-foreground px-8 py-4 rounded-sm text-xs font-medium tracking-[0.2em] uppercase hover:bg-primary-foreground/5 transition-colors text-center"
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
