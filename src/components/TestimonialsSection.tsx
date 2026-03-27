import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marina Costa",
    role: "Paciente há 2 anos",
    text: "Depois de anos com dores crônicas, finalmente encontrei uma equipe que realmente se importa. O tratamento mudou minha qualidade de vida completamente.",
    stars: 5,
  },
  {
    name: "Rafael Oliveira",
    role: "Atleta profissional",
    text: "A equipe multidisciplinar fez toda diferença na minha recuperação. Voltei a competir em tempo recorde e com total segurança.",
    stars: 5,
  },
  {
    name: "Ana Beatriz Silva",
    role: "Paciente há 1 ano",
    text: "O acompanhamento nutricional aliado aos tratamentos transformou não só meu corpo, mas minha relação com a saúde. Recomendo de olhos fechados!",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Prova Social</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            O que nossos pacientes dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-background border border-border rounded-2xl p-8 relative"
            >
              <Quote size={40} className="text-secondary absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={18} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="font-body text-foreground/80 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{t.role}</p>
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
