import { motion } from "framer-motion";
import { Shield, Sparkles, ChevronDown, Target, Scissors, SmilePlus, Syringe, User } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import SEO, { medicalProcedureSchema } from "@/components/SEO";
import heroImg from "@/assets/enzimas-hero.jpg";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+saber+mais+sobre+Enzimas+Lipol%C3%ADticas.";

const applications = [
  { title: "Redução de Papada", desc: "Aprimora a linha do queixo, proporcionando um perfil mais definido e harmonioso." },
  { title: "Contorno Corporal", desc: "Define e esculpe áreas como abdômen, flancos, culote, costas e braços." },
  { title: "Emagrecimento Facial", desc: "Reduz o volume em áreas como o buldogue, afinando a face com naturalidade." },
  { title: "Abdômen e Flancos", desc: "Elimina gordura localizada nessas regiões para um contorno mais definido." },
  { title: "Braços e Costas", desc: "Reduz acúmulos de gordura e melhora o contorno dessas áreas." },
  { title: "Culote", desc: "Tratamento direcionado para suavizar e redefinir a silhueta dos quadris." },
];

const benefits = [
  { icon: Target, title: "Quebra de Gordura Localizada", desc: "Atua diretamente nas células adiposas, promovendo sua eliminação de forma eficaz." },
  { icon: Scissors, title: "Melhora do Contorno Corporal", desc: "Define e esculpe áreas como abdômen, flancos e braços para uma silhueta harmoniosa." },
  { icon: SmilePlus, title: "Rejuvenescimento Facial", desc: "Reduz o volume em áreas como o buldogue, afinando a face e devolvendo jovialidade." },
  { icon: User, title: "Tratamento Personalizado", desc: "Aplicações específicas para cada necessidade e área do corpo, com resultados sob medida." },
];

const faqs = [
  { q: "O que são enzimas lipolíticas?", a: "São substâncias injetáveis que promovem a quebra de gordura localizada, facilitando a eliminação de células adiposas em áreas específicas do corpo e rosto." },
  { q: "Quais áreas podem ser tratadas?", a: "Papada, abdômen, flancos, culote, costas, braços e face. Cada área recebe uma aplicação personalizada conforme a necessidade." },
  { q: "Quantas sessões são necessárias?", a: "O número de sessões varia conforme a área e a quantidade de gordura. Geralmente são recomendadas de 3 a 5 sessões com intervalo de 15 a 30 dias." },
  { q: "O procedimento é doloroso?", a: "O desconforto é mínimo. Pode haver leve sensação de ardência durante a aplicação, que é bem tolerada pela maioria dos pacientes." },
  { q: "Quando os resultados aparecem?", a: "Os primeiros resultados podem ser percebidos após 2 a 4 semanas da primeira sessão, com melhora progressiva ao longo do tratamento." },
  { q: "As enzimas lipolíticas são seguras?", a: "Sim, são seguras quando aplicadas por profissionais qualificados como a Dra. Roberta Castro, seguindo protocolos adequados." },
];

const EnzimasLipoliticas = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Enzimas Lipolíticas em São Paulo | RP Golden Clinic"
        description="Enzimas lipolíticas injetáveis pela Dra. Roberta Castro, CRM 160891, em São Paulo. Quebra de gordura localizada em papada, abdômen, flancos, culote, braços e face. Protocolo de 3 a 5 sessões."
        path="/tratamentos/enzimas-lipoliticas"
        schema={medicalProcedureSchema({
          name: "Enzimas Lipolíticas",
          description: "Aplicação injetável de enzimas lipolíticas para quebra de gordura localizada em áreas específicas do corpo e face.",
          path: "/tratamentos/enzimas-lipoliticas",
          bodyLocation: "papada, abdômen, flancos, culote, braços, costas, face (buldogue)",
          preparation: "Protocolo de 3 a 5 sessões com intervalo de 15 a 30 dias.",
        })}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Enzimas Lipolíticas em São Paulo - RP Golden Clinic" className="w-full h-full object-cover" />
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
              Tratamento Inovador
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight">
              Enzimas Lipolíticas
            </h1>
            <p className="font-body text-foreground/60 text-base font-light leading-relaxed mb-8">
              Tratamento inovador para redução de gordura localizada e aprimoramento do contorno corporal, com resultados visíveis e naturais.
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
              O Que São Enzimas Lipolíticas?
            </h2>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed mb-4">
              As enzimas lipolíticas são substâncias injetáveis que promovem a quebra de gordura localizada, facilitando a eliminação de células adiposas. Elas atuam diretamente nas áreas desejadas, como papada, abdômen e flancos, proporcionando resultados visíveis no contorno corporal e na estética facial.
            </p>
            <p className="font-body text-foreground/60 text-sm font-light leading-relaxed">
              Este tratamento é uma alternativa eficaz para quem busca emagrecimento localizado e rejuvenescimento facial, com aplicações personalizadas para cada necessidade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Métodos de Aplicação */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Áreas de Tratamento</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Aplicações das Enzimas Lipolíticas
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Métodos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Métodos</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Métodos de Aplicação
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-border rounded-sm p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Syringe size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Aplicação Localizada</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">
                  Ideal para áreas como papada, abdômen, culote, flancos, costas e braços, proporcionando um contorno corporal mais definido.
                </p>
              </div>
              <div className="border border-border rounded-sm p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Sparkles size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Aplicação Intramuscular</h3>
                <p className="font-body text-foreground/50 text-sm font-light leading-relaxed">
                  Utilizada para auxiliar no emagrecimento geral, promovendo uma redução de gordura mais abrangente e resultados satisfatórios.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
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
              Vantagens do Tratamento
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
            Agende Sua Consulta Hoje
          </h2>
          <p className="font-body text-primary-foreground/70 text-sm font-light leading-relaxed mb-8">
            Descubra como as enzimas lipolíticas podem transformar seu corpo e elevar sua autoestima. Agende uma consulta para conhecer o tratamento ideal para você.
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

export default EnzimasLipoliticas;
