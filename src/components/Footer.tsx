import { Mail, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/70 py-16 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="font-display text-2xl font-semibold text-primary-foreground tracking-wide mb-4">
          <span className="tracking-[0.2em] uppercase text-lg">Golden Clinic</span>
        </h3>
        <p className="font-body text-sm font-light leading-relaxed">
          Dermatologia Estética Avançada. CRM 160891. Autoestima, confiança e transformação através da ciência e do cuidado refinado com a pele.
        </p>
      </div>
      <div>
        <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground mb-4">Contato</h4>
        <ul className="space-y-3 font-body text-sm font-light">
          <li className="flex items-center gap-2"><Mail size={14} /> contato@drarobertacastro.com.br</li>
          <li className="flex items-center gap-2"><Instagram size={14} /> @drarobertacastro</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/40 tracking-wider">
      © 2026 RP Golden Clinic. Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
