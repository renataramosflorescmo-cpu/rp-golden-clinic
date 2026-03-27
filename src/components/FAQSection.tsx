import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tratamentos estéticos a Dra. Roberta oferece?",
    a: "Bioestimuladores de colágeno, preenchimentos com ácido hialurônico, toxina botulínica, remodelação glútea, peelings químicos e tratamentos a laser.",
  },
  {
    q: "Quais são as especialidades na dermatologia estética?",
    a: "Tratamentos antienvelhecimento, melhoria da saúde da pele, acne, rosácea e manchas hiperpigmentadas com as mais recentes tecnologias.",
  },
  {
    q: "Como funciona a abordagem de cuidados com a pele?",
    a: "Avaliação detalhada e plano personalizado orientado para resultados duradouros e naturais, respeitando as características únicas de cada paciente.",
  },
  {
    q: "Como agendar uma consulta?",
    a: "Entre em contato pelo WhatsApp (11) 93211-0460 ou preencha o formulário abaixo. Nossa equipe responderá rapidamente!",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Dúvidas</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Perguntas Frequentes
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5" />
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-sm px-6 overflow-hidden">
              <AccordionTrigger className="font-display text-lg font-medium text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground font-light pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
