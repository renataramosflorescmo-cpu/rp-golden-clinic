import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Star } from "lucide-react";

const results = [
  { icon: TrendingUp, metric: "95%", title: "Melhora Visível", desc: "Dos pacientes percebem melhora significativa já nas primeiras sessões." },
  { icon: Award, metric: "1.200+", title: "Procedimentos", desc: "Realizados com segurança e excelência em resultados." },
  { icon: Users, metric: "5.000+", title: "Pacientes Atendidos", desc: "Confiança construída com dedicação e cuidado personalizado." },
  { icon: Star, metric: "4.9/5", title: "Avaliação Google", desc: "Nota média baseada em avaliações verificadas de pacientes." },
];

const ResultsSection = () => {
  return (
    <section id="resultados" className="section-padding bg-rose-gradient text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest">Mural de Resultados</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">
            Resultados que transformam vidas
          </h2>
          <p className="font-body text-primary-foreground/70 mt-4 max-w-xl mx-auto">
            Números que refletem o compromisso com a beleza e saúde dos nossos pacientes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-3xl p-8 text-center"
            >
              <r.icon size={32} className="mx-auto mb-4 text-primary-foreground/90" />
              <p className="font-display text-4xl font-bold mb-2">{r.metric}</p>
              <h3 className="font-display text-lg font-semibold mb-2">{r.title}</h3>
              <p className="font-body text-sm text-primary-foreground/70">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
