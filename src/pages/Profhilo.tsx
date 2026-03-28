import { motion } from "framer-motion";
import { Droplets, Sparkles, Shield, Clock, Hand, Layers, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import profhiloHero from "@/assets/profhilo-hero.jpg";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+saber+mais+sobre+Profhilo.";

const benefits = [
  { icon: Droplets, title: "Hidratação Profunda", desc: "Restaura o equilíbrio hídrico da pele, proporcionando um brilho saudável e luminosidade natural." },
  { icon: Sparkles, title: "Melhora da Textura", desc: "A textura da pele é visivelmente refinada, deixando-a mais suave e uniforme." },
  { icon: Shield, title: "Firmeza Rejuvenescida", desc: "Promove a firmeza da pele, combatendo a flacidez e redefinindo os contornos faciais." },
  { icon: Layers, title: "Estimulação de Colágeno", desc: "Estimula a produção de colágeno e elastina, essenciais para a elasticidade e juventude da pele." },
  { icon: Hand, title: "Versatilidade de Aplicação", desc: "Indicado para rosto, pescoço, colo, mãos e abdômen." },
  { icon: Clock, title: "Protocolo Eficaz", desc: "Realizado em 2 a 3 sessões com intervalos de 30 dias, garantindo resultados duradouros." },
];

const applications = [
  { area: "Rosto", desc: "Suaviza linhas finas e melhora a hidratação, proporcionando uma aparência mais jovem e luminosa." },
  { area: "Pescoço", desc: "Reduz a flacidez, proporcionando uma aparência mais jovem e definida." },
  { area: "Colo", desc: "Ganha uma pele mais uniforme e revitalizada, tratando sinais de envelhecimento." },
  { area: "Mãos", desc: "Recuperam a suavidade e a elasticidade, revertendo danos ambientais." },
  { area: "Abdômen", desc: "Melhora a firmeza e a textura da pele na região abdominal." },
];

const faqs = [
  { q: "O que é Profhilo?", a: "Profhilo é um biorremodelador tecidual revolucionário que promove hidratação profunda, melhorando a textura e firmeza da pele através do estímulo intenso de colágeno e elastina." },
  { q: "Quantas sessões são necessárias?", a: "Geralmente são recomendadas de 2 a 3 sessões, espaçadas por um intervalo de 30 dias entre cada uma." },
  { q: "Em quais áreas o Profhilo pode ser aplicado?", a: "Pode ser aplicado no rosto, pescoço, colo, mãos e abdômen — qualquer área que mostre sinais de envelhecimento." },
  { q: "Quanto tempo duram os resultados?", a: "Após completar o protocolo, os resultados podem durar até seis meses, com melhora significativa na hidratação e firmeza." },
  { q: "O tratamento é doloroso?", a: "O desconforto é mínimo. O Profhilo é aplicado em pontos estratégicos com técnica precisa para garantir conforto durante o procedimento." },
  { q: "Quando os resultados começam a aparecer?", a: "Muitos pacientes já notam melhora após a primeira sessão, com resultados progressivos ao longo do protocolo completo." },
];

const Profhilo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img src={profhiloHero} alt="Profhilo - Biorremodelador Tecidual" className="w-full h-full object-cover" />
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
              Descubra o Poder do Profhilo
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight">
              Transforme Sua Pele com Profhilo
            </h1>
            <p className="font-body text-foreground/60 text-base font-light leading-relaxed mb-8">
              Experimente a revolução em rejuvenescimento com o Profhilo, um tratamento inovador que redefine a hidratação e firmeza da sua pele.
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

      {/* About */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">O Que é Profhilo?</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Biorremodelador Tecidual Revolucionário
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              Profhilo é um biorremodelador tecidual revolucionário que promove uma hidratação profunda, melhorando a textura e firmeza da pele. Este tratamento inovador estimula intensamente a produção de colágeno e elastina, proporcionando resultados visíveis e duradouros.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Ideal para áreas como rosto, pescoço, colo, mãos e abdômen, o Profhilo é aplicado em 2 a 3 sessões com intervalos de 30 dias, garantindo uma pele mais jovem e revitalizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Principais Benefícios</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Por Que Escolher Profhilo?
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-background border border-border rounded-sm p-8 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
                  <b.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Áreas de Aplicação</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Aplicações do Profhilo
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5 mb-4" />
            <p className="font-body text-muted-foreground text-sm font-light max-w-xl mx-auto">
              O Profhilo é ideal para tratar áreas que mostram sinais de envelhecimento, proporcionando uma pele mais saudável e rejuvenescida.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, i) => (
              <motion.div
                key={app.area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-sm p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-500"
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{app.area}</h3>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Protocolo de Tratamento</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Como Funciona o Protocolo
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              O protocolo de tratamento com Profhilo é cuidadosamente planejado para maximizar os resultados. Geralmente, são recomendadas de 2 a 3 sessões, dependendo das necessidades individuais do paciente. Cada sessão é espaçada por um intervalo de 30 dias.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              Durante cada sessão, o Profhilo é aplicado em pontos estratégicos para garantir uma distribuição uniforme e um efeito lifting natural. O intervalo entre as sessões é crucial para permitir que a pele se adapte e comece a produzir mais colágeno e elastina.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Após completar o protocolo, muitos pacientes notam uma melhora significativa na hidratação e firmeza da pele, com resultados que podem durar até seis meses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
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
            Descubra os Benefícios do Profhilo
          </h2>
          <p className="font-body text-primary-foreground/70 text-sm font-light leading-relaxed mb-8">
            Transforme sua pele com o inovador Profhilo! Agende uma consulta com Dra. Roberta Castro e descubra como melhorar a hidratação, textura e firmeza da sua pele.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-primary-foreground text-foreground px-8 py-3 rounded-sm text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
          >
            Agendar Consulta
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Profhilo;
