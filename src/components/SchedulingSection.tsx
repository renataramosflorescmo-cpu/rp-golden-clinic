import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import treatmentImg from "@/assets/treatment.jpg";

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
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    const msg = `Olá, Dra. Roberta! Meu nome é ${form.name}. Gostaria de agendar: ${form.service}. ${form.message ? "Obs: " + form.message : ""}`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("Redirecionando para o WhatsApp...");
  };

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-4 py-3.5 font-body text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition";

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Agendamento</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Agende sua consulta
            </h2>
            <div className="w-12 h-px bg-accent mb-8" />
            <p className="font-body text-muted-foreground font-light mb-8 leading-relaxed">
              Preencha o formulário e você será redirecionada ao WhatsApp para confirmar diretamente com a equipe.
            </p>

            <img src={treatmentImg} alt="Tratamento estético" loading="lazy" className="rounded-sm mb-8 w-full shadow-lg" />

            <div className="space-y-5">
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Unidades</h4>
                <div className="font-body text-sm text-muted-foreground font-light space-y-1">
                  <p>Rua Fidêncio Ramos, 100 – Vila Olímpia</p>
                  <p>Rua Min. Gabriel de Resende Passos, 500 – Moema</p>
                  <p>Av. Dr. Chucri Zaidan, 940 – Morumbi</p>
                </div>
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Contato</h4>
                <div className="font-body text-sm text-muted-foreground font-light space-y-1">
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
            className="bg-card border border-border rounded-sm p-8 md:p-10 space-y-5 shadow-lg"
          >
            <div className="relative">
              <User size={16} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo *" className={`${inputClass} pl-11`} />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="WhatsApp *" className={`${inputClass} pl-11`} />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-4 text-muted-foreground" />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="E-mail (opcional)" className={`${inputClass} pl-11`} />
            </div>
            <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
              <option value="">Selecione o tratamento *</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-4 top-4 text-muted-foreground" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Mensagem (opcional)" rows={3} className={`${inputClass} pl-11 resize-none`} />
            </div>
            <button type="submit" className="w-full bg-gold-gradient text-primary-foreground py-4 rounded-sm text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
              Agendar via WhatsApp
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;
