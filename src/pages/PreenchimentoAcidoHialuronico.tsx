import { motion } from "framer-motion";
import { Sparkles, Droplets, ChevronDown, Heart, SmilePlus, Syringe, CircleDot } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import heroImg from "@/assets/preenchimento-hero.jpg";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+saber+mais+sobre+Preenchimento+com+%C3%81cido+Hialur%C3%B4nico.";

const services = [
  { icon: SmilePlus, title: "Preenchimento Facial", desc: "Restaura o volume e contorno da face, proporcionando um aspecto mais jovem e saudável." },
  { icon: Droplets, title: "Hidratação Profunda", desc: "Melhora a textura da pele, deixando-a mais macia e luminosa com ácido hialurônico." },
  { icon: Heart, title: "Reestruturação de Glúteos", desc: "Associado aos bioestimuladores, redefine o formato e aumenta o volume dos glúteos." },
  { icon: Sparkles, title: "Suavização de Rugas", desc: "Reduz linhas de expressão, garantindo uma aparência mais suave e descansada." },
];

const characteristics = [
  { title: "Restauração Facial", desc: "Devolve volume e contorno ao rosto, combatendo os sinais do envelhecimento de forma natural." },
  { title: "Hidratação Profunda", desc: "Proporciona hidratação intensa à pele, melhorando luminosidade e viço." },
  { title: "Aumento de Volume Corporal", desc: "Pode ser utilizado nos glúteos em combinação com bioestimuladores para melhorar formato e volume." },
];

const faqs = [
  { q: "O preenchimento com ácido hialurônico é seguro?", a: "Sim, é um procedimento seguro quando realizado por profissionais qualificados como a Dra. Roberta Castro." },
  { q: "Quais são os resultados esperados?", a: "Os resultados incluem pele mais firme, contornos faciais definidos e redução de rugas." },
  { q: "Quanto tempo dura o efeito do preenchimento?", a: "Os efeitos podem durar de 6 a 18 meses, dependendo do metabolismo e da área tratada." },
  { q: "O procedimento é doloroso?", a: "O desconforto é mínimo, pois utilizamos anestésicos tópicos para garantir o máximo de conforto." },
  { q: "Existem contraindicações?", a: "Pessoas com alergia ao ácido hialurônico ou grávidas devem evitar o procedimento." },
  { q: "Qual o tempo de recuperação?", a: "A recuperação é rápida, permitindo que você retome suas atividades normais em pouco tempo." },
];

const PreenchimentoAcidoHialuronico = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Preenchimento com Ácido Hialurônico" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Realce Sua Beleza Natural
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight">
              Preenchimento com Ácido Hialurônico
            </h1>
            <p className="font-body text-foreground/60 text-base font-light leading-relaxed mb-8">
              Descubra como o ácido hialurônico pode transformar sua aparência, restaurando volume e contornos faciais com resultados naturais.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-gold-gradient text-primary-foreground px-8 py-3 rounded-sm text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            >
              Agendar Consulta
            </a>
          </motion.div>
        </div>
      </section>

      {/* O que é */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Sobre o Tratamento</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              O Que é o Preenchimento com Ácido Hialurônico?
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              O preenchimento com ácido hialurônico é um procedimento estético inovador que visa restaurar o volume e a definição do rosto, suavizar rugas e linhas de expressão, além de proporcionar hidratação profunda à pele.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Este tratamento é ideal para quem busca rejuvenescer a aparência de forma segura e eficaz, com resultados visíveis e duradouros. Além do rosto, o ácido hialurônico também pode ser utilizado nos glúteos, em combinação com bioestimuladores, para melhorar o formato e o volume, promovendo uma aparência mais harmoniosa e atraente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Características</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Principais Características do Procedimento
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {characteristics.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-background border border-border rounded-sm p-8 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Nossos Serviços</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Aplicações do Ácido Hialurônico
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-sm p-8 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
                  <s.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Dúvidas</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Perguntas Frequentes
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border border-border rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-display text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="font-body text-sm text-foreground/60 font-light leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gold-gradient text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-5">
            Agende Sua Consulta Hoje
          </h2>
          <p className="font-body text-primary-foreground/70 text-sm font-light leading-relaxed mb-8">
            Descubra como o preenchimento com ácido hialurônico pode transformar sua aparência. Agende uma consulta para conhecer o tratamento ideal para você.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-primary-foreground text-foreground px-8 py-3 rounded-sm text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
          >
            Marcar Consulta
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default PreenchimentoAcidoHialuronico;
