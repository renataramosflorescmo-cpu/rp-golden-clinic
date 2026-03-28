import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const stats = [
  { icon: TrendingUp, metric: "95%", title: "Melhora Visível", desc: "Pacientes com melhora significativa nas primeiras sessões." },
  { icon: Award, metric: "1.200+", title: "Procedimentos", desc: "Realizados com segurança e excelência." },
  { icon: Users, metric: "5.000+", title: "Pacientes", desc: "Confiança construída com dedicação." },
  { icon: Star, metric: "4.9/5", title: "Avaliação", desc: "Nota média em avaliações verificadas." },
];

const galleryImages = [
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/cd345662-3bcf-4da4-9798-fb681fc0c4fc.jpg", alt: "Resultado 1" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/cdab084a-6076-4639-907b-51ed7e7feaa4.jpg", alt: "Resultado 2" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_1.jpg", alt: "Resultado 3" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_2.jpg", alt: "Resultado 4" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_3.jpg", alt: "Resultado 5" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_4.jpg", alt: "Resultado 6" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_5.jpg", alt: "Resultado 7" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_6.jpg", alt: "Resultado 8" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_7.jpg", alt: "Resultado 9" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_8.jpg", alt: "Resultado 10" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_9.jpg", alt: "Resultado 11" },
  { src: "https://drarobertacastro.com.br/wp-content/uploads/2025/03/Screenshot_10.jpg", alt: "Resultado 12" },
];

const ITEMS_PER_PAGE = 3;

const Resultados = () => {
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const totalPages = Math.ceil(galleryImages.length / ITEMS_PER_PAGE);
  const currentImages = galleryImages.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const nextPage = () => setPage((p) => (p + 1) % totalPages);
  const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Stats Section */}
      <section className="pt-28 pb-16 bg-gold-gradient text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3">
              Mural de Resultados
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">
              Resultados que transformam
            </h1>
            <div className="w-12 h-px bg-primary-foreground/40 mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-sm p-8 text-center"
              >
                <r.icon size={28} className="mx-auto mb-4 text-primary-foreground/80" />
                <p className="font-display text-4xl font-bold mb-1">{r.metric}</p>
                <h3 className="font-display text-lg font-medium mb-2">{r.title}</h3>
                <p className="font-body text-xs text-primary-foreground/60 font-light">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-foreground/50 mb-3">
              Galeria
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Procedimentos Dra. Roberta Castro
            </h2>
            <div className="w-12 h-px bg-primary/40 mx-auto mt-5" />
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentImages.map((img, i) => (
                <motion.div
                  key={`${page}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="cursor-pointer group"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <div className="aspect-[3/4] rounded-md overflow-hidden border border-border bg-muted">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={prevPage}
                className="bg-card border border-border rounded-full p-3 hover:border-primary/40 transition-colors"
              >
                <ChevronLeft size={20} className="text-foreground/70" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === page ? "bg-primary" : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="bg-card border border-border rounded-full p-3 hover:border-primary/40 transition-colors"
              >
                <ChevronRight size={20} className="text-foreground/70" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={selectedImage}
            alt="Resultado ampliado"
            className="max-w-full max-h-[85vh] rounded-md object-contain"
          />
        </div>
      )}

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Resultados;
