import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-16 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
      <div>
        <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
          Vitale<span className="text-accent">.</span>
        </h3>
        <p className="font-body text-sm leading-relaxed">
          Cuidando da sua saúde com excelência, tecnologia e carinho. Sua transformação começa aqui.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Contato</h4>
        <ul className="space-y-3 font-body text-sm">
          <li className="flex items-center gap-2"><Phone size={16} /> (11) 99999-0000</li>
          <li className="flex items-center gap-2"><Mail size={16} /> contato@vitale.com.br</li>
          <li className="flex items-center gap-2"><MapPin size={16} /> São Paulo, SP</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Horário</h4>
        <ul className="space-y-2 font-body text-sm">
          <li>Seg a Sex: 08:00 – 18:00</li>
          <li>Sábado: 08:00 – 12:00</li>
          <li>Domingo: Fechado</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/50">
      © 2026 Vitale. Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
