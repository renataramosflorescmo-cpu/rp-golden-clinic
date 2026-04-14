import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Syringe, Pill, Scissors, Droplets, Leaf, HeartPulse, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = { Sparkles, Syringe, Pill, Scissors, Droplets, Leaf, HeartPulse, Zap };

const WHATSAPP_BASE = "https://wa.me/5511932110460?text=";

type Category = "facial" | "capilar" | "corporal";

const categories: { key: Category; label: string }[] = [
  { key: "facial", label: "Facial" },
  { key: "capilar", label: "Capilar" },
  { key: "corporal", label: "Corporal" },
];

const treatmentsByCategory: Record<Category, { icon: any; title: string; desc: string; whatsMsg: string; slug?: string }[]> = {
  facial: [
    {
      icon: Sparkles,
      title: "Bioestimuladores de Colágeno",
      desc: "Produtos injetados no tecido subcutâneo que estimulam a produção natural de colágeno com resultados duradouros.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Bioestimuladores de Colágeno.",
      slug: "/tratamentos/bioestimuladores-colageno",
    },
    {
      icon: Syringe,
      title: "Preenchimento com Ácido Hialurônico",
      desc: "Reestruturação facial devolvendo volume e contorno de forma natural e harmoniosa.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Preenchimento.",
      slug: "/tratamentos/preenchimento-acido-hialuronico",
    },
    {
      icon: Pill,
      title: "Toxina Botulínica",
      desc: "Aplicação em rosto, pescoço e tratamento de hiperidrose em axilas, mãos e pés.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Toxina Botulínica.",
      slug: "/tratamentos/toxina-botulinica",
    },
    {
      icon: Droplets,
      title: "Profhilo",
      desc: "Biorremodelador tecidual revolucionário que promove hidratação profunda, melhorando textura e firmeza da pele.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Profhilo.",
      slug: "/tratamentos/profhilo",
    },
    {
      icon: HeartPulse,
      title: "PDRN (Polinucleotídeos)",
      desc: "Tratamento avançado que regenera a pele, estimula colágeno e clareia manchas, promovendo luminosidade e rejuvenescimento.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre o tratamento com PDRN.",
      slug: "/tratamentos/pdrn",
    },
  ],
  capilar: [
    {
      icon: Leaf,
      title: "Mesoterapia Capilar",
      desc: "Microinjeções de vitaminas e nutrientes no couro cabeludo para fortalecer e estimular o crescimento dos fios.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Mesoterapia Capilar.",
    },
    {
      icon: Zap,
      title: "LED Capilar",
      desc: "Terapia com luz de baixa intensidade que estimula a circulação e fortalece os folículos capilares.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre LED Capilar.",
    },
    {
      icon: HeartPulse,
      title: "PRP Capilar",
      desc: "Plasma rico em plaquetas aplicado no couro cabeludo para regeneração e crescimento capilar.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre PRP Capilar.",
    },
  ],
  corporal: [
    {
      icon: Scissors,
      title: "Remodelação Glútea",
      desc: "Melhora da textura e qualidade da pele com resultado mais firme e natural.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Remodelação Glútea.",
    },
    {
      icon: Sparkles,
      title: "Bioestimuladores Corporais",
      desc: "Estímulo de colágeno em áreas do corpo para firmeza, redução de flacidez e rejuvenescimento.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Bioestimuladores Corporais.",
    },
    {
      icon: Syringe,
      title: "Enzimas Lipolíticas",
      desc: "Tratamento injetável para redução de gordura localizada e melhora do contorno corporal.",
      whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Enzimas Lipolíticas.",
      slug: "/tratamentos/enzimas-lipoliticas",
    },
  ],
};

const ServicesSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("facial");
  const [dbTreatments, setDbTreatments] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_treatments").select("*").eq("visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setDbTreatments(data);
    });
  }, []);

  // Use DB treatments if available, otherwise fallback to hardcoded
  const treatments = dbTreatments.length > 0
    ? dbTreatments.map(t => ({ icon: iconMap[t.icon] || Sparkles, title: t.title, desc: t.short_description, whatsMsg: `Olá, Dra. Roberta! Gostaria de saber mais sobre ${t.title}.`, slug: t.slug ? `/tratamentos/${t.slug}` : undefined }))
    : treatmentsByCategory[activeCategory];

  return (
    <section id="tratamentos" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Tratamentos</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Procedimentos
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5 mb-4" />
          <p className="font-body text-muted-foreground font-light max-w-lg mx-auto">
            Cada procedimento é realizado com amor, dedicação e tecnologia de ponta para valorizar sua beleza natural.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-body text-sm md:text-base tracking-[0.1em] uppercase px-6 py-2.5 rounded-sm border transition-all duration-300 ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Treatment Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {treatments.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-background border border-border rounded-sm p-10 hover:shadow-xl hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mb-6 group-hover:bg-gold-gradient transition-colors duration-500">
                  <t.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{t.title}</h3>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed mb-6">{t.desc}</p>
                <div className="flex items-center gap-6">
                  <a
                    href={`${WHATSAPP_BASE}${encodeURIComponent(t.whatsMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-body text-xs tracking-[0.15em] uppercase font-medium hover:text-gold-dark transition-colors"
                  >
                    Agendar <span>→</span>
                  </a>
                  {t.slug && (
                    <Link
                      to={t.slug}
                      className="inline-flex items-center gap-2 text-foreground/40 font-body text-xs tracking-[0.15em] uppercase font-medium hover:text-primary transition-colors"
                    >
                      Saiba mais <span>→</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServicesSection;
