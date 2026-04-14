import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fallbackTestimonials = [
  { name: "Camila Rodrigues", role: "Bioestimuladores", text: "A Dra. Roberta é incrível! Fiz bioestimuladores de colágeno e o resultado ficou super natural. Minha pele nunca esteve tão bonita.", stars: 5 },
  { name: "Fernanda Lima", role: "Preenchimento", text: "Procurei a Dra. Roberta para preenchimento facial e fiquei encantada com a delicadeza e profissionalismo. Resultado harmonioso e natural.", stars: 5 },
  { name: "Juliana Santos", role: "Toxina Botulínica", text: "Depois de anos com receio de aplicar botox, encontrei na Dra. Roberta a confiança que precisava. Resultado leve, sem exageros.", stars: 5 },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  useEffect(() => {
    supabase.from("site_testimonials").select("*").eq("visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);
  return (
    <section id="depoimentos" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Depoimentos</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            O que dizem nossas pacientes
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card border border-border rounded-sm p-8 relative"
            >
              <Quote size={36} className="text-accent/20 absolute top-6 right-6" />
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="font-body text-foreground/70 leading-relaxed mb-6 font-light italic text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-gold-gradient flex items-center justify-center text-primary-foreground font-display text-sm font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-body font-medium text-foreground text-sm">{t.name}</p>
                  <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
