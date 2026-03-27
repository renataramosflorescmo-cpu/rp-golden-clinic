import { motion } from "framer-motion";
import { Sparkles, Syringe, Pill, Scissors } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/5511932110460?text=";

const treatments = [
  {
    icon: Sparkles,
    title: "Bioestimuladores de Colágeno",
    desc: "Produtos injetados no tecido subcutâneo que estimulam a produção natural de colágeno, restaurando a juventude da pele com resultados duradouros.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Bioestimuladores de Colágeno.",
  },
  {
    icon: Syringe,
    title: "Preenchimento com Ácido Hialurônico",
    desc: "Preenchimento com ácido hialurônico para contribuir na reestruturação facial, devolvendo volume e contorno de forma natural.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Preenchimento com Ácido Hialurônico.",
  },
  {
    icon: Pill,
    title: "Toxina Botulínica",
    desc: "Aplicação em rosto, pescoço, axilas, palma das mãos e planta dos pés para tratamento de hiperidrose e rugas de expressão.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Toxina Botulínica.",
  },
  {
    icon: Scissors,
    title: "Remodelação Glútea",
    desc: "Tratamento que melhora a textura e qualidade da pele, proporcionando um resultado mais firme e empinado de forma segura.",
    whatsMsg: "Olá, Dra. Roberta! Gostaria de saber mais sobre Remodelação Glútea.",
  },
];

const ServicesSection = () => {
  return (
    <section id="tratamentos" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Tratamentos</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Procedimentos com amor e dedicação
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Veja todos os procedimentos que trabalho para valorizar sua beleza natural.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {treatments.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-rose-gradient transition-colors">
                <t.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{t.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">{t.desc}</p>
              <a
                href={`${WHATSAPP_BASE}${encodeURIComponent(t.whatsMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary font-semibold text-sm hover:underline"
              >
                Agendar →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
