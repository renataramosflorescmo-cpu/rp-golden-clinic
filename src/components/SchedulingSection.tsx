import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import treatmentImg from "@/assets/treatment.jpg";
import { supabase } from "@/lib/supabase";

const WHATSAPP_URL = "https://wa.me/5511932110460";
const CONTACT_EMAILS = ["contato@drarobertacastro.com.br", "roberta_castro@outlook.com"];

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

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    setSending(true);

    // Salvar lead no Supabase
    await supabase.from("site_leads").insert({
      name: form.name, phone: form.phone, email: form.email,
      service: form.service, message: form.message, source: "home"
    });

    // Enviar e-mail via mailto (abre no cliente de e-mail como fallback)
    const emailSubject = "Formulário Home do Site - RP Golden Clinic";
    const emailBody = `Novo contato pelo formulário do site:

Nome: ${form.name}
WhatsApp: ${form.phone}
E-mail: ${form.email || "Não informado"}
Tratamento: ${form.service}
Mensagem: ${form.message || "Nenhuma"}

---
Enviado automaticamente pelo site RP Golden Clinic`;

    // Enviar via Supabase Edge Function ou mailto
    try {
      // Tenta enviar via fetch para um endpoint de e-mail (se configurado)
      await fetch(`https://bggqklkeqdmkefvrjuka.supabase.co/functions/v1/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ3FrbGtlcWRta2VmdnJqdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODIzOTYsImV4cCI6MjA5MDU1ODM5Nn0.mV0Hq6vOgyEKZQk5379_UoBU96vnfWl-VCFgT0DHiZs` },
        body: JSON.stringify({ to: CONTACT_EMAILS.join(","), subject: emailSubject, body: emailBody })
      });
    } catch {
      // Fallback: abre mailto
      window.open(`mailto:${CONTACT_EMAILS.join(",")}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    }

    // Redirecionar para WhatsApp
    const msg = `Olá, Dra. Roberta! Meu nome é ${form.name}. Gostaria de agendar: ${form.service}. ${form.message ? "Obs: " + form.message : ""}`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank");

    toast.success("Contato enviado com sucesso!");
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
    setSending(false);
  };

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-4 py-3.5 font-body text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition";

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Agendamento</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Agende sua consulta
          </h2>
          <div className="w-12 h-px bg-accent mb-8" />
          <p className="font-body text-muted-foreground font-light leading-relaxed">
            Preencha o formulário e você será redirecionada ao WhatsApp para confirmar diretamente com a equipe.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={treatmentImg} alt="Tratamento estético" loading="lazy" className="rounded-sm w-full shadow-lg" />
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
              Enviar
            </button>
            <p className="font-body text-xs text-foreground/40 text-center mt-3 leading-relaxed">
              Ao enviar os dados acima, eu concordo em receber contatos e mensagens da RP Golden Clinic.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;
