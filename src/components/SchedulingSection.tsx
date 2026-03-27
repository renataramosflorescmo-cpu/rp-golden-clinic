import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_URL = "https://wa.me/5511932110460";

const serviceOptions = [
  "Bioestimuladores de Colágeno",
  "Preenchimento com Ácido Hialurônico",
  "Toxina Botulínica",
  "Remodelação Glútea",
  "Avaliação Dermatológica",
  "Outro",
];

const SchedulingSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const msg = `Olá, Dra. Roberta! Meu nome é ${form.name}. Gostaria de agendar: ${form.service}. ${form.message ? "Obs: " + form.message : ""}`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("Redirecionando para o WhatsApp...");
  };

  const inputClass =
    "w-full bg-background border border-border rounded-xl px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <section id="contato" className="section-padding bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Agendamento</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Agende sua consulta
            </h2>
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              Preencha o formulário e você será redirecionada ao WhatsApp para confirmar o agendamento diretamente com a equipe.
            </p>

            <div className="space-y-5">
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Localização</h4>
                <div className="font-body text-sm text-muted-foreground space-y-1">
                  <p>Rua Fidêncio Ramos, 100 – Vila Olímpia</p>
                  <p>Rua Min. Gabriel de Resende Passos, 500 – Moema</p>
                  <p>Av. Dr. Chucri Zaidan, 940 – Morumbi</p>
                </div>
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Contato</h4>
                <div className="font-body text-sm text-muted-foreground space-y-1">
                  <p>(11) 93211-0460</p>
                  <p>(11) 95890-3864</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-background border border-border rounded-3xl p-8 space-y-5 shadow-lg"
          >
            <div className="relative">
              <User size={18} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo *" className={`${inputClass} pl-11`} />
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="WhatsApp *" className={`${inputClass} pl-11`} />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="E-mail (opcional)" className={`${inputClass} pl-11`} />
            </div>
            <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
              <option value="">Selecione o tratamento *</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-4 text-muted-foreground" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Mensagem (opcional)" rows={3} className={`${inputClass} pl-11 resize-none`} />
            </div>
            <button type="submit" className="w-full bg-rose-gradient text-primary-foreground py-4 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-md">
              Agendar via WhatsApp
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;
