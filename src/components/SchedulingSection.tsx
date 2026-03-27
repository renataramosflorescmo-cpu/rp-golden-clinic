import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const serviceOptions = ["Avaliação Completa", "Cardiologia", "Neurologia", "Fisioterapia", "Nutrição Funcional", "Estética Avançada"];

const SchedulingSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    toast.success("Agendamento solicitado com sucesso! Entraremos em contato em breve.");
    setForm({ name: "", email: "", phone: "", service: "", date: "", time: "", message: "" });
  };

  const inputClass =
    "w-full bg-background border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <section id="agendamento" className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Agendamento Online</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Agende sua avaliação
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Escolha o melhor horário e nós cuidamos do resto. Primeira avaliação gratuita!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-8 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <User size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome completo *"
                className={`${inputClass} pl-11`}
              />
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Telefone / WhatsApp *"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="E-mail (opcional)"
              className={`${inputClass} pl-11`}
            />
          </div>

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Selecione o serviço *</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                className={`${inputClass} pl-11`}
              />
            </div>
            <div className="relative">
              <Clock size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
              <select name="time" value={form.time} onChange={handleChange} className={`${inputClass} pl-11`}>
                <option value="">Horário *</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <MessageSquare size={18} className="absolute left-4 top-3.5 text-muted-foreground" />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Mensagem adicional (opcional)"
              rows={3}
              className={`${inputClass} pl-11 resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Confirmar Agendamento
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Ao agendar, você concorda com nossa política de privacidade.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default SchedulingSection;
