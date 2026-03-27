import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Star } from "lucide-react";

const results = [
  {
    icon: TrendingUp,
    metric: "95%",
    title: "Melhora Clínica",
    desc: "Dos pacientes apresentam melhora significativa nos primeiros 3 meses de tratamento.",
  },
  {
    icon: Award,
    metric: "1.200+",
    title: "Casos de Sucesso",
    desc: "Pacientes que atingiram seus objetivos de saúde com nossos protocolos.",
  },
  {
    icon: Users,
    metric: "300+",
    title: "Atletas Atendidos",
    desc: "Profissionais e amadores que confiam em nossos serviços de performance.",
  },
  {
    icon: Star,
    metric: "4.9/5",
    title: "Avaliação Google",
    desc: "Nota média baseada em mais de 800 avaliações verificadas.",
  },
];

const ResultsSection = () => {
  return (
    <section id="resultados" className="section-padding bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Mural de Resultados</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">
            Resultados que falam por si
          </h2>
          <p className="font-body text-primary-foreground/70 mt-4 max-w-xl mx-auto">
            Números reais que demonstram nosso compromisso com a excelência e a saúde dos nossos pacientes.
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
              className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8 text-center"
            >
              <r.icon size={32} className="mx-auto mb-4 text-accent" />
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
