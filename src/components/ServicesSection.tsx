import { motion } from "framer-motion";
import { Sparkles, Syringe, Pill, Scissors } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/5511932110460?text=";

const treatments = [
  {
    icon: Sparkles,
    title: "Bioestimuladores de Colágeno",
    desc: "Produtos injetados no tecido subcutâneo que estimulam a produção natural de colágeno com resultados duradouros.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Bioestimuladores de Colágeno.",
  },
  {
    icon: Syringe,
    title: "Preenchimento com Ácido Hialurônico",
    desc: "Reestruturação facial devolvendo volume e contorno de forma natural e harmoniosa.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Preenchimento.",
  },
  {
    icon: Pill,
    title: "Toxina Botulínica",
    desc: "Aplicação em rosto, pescoço e tratamento de hiperidrose em axilas, mãos e pés.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Toxina Botulínica.",
  },
  {
    icon: Scissors,
    title: "Remodelação Glútea",
    desc: "Melhora da textura e qualidade da pele com resultado mais firme e natural.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Remodelação Glútea.",
  },
];

const ServicesSection = () => {
  return (
    <section id="tratamentos" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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

        <div className="grid md:grid-cols-2 gap-8">
          {treatments.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-background border border-border rounded-sm p-10 hover:shadow-xl hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mb-6 group-hover:bg-gold-gradient transition-colors duration-500">
                <t.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors duration-500" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{t.title}</h3>
              <p className="font-body text-muted-foreground text-sm font-light leading-relaxed mb-6">{t.desc}</p>
              <a
                href={`${WHATSAPP_BASE}${encodeURIComponent(t.whatsMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-body text-xs tracking-[0.15em] uppercase font-medium hover:text-gold-dark transition-colors"
              >
                Agendar <span>→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
