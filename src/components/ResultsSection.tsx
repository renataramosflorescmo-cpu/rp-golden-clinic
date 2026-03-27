import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Star } from "lucide-react";

const results = [
  { icon: TrendingUp, metric: "95%", title: "Melhora Visível", desc: "Pacientes com melhora significativa nas primeiras sessões." },
  { icon: Award, metric: "1.200+", title: "Procedimentos", desc: "Realizados com segurança e excelência." },
  { icon: Users, metric: "5.000+", title: "Pacientes", desc: "Confiança construída com dedicação." },
  { icon: Star, metric: "4.9/5", title: "Avaliação", desc: "Nota média em avaliações verificadas." },
];

const ResultsSection = () => {
  return (
    <section id="resultados" className="section-padding bg-gold-gradient text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3">Mural de Resultados</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            Resultados que transformam
          </h2>
          <div className="w-12 h-px bg-primary-foreground/40 mx-auto mt-5" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((r, i) => (
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
  );
};

export default ResultsSection;
