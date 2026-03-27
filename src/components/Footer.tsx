import { Phone, Mail, MapPin, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-16 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
      <div>
        <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
          Dra Roberta Castro
        </h3>
        <p className="font-body text-sm leading-relaxed">
          Dermatologista – CRM 160891. Especialista em Dermatologia Clínica, Cirúrgica e Estética Avançada. Valorizando sua autoestima, saúde e beleza de forma natural.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Contato</h4>
        <ul className="space-y-3 font-body text-sm">
          <li className="flex items-center gap-2"><Phone size={16} /> (11) 93211-0460</li>
          <li className="flex items-center gap-2"><Phone size={16} /> (11) 95890-3864</li>
          <li className="flex items-center gap-2"><Mail size={16} /> contato@drarobertacastro.com.br</li>
          <li className="flex items-center gap-2"><Instagram size={16} /> @drarobertacastro</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Unidades</h4>
        <ul className="space-y-3 font-body text-sm">
          <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Rua Fidêncio Ramos, 100 – Vila Olímpia</li>
          <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Rua Min. Gabriel de Resende Passos, 500 – Moema</li>
          <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Av. Dr. Chucri Zaidan, 940 – Morumbi</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/50">
      © 2026 Dra Roberta Castro. Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
