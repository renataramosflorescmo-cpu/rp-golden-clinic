import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tratamentos estéticos a Dra. Roberta Castro oferece?",
    a: "A Dra. Roberta oferece uma ampla gama de tratamentos estéticos, incluindo bioestimuladores de colágeno, preenchimentos com ácido hialurônico, toxina botulínica, remodelação glútea, peelings químicos e tratamentos a laser.",
  },
  {
    q: "Quais são as especialidades da Dra. Roberta na dermatologia estética?",
    a: "Além de tratamentos antienvelhecimento, a Dra. Roberta é especializada em melhoria da saúde da pele, tratando condições como acne, rosácea e manchas hiperpigmentadas com as mais recentes tecnologias.",
  },
  {
    q: "Como funciona a abordagem de cuidados com a pele?",
    a: "A Dra. Roberta adota uma abordagem holística, realizando uma avaliação detalhada da pele e criando um plano de tratamento personalizado, orientado para resultados duradouros e naturais.",
  },
  {
    q: "A primeira avaliação é gratuita?",
    a: "Entre em contato pelo WhatsApp para verificar as condições de agendamento e valores de consulta. A equipe terá prazer em ajudá-la!",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Dúvidas</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Perguntas Frequentes
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-2xl px-6 overflow-hidden">
              <AccordionTrigger className="font-display text-lg font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground pb-5">
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
