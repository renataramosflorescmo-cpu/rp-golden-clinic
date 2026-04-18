import { motion } from "framer-motion";
import { Shield, Sparkles, SmilePlus, Droplets, ChevronDown, Heart, Layers, Hand, CircleDot } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import SEO, { medicalProcedureSchema } from "@/components/SEO";
import heroImg from "@/assets/bioestimuladores-hero.jpg";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+saber+mais+sobre+Bioestimuladores+de+Col%C3%A1geno.";

const applications = [
  { title: "Rosto", desc: "Previne e trata a flacidez, proporcionando um contorno facial mais definido e rejuvenescido." },
  { title: "Pescoço e Colo", desc: "Mantém a pele firme e com aparência jovem, combatendo os sinais de envelhecimento." },
  { title: "Braços", desc: "Ideal para manter a firmeza e melhorar a textura da pele, especialmente na parte superior dos braços." },
  { title: "Abdômen", desc: "Melhora a firmeza e trata a flacidez, garantindo um abdômen mais tonificado." },
  { title: "Coxas", desc: "Melhora a firmeza, especialmente na parte interna das coxas, para uma aparência mais suave." },
  { title: "Glúteos", desc: "Melhora a textura da pele, deixando os glúteos mais firmes, lisos e empinados." },
  { title: "Celulite", desc: "Associado à subcisão, melhora significativamente o aspecto de 'casca de laranja', suavizando a pele." },
  { title: "Outras Áreas", desc: "Aplicações personalizadas para atender às necessidades específicas de cada paciente." },
];

const benefits = [
  { icon: Shield, title: "Prevenção da Flacidez", desc: "Mantém a pele firme e jovem por mais tempo, prevenindo a perda de sustentação." },
  { icon: Sparkles, title: "Melhora da Textura", desc: "A textura da pele se torna mais suave e uniforme com o aumento da produção de colágeno." },
  { icon: Heart, title: "Rejuvenescimento Natural", desc: "Estimula a produção natural de colágeno sem intervenções invasivas." },
  { icon: Layers, title: "Resultados Duradouros", desc: "Efeitos que podem durar de 12 a 24 meses, dependendo do tipo de pele." },
];

const faqs = [
  { q: "Os bioestimuladores de colágeno são seguros?", a: "Sim, são seguros quando aplicados por profissionais qualificados, como a Dra. Roberta Castro." },
  { q: "Quanto tempo duram os efeitos do tratamento?", a: "Os efeitos podem durar de 12 a 24 meses, dependendo do tipo de pele e do tratamento realizado." },
  { q: "Quais são os cuidados pós-aplicação?", a: "É recomendado evitar exposição solar intensa e seguir as orientações específicas fornecidas pelo dermatologista." },
  { q: "Quando posso ver os resultados?", a: "Os resultados começam a ser visíveis após algumas semanas, com melhora contínua ao longo dos meses." },
  { q: "Quantas sessões são necessárias?", a: "O número de sessões varia conforme a necessidade individual, mas geralmente são recomendadas de 2 a 3 sessões." },
  { q: "Posso combinar com outros tratamentos estéticos?", a: "Sim, os bioestimuladores podem ser combinados com outros tratamentos para potencializar os resultados." },
];

const BioestimuladorColageno = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Bioestimulador de Colágeno em São Paulo | RP Golden Clinic"
        description="Bioestimuladores de colágeno (Sculptra, Radiesse) com a Dra. Roberta Castro, CRM 160891, em São Paulo. Estimula colágeno natural, combate flacidez facial e corporal. Resultados de 12 a 24 meses."
        path="/tratamentos/bioestimuladores-colageno"
        schema={medicalProcedureSchema({
          name: "Bioestimulador de Colágeno",
          description: "Aplicação injetável de bioestimuladores (Sculptra, Radiesse) para estimular a produção natural de colágeno e tratar flacidez facial e corporal.",
          path: "/tratamentos/bioestimuladores-colageno",
          bodyLocation: "rosto, pescoço, colo, braços, abdômen, coxas, glúteos",
        })}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Bioestimulador de Colágeno em São Paulo - RP Golden Clinic" className="w-full h-full object-cover" />
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
              Descubra a Revolução
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight">
              Bioestimuladores de Colágeno
            </h1>
            <p className="font-body text-foreground/60 text-base font-light leading-relaxed mb-8">
              Explore como os bioestimuladores de colágeno podem redefinir a firmeza e a textura da sua pele, proporcionando um rejuvenescimento natural e duradouro.
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

      {/* O que são */}
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
              O Que São Bioestimuladores de Colágeno?
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Os bioestimuladores de colágeno são produtos injetáveis que incentivam o corpo a produzir colágeno naturalmente. Este processo melhora a firmeza e a textura da pele, combatendo a flacidez e promovendo um aspecto rejuvenescido e saudável. Ao estimular a produção de colágeno, eles oferecem uma solução eficaz e duradoura para manter a pele jovem e revitalizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Aplicações */}
      <section className="py-20 px-6 bg-card">
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
              Aplicações dos Bioestimuladores
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, i) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-background border border-border rounded-sm p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{app.title}</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-6">
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
              Por Que Escolher Bioestimuladores?
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-sm p-8 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-500"
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
            <p className="font-body text-muted-foreground text-sm font-light mt-4">
              Descubra tudo sobre os tratamentos com bioestimuladores de colágeno.
            </p>
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
            Descubra como os bioestimuladores de colágeno podem transformar sua pele. Agende uma consulta para discutir o tratamento ideal para você.
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

export default BioestimuladorColageno;
