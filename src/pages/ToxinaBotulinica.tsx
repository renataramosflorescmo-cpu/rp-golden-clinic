import { motion } from "framer-motion";
import { Shield, Clock, Sparkles, Eye, Droplets, SmilePlus, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import toxinaHero from "@/assets/toxina-hero.jpg";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+saber+mais+sobre+Toxina+Botul%C3%ADnica.";

const benefits = [
  { icon: Shield, title: "Relaxamento Muscular", desc: "Reduz a tensão muscular, proporcionando uma aparência mais suave e relaxada." },
  { icon: Sparkles, title: "Prevenção de Rugas", desc: "Ajuda a prevenir a formação de novas rugas, mantendo a pele jovem e saudável." },
  { icon: SmilePlus, title: "Melhora do Contorno Facial", desc: "Realça o contorno do rosto, promovendo uma aparência rejuvenescida." },
  { icon: Droplets, title: "Tratamento de Hiperidrose", desc: "Reduz o suor excessivo em áreas como axilas, mãos e pés, melhorando o conforto diário." },
];

const services = [
  { icon: Eye, title: "Botox Facial", desc: "Reduza rugas na testa, pés de galinha e linhas entre as sobrancelhas com resultados naturais e duradouros." },
  { icon: SmilePlus, title: "Rejuvenescimento do Pescoço", desc: "Melhore o contorno do pescoço e suavize linhas finas para uma aparência mais jovem." },
  { icon: Droplets, title: "Tratamento de Hiperidrose", desc: "Controle o suor excessivo em axilas, mãos e pés com eficácia comprovada." },
  { icon: Sparkles, title: "Levantamento de Sobrancelhas", desc: "Obtenha um olhar mais aberto e expressivo com o levantamento de sobrancelhas não cirúrgico." },
];

const faqs = [
  { q: "O tratamento com botox é seguro?", a: "Sim, quando realizado por profissionais qualificados, o botox é seguro e eficaz." },
  { q: "Quanto tempo duram os efeitos do botox?", a: "Os efeitos podem durar de 3 a 6 meses, dependendo do paciente e da área tratada." },
  { q: "O tratamento é doloroso?", a: "O desconforto é mínimo e pode ser aliviado com anestésicos tópicos." },
  { q: "Posso retornar às minhas atividades normais após o tratamento?", a: "Sim, o tempo de recuperação é mínimo e você pode retomar suas atividades imediatamente." },
  { q: "Quais são as áreas mais comuns para aplicação de botox?", a: "As áreas mais comuns incluem testa, pés de galinha, entre sobrancelhas e pescoço." },
  { q: "O botox pode ser usado para tratar suor excessivo?", a: "Sim, é um tratamento eficaz para hiperidrose em axilas, mãos e pés." },
  { q: "Quais são os cuidados após o tratamento?", a: "Evite esfregar a área tratada e exercícios intensos nas primeiras 24 horas." },
  { q: "Quem não deve fazer o tratamento com botox?", a: "Gestantes, lactantes e pessoas com certas condições neurológicas devem evitar o tratamento." },
  { q: "Quanto tempo leva uma sessão de botox?", a: "Uma sessão geralmente dura entre 15 a 30 minutos." },
];

const ToxinaBotulinica = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img src={toxinaHero} alt="Toxina Botulínica" className="w-full h-full object-cover" />
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
              Descubra a Juventude em Seu Rosto
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight">
              Toxina Botulínica: Beleza e Bem-Estar
            </h1>
            <p className="font-body text-foreground/60 text-base font-light leading-relaxed mb-8">
              Experimente os benefícios da Toxina Botulínica para suavizar rugas e realçar sua beleza natural.
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

      {/* About Dra. Roberta */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Especialista</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Conheça a Dra. Roberta Castro
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              A Dra. Roberta Castro é uma renomada dermatologista estética, formada pela Universidade de São Paulo. Com mais de 15 anos de experiência, ela se especializou em tratamentos com toxina botulínica e bioestimuladores de colágeno, proporcionando resultados naturais e eficazes para seus pacientes.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Sua dedicação à beleza e saúde da pele é evidenciada pelo sucesso de seus tratamentos personalizados, sendo uma referência em dermatologia estética com formação sólida e vasta experiência em procedimentos avançados.
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
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">
              Principais Benefícios
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Por Que Escolher Toxina Botulínica?
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

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">
              Tratamentos Avançados
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Nossos Serviços
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-sm p-10 hover:shadow-xl hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mb-6 group-hover:bg-gold-gradient transition-colors duration-500">
                  <s.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed">{s.desc}</p>
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
              Esclareça suas dúvidas sobre o tratamento com Toxina Botulínica.
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
            Agende Sua Consulta
          </h2>
          <p className="font-body text-primary-foreground/70 text-sm font-light leading-relaxed mb-8">
            Descubra como a Toxina Botulínica pode transformar sua aparência. Agende uma consulta com Dra. Roberta Castro e explore as opções de tratamento para suavizar rugas e melhorar o contorno facial e do pescoço.
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

export default ToxinaBotulinica;
