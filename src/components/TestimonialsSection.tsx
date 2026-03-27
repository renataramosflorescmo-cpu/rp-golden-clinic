import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Camila Rodrigues",
    role: "Paciente – Bioestimuladores",
    text: "A Dra. Roberta é incrível! Fiz bioestimuladores de colágeno e o resultado ficou super natural. Minha pele nunca esteve tão bonita. Recomendo de olhos fechados!",
    stars: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Paciente – Preenchimento",
    text: "Procurei a Dra. Roberta para preenchimento facial e fiquei encantada com a delicadeza e profissionalismo. O resultado ficou harmonioso e natural, exatamente como eu queria.",
    stars: 5,
  },
  {
    name: "Juliana Santos",
    role: "Paciente – Toxina Botulínica",
    text: "Depois de anos com receio de aplicar botox, encontrei na Dra. Roberta a confiança que precisava. Resultado leve, sem exageros. Ela realmente entende de estética!",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="section-padding bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            O que nossas pacientes dizem
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
              className="bg-card border border-border rounded-3xl p-8 relative"
            >
              <Quote size={40} className="text-secondary absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={18} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="font-body text-foreground/80 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-rose-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm">
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
