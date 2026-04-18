import { useState, useEffect } from "react";
import { MapPin, Clock, Phone, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import SEO from "@/components/SEO";

import clinicReception from "@/assets/clinic-reception.jpg";
import clinicInterior from "@/assets/clinic-interior-2.jpg";
import clinicWaiting from "@/assets/clinic-waiting.jpg";
import clinicHallway from "@/assets/clinic-hallway.jpg";

const clinicImages = [
  { url: clinicReception, alt: "Recepção da clínica" },
  { url: clinicInterior, alt: "Sala de procedimentos" },
  { url: clinicWaiting, alt: "Sala de espera" },
  { url: clinicHallway, alt: "Corredor da clínica" },
];

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?sca_esv=18487c6ae7c08b5b&hl=en-BR&gl=br&sxsrf=ANbL-n6m-5THicZmCPqPRSW7hwXnXAPJ4Q:1774647791134&kgmid=/g/11t85qb5cy&shem=epsdc&shndl=30&kgs=4cc9190556c49a76&um=1&ie=UTF-8&fb=1&sa=X&geocode=KeFn3Yd3V86UMd9rYWapS8Xs&daddr=Rua+Lu%C3%ADs+Correia+de+Melo,+92+-+Ch%C3%A1cara+Santo+Ant%C3%B4nio,+S%C3%A3o+Paulo+-+SP,+04726-220";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

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
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  useEffect(() => {
    supabase.from("google_reviews").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setGoogleReviews(data);
    });
  }, []);
  const [currentImage, setCurrentImage] = useState(0);

  const next = () => setCurrentImage((p) => (p + 1) % clinicImages.length);
  const prev = () => setCurrentImage((p) => (p - 1 + clinicImages.length) % clinicImages.length);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sede Chácara Santo Antônio | RP Golden Clinic"
        description="Clínica de dermatologia estética da Dra. Roberta Castro, CRM 160891, na Rua Luís Correia de Melo, 92 - Chácara Santo Antônio, São Paulo. Segunda a sexta 9h-19h e sábado 9h-13h."
        path="/sede-chacara-santo-antonio"
        schema={{
          "@context": "https://schema.org",
          "@type": ["MedicalClinic", "LocalBusiness"],
          name: "RP Golden Clinic - Sede Chácara Santo Antônio",
          image: "https://rp-golden-clinic.pages.dev/logo-rp.png",
          url: "https://rp-golden-clinic.pages.dev/sede-chacara-santo-antonio",
          telephone: "+55-11-93211-0460",
          priceRange: "$$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Luís Correia de Melo, 92",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "04726-220",
            addressCountry: "BR",
          },
          geo: { "@type": "GeoCoordinates", latitude: -23.6478, longitude: -46.6978 },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday"], opens: "09:00", closes: "19:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
          ],
          medicalSpecialty: "Dermatology",
        }}
      />
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

      {/* Google Reviews Carousel */}
      {googleReviews.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.93 23.93 0 000 24c0 3.77.9 7.33 2.44 10.48l8.09-5.89z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary">Avaliações Google</p>
              </div>
              <h2 className="font-display text-3xl font-semibold text-foreground">O que dizem nossos pacientes</h2>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={reviewIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
                  className="bg-card rounded-xl border border-border/50 p-8 md:p-10 max-w-2xl mx-auto text-center">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(googleReviews[reviewIdx]?.rating || 5)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="font-body text-base font-light text-foreground/70 leading-relaxed italic mb-6">
                    "{googleReviews[reviewIdx]?.text}"
                  </p>
                  {googleReviews[reviewIdx]?.reply && (
                    <p className="font-body text-xs text-[#c9a96e] italic mb-4">
                      Resposta da RP Golden Clinic: {googleReviews[reviewIdx].reply}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8935a] to-[#c9a96e] flex items-center justify-center text-white font-display text-sm font-semibold">
                      {googleReviews[reviewIdx]?.author_name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{googleReviews[reviewIdx]?.author_name}</p>
                      <p className="font-body text-xs text-foreground/40">{googleReviews[reviewIdx]?.review_date ? new Date(googleReviews[reviewIdx].review_date).toLocaleDateString("pt-BR") : ""}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {googleReviews.length > 1 && (
                <>
                  <button onClick={() => setReviewIdx((i) => (i - 1 + googleReviews.length) % googleReviews.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-sm">
                    <ChevronLeft size={18} className="text-foreground/40" />
                  </button>
                  <button onClick={() => setReviewIdx((i) => (i + 1) % googleReviews.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-sm">
                    <ChevronRight size={18} className="text-foreground/40" />
                  </button>
                </>
              )}

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {googleReviews.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? "bg-[#c9a96e] w-6" : "bg-foreground/10"}`} />
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <a href="https://www.google.com/search?hl=en-BR&gl=br&q=Dra+Roberta+Castro+Dermatologia&ludocid=17061125954302208991#lrd=" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#c9a96e]/30 text-[#c9a96e] px-6 py-3 rounded-lg text-xs font-body font-medium hover:bg-[#c9a96e]/5 transition-colors">
                Ver todas as avaliações no Google
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default SedeChacaraSantoAntonio;
