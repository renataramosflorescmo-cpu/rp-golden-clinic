import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import SEO, { medicalProcedureSchema } from "@/components/SEO";
import { Sparkles, Droplets, Sun, Hand, Eye, Heart } from "lucide-react";
import pdrnHero from "@/assets/pdrn-hero.jpg";

const WHATSAPP_LINK =
  "https://wa.me/5511932110460?text=" +
  encodeURIComponent("Olá, Dra. Roberta! Gostaria de saber mais sobre o tratamento com PDRN.");

const benefits = [
  { icon: Sparkles, title: "Estimulação de Colágeno", desc: "Promove a produção natural de colágeno para uma pele mais firme." },
  { icon: Droplets, title: "Hidratação Profunda", desc: "Revitaliza a pele com hidratação intensa e duradoura." },
  { icon: Sun, title: "Clareamento de Manchas", desc: "Uniformiza o tom da pele e reduz manchas de envelhecimento." },
  { icon: Heart, title: "Regeneração Celular", desc: "Atua na regeneração dos tecidos, melhorando a qualidade da pele." },
];

const areas = [
  { icon: Eye, title: "Rosto e Pálpebras", desc: "Clareia manchas, estimula colágeno e devolve firmeza à área dos olhos." },
  { icon: Hand, title: "Mãos", desc: "Rejuvenesce e uniformiza o tom da pele das mãos." },
  { icon: Sparkles, title: "Pescoço e Colo", desc: "Suaviza linhas finas, melhora textura e recupera elasticidade." },
];

const faqs = [
  { q: "O que é PDRN?", a: "PDRN (Polinucleotídeos) é um tratamento avançado que atua na regeneração da pele, estimulando a produção de colágeno e melhorando a qualidade da pele de forma natural." },
  { q: "Quais áreas podem ser tratadas?", a: "O PDRN pode ser aplicado no rosto, pálpebras, pescoço, mãos e colo, sendo versátil para diversas necessidades." },
  { q: "Quantas sessões são necessárias?", a: "O protocolo varia conforme a necessidade de cada paciente, mas geralmente são recomendadas de 3 a 5 sessões para resultados ótimos." },
  { q: "O procedimento é doloroso?", a: "O desconforto é mínimo. Pode ser utilizado anestésico tópico para maior conforto durante a aplicação." },
  { q: "Quando os resultados aparecem?", a: "Os primeiros resultados são visíveis após as primeiras sessões, com melhora progressiva da textura, firmeza e luminosidade da pele." },
];

const PDRN = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PDRN (Polinucleotídeos) em São Paulo | RP Golden Clinic"
        description="Tratamento com PDRN (polinucleotídeos) pela Dra. Roberta Castro, CRM 160891, em São Paulo. Regeneração celular, estímulo de colágeno, clareamento de manchas e revitalização da pele."
        path="/tratamentos/pdrn"
        schema={medicalProcedureSchema({
          name: "PDRN (Polinucleotídeos)",
          description: "Aplicação injetável de polinucleotídeos (PDRN) para regeneração tecidual, estímulo de colágeno, hidratação profunda e clareamento de manchas.",
          path: "/tratamentos/pdrn",
          bodyLocation: "rosto, pálpebras, pescoço, colo, mãos",
          preparation: "Protocolo de 3 a 5 sessões conforme indicação.",
        })}
      />
      <Navbar />

      {/* Hero */}
      <section id="inicio" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={pdrnHero} alt="Tratamento PDRN em São Paulo - RP Golden Clinic" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-light mb-4">Tratamento Avançado</p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">PDRN</h1>
            <p className="font-body text-white/80 text-lg font-light leading-relaxed mb-8">
              Polinucleotídeos que regeneram e revitalizam sua pele, promovendo luminosidade e rejuvenescimento natural.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity">
                Agendar Consulta
              </a>
              <Link to="/" className="inline-flex items-center gap-2 border border-white/30 text-white font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-sm hover:bg-white/10 transition-colors">
                ← Voltar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Sobre o tratamento</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">O que é PDRN?</h2>
            <div className="w-12 h-px bg-accent mx-auto mb-8" />
            <p className="font-body text-muted-foreground font-light leading-relaxed text-lg">
              PDRN, ou Polinucleotídeos, é um tratamento avançado que atua na regeneração da pele. Ele melhora a qualidade da pele, estimula a produção de colágeno e ajuda a clarear manchas, proporcionando uma aparência mais jovem e saudável. Ideal para aplicações no rosto, pálpebras, pescoço, mãos e colo, o PDRN é uma solução eficaz para revitalizar sua pele.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Benefícios</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Por que escolher PDRN?</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-background border border-border rounded-sm p-8 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mx-auto mb-5">
                  <b.icon size={26} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{b.title}</h3>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Áreas de Aplicação</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Tratamento Versátil</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5 mb-6" />
            <p className="font-body text-muted-foreground font-light max-w-2xl mx-auto">
              O PDRN pode ser aplicado em diversas áreas, promovendo regeneração e melhora da qualidade da pele em cada região tratada.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {areas.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-card border border-border rounded-sm p-10 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center mx-auto mb-5">
                  <a.icon size={26} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{a.title}</h3>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Dúvidas</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Perguntas Frequentes</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-5" />
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="group bg-background border border-border rounded-sm p-6 cursor-pointer hover:border-primary/30 transition-colors">
                <summary className="font-display text-lg font-semibold text-foreground list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-primary ml-4 group-open:rotate-45 transition-transform duration-300 text-xl">+</span>
                </summary>
                <p className="font-body text-muted-foreground text-sm font-light leading-relaxed mt-4">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold-gradient text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">Agende Sua Consulta</h2>
            <p className="font-body text-primary-foreground/80 font-light text-lg mb-8">
              Descubra como o PDRN pode transformar sua pele e aumentar sua autoestima. Agende uma consulta com a Dra. Roberta Castro.
            </p>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-background text-foreground font-body text-xs tracking-[0.2em] uppercase px-10 py-4 rounded-sm hover:bg-background/90 transition-colors">
              Marcar Agora
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default PDRN;
