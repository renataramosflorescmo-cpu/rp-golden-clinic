import { useState } from "react";
import { MapPin, Clock, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?sca_esv=18487c6ae7c08b5b&hl=en-BR&gl=br&sxsrf=ANbL-n6m-5THicZmCPqPRSW7hwXnXAPJ4Q:1774647791134&kgmid=/g/11t85qb5cy&shem=epsdc&shndl=30&kgs=4cc9190556c49a76&um=1&ie=UTF-8&fb=1&sa=X&geocode=KeFn3Yd3V86UMd9rYWapS8Xs&daddr=Rua+Lu%C3%ADs+Correia+de+Melo,+92+-+Ch%C3%A1cara+Santo+Ant%C3%B4nio,+S%C3%A3o+Paulo+-+SP,+04726-220";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const clinicImages = [
  {
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    alt: "Recepção da clínica",
  },
  {
    url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    alt: "Sala de procedimentos",
  },
  {
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    alt: "Sala de espera",
  },
  {
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
    alt: "Consultório",
  },
];

const schedule = [
  { day: "Segunda-feira", hours: "09:00 – 19:00" },
  { day: "Terça-feira", hours: "09:00 – 19:00" },
  { day: "Quarta-feira", hours: "09:00 – 19:00" },
  { day: "Quinta-feira", hours: "09:00 – 19:00" },
  { day: "Sexta-feira", hours: "09:00 – 18:00" },
  { day: "Sábado", hours: "09:00 – 13:00" },
  { day: "Domingo", hours: "Fechado" },
];

const SedeChacaraSantoAntonio = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const next = () => setCurrentImage((p) => (p + 1) % clinicImages.length);
  const prev = () => setCurrentImage((p) => (p - 1 + clinicImages.length) % clinicImages.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-wide">
            Sede – Chácara Santo Antônio
          </h1>
          <p className="text-foreground/50 font-body text-sm tracking-wide mb-10">
            Conheça nossa unidade principal
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Carousel — 3 cols */}
            <div className="lg:col-span-3 relative rounded-md overflow-hidden aspect-[4/3] bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={clinicImages[currentImage].url}
                  alt={clinicImages[currentImage].alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm border border-border/50 rounded-full p-2 hover:bg-background transition-colors"
              >
                <ChevronLeft size={20} className="text-foreground" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm border border-border/50 rounded-full p-2 hover:bg-background transition-colors"
              >
                <ChevronRight size={20} className="text-foreground" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {clinicImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === currentImage ? "bg-primary" : "bg-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Info — 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Address */}
              <div className="bg-card border border-border rounded-md p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-foreground mb-1">
                      Endereço
                    </h3>
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-foreground/60 hover:text-primary transition-colors leading-relaxed"
                    >
                      Rua Luís Correia de Melo, 92
                      <br />
                      Chácara Santo Antônio, São Paulo – SP
                      <br />
                      CEP 04726-220
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-foreground mb-1">
                      Telefone
                    </h3>
                    <a
                      href="tel:+5511932110460"
                      className="font-body text-sm text-foreground/60 hover:text-primary transition-colors"
                    >
                      (11) 93211-0460
                    </a>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-card border border-border rounded-md p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} className="text-primary shrink-0" />
                  <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-foreground">
                    Horário de Funcionamento
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {schedule.map((s) => (
                    <li key={s.day} className="flex justify-between font-body text-sm">
                      <span className="text-foreground/70">{s.day}</span>
                      <span className={s.hours === "Fechado" ? "text-destructive/70" : "text-foreground/50"}>
                        {s.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-gradient text-primary-foreground text-center px-6 py-3 rounded-sm text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
              >
                Agendar Consulta
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default SedeChacaraSantoAntonio;
