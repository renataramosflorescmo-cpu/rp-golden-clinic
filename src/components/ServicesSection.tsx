import { motion } from "framer-motion";
import { Heart, Brain, Dumbbell, Leaf, Stethoscope, Sparkles } from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Avaliação Completa",
    desc: "Diagnóstico detalhado com exames e análise personalizada do seu estado de saúde.",
  },
  {
    icon: Heart,
    title: "Cardiologia",
    desc: "Acompanhamento cardiológico preventivo e tratamento especializado.",
  },
  {
    icon: Brain,
    title: "Neurologia",
    desc: "Cuidado neurológico avançado com tecnologia de última geração.",
  },
  {
    icon: Dumbbell,
    title: "Fisioterapia",
    desc: "Reabilitação e fortalecimento com protocolos personalizados.",
  },
  {
    icon: Leaf,
    title: "Nutrição Funcional",
    desc: "Planos alimentares individualizados para otimizar sua saúde.",
  },
  {
    icon: Sparkles,
    title: "Estética Avançada",
    desc: "Procedimentos estéticos seguros com resultados comprovados.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Nossos Serviços</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Cuidado integral para sua saúde
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Oferecemos uma gama completa de serviços para cuidar de você de forma completa e personalizada.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <s.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
