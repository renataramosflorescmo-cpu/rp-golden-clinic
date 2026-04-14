import { useState, useEffect } from "react";
import goldenFriendsHero from "../assets/golden-friends-hero.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield, ChevronRight, Check, Heart, Star, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const WHATSAPP_BASE = "https://wa.me/5511932110460";
const WHATSAPP_AGENDAR = `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá, Dra. Roberta! Fui indicada pelo programa Golden Friends e gostaria de agendar minha avaliação estética.")}`;

// ── QUIZZES POR FAIXA ETÁRIA ──────────────────────────────────────────────────

type Question = { id: string; question: string; options: string[]; multi: boolean };

const quizByAge: Record<string, Question[]> = {
  adolescente: [
    {
      id: "concerns",
      question: "O que mais te incomoda na sua pele hoje?",
      options: ["Acne e espinhas", "Manchas e cicatrizes de acne", "Oleosidade excessiva", "Poros dilatados", "Pele seca e sem viço", "Pelos indesejados"],
      multi: true,
    },
    {
      id: "region",
      question: "Em qual região você sente mais esses problemas?",
      options: ["Rosto inteiro", "Testa", "Bochechas e queixo", "Costas e ombros", "Pescoço", "Corpo em geral"],
      multi: false,
    },
    {
      id: "routine",
      question: "Como é sua rotina de cuidados com a pele?",
      options: ["Não tenho rotina", "Só lavo o rosto", "Uso hidratante", "Uso protetor solar", "Tenho rotina completa"],
      multi: false,
    },
    {
      id: "goal",
      question: "O que você mais deseja conquistar?",
      options: ["Pele sem acne", "Pele mais luminosa", "Reduzir manchas", "Controlar a oleosidade", "Autoestima elevada"],
      multi: false,
    },
    {
      id: "experience",
      question: "Você já fez algum tratamento de pele antes?",
      options: ["Nunca fiz", "Sim, com dermatologista", "Sim, com esteticista", "Uso produtos da farmácia"],
      multi: false,
    },
    {
      id: "priority",
      question: "O que é mais importante para você?",
      options: ["Resultado rápido", "Tratamento seguro", "Sem dor ou desconforto", "Custo acessível", "Natural e sem procedimentos invasivos"],
      multi: false,
    },
  ],
  mais20: [
    {
      id: "concerns",
      question: "Quais são seus principais incômodos estéticos?",
      options: ["Manchas e melasma", "Oleosidade ou pele seca", "Poros dilatados", "Primeiras linhas de expressão", "Textura irregular", "Pelos indesejados"],
      multi: true,
    },
    {
      id: "region",
      question: "Qual região você deseja tratar?",
      options: ["Rosto completo", "Testa e olhos", "Bochecha e mandíbula", "Pescoço e colo", "Corpo", "Várias regiões"],
      multi: false,
    },
    {
      id: "satisfaction",
      question: "Como você avalia sua pele atualmente?",
      options: ["Muito insatisfeita", "Insatisfeita", "Neutra", "Satisfeita, mas quero melhorar", "Satisfeita"],
      multi: false,
    },
    {
      id: "goal",
      question: "Qual é o seu principal objetivo?",
      options: ["Prevenir o envelhecimento precoce", "Uniformizar o tom da pele", "Melhorar a textura", "Definir contornos", "Aumentar minha autoestima"],
      multi: false,
    },
    {
      id: "experience",
      question: "Você já realizou algum procedimento estético antes?",
      options: ["Nunca realizei", "Sim, skincare com derma", "Sim, limpeza de pele", "Sim, peeling ou laser", "Sim, outros"],
      multi: false,
    },
    {
      id: "priority",
      question: "O que é mais importante para você na escolha de um tratamento?",
      options: ["Resultado natural", "Sem tempo de recuperação", "Segurança comprovada", "Durabilidade", "Custo-benefício"],
      multi: false,
    },
  ],
  mais30: [
    {
      id: "concerns",
      question: "Quais são seus principais incômodos estéticos?",
      options: ["Rugas e linhas de expressão", "Flacidez facial", "Manchas e melasma", "Olheiras e bigode chinês", "Gordura localizada", "Celulite"],
      multi: true,
    },
    {
      id: "region",
      question: "Qual região você deseja tratar?",
      options: ["Rosto completo", "Testa e olhos", "Bochecha e mandíbula", "Pescoço e colo", "Abdômen e flancos", "Coxas e glúteos"],
      multi: false,
    },
    {
      id: "satisfaction",
      question: "Como você avalia sua aparência atualmente?",
      options: ["Muito insatisfeita", "Insatisfeita", "Neutra", "Satisfeita, mas quero melhorar", "Satisfeita"],
      multi: false,
    },
    {
      id: "goal",
      question: "Qual é o seu principal objetivo?",
      options: ["Rejuvenescer e recuperar volume", "Suavizar rugas", "Melhorar a textura da pele", "Definir contornos faciais", "Eliminar gordura localizada", "Aumentar minha autoestima"],
      multi: false,
    },
    {
      id: "experience",
      question: "Você já realizou algum procedimento estético antes?",
      options: ["Nunca realizei", "Sim, toxina botulínica", "Sim, preenchimento", "Sim, bioestimuladores", "Sim, vários procedimentos"],
      multi: false,
    },
    {
      id: "priority",
      question: "O que é mais importante para você?",
      options: ["Resultado natural", "Rapidez na recuperação", "Durabilidade do resultado", "Segurança e procedência", "Custo-benefício"],
      multi: false,
    },
  ],
  mais50: [
    {
      id: "concerns",
      question: "Quais são seus principais incômodos estéticos?",
      options: ["Flacidez intensa no rosto", "Rugas profundas", "Perda de volume facial", "Manchas senis", "Flacidez corporal", "Ressecamento da pele"],
      multi: true,
    },
    {
      id: "region",
      question: "Qual região você deseja tratar com prioridade?",
      options: ["Rosto completo", "Pescoço e colo", "Mãos", "Contorno facial", "Corpo em geral", "Várias regiões"],
      multi: false,
    },
    {
      id: "satisfaction",
      question: "Como você se sente em relação à sua aparência hoje?",
      options: ["Muito insatisfeita", "Insatisfeita", "Neutra", "Satisfeita, mas quero melhorar", "Satisfeita"],
      multi: false,
    },
    {
      id: "goal",
      question: "O que você mais deseja conquistar?",
      options: ["Recuperar viço e luminosidade", "Suavizar rugas e sulcos", "Firmar e levantar o rosto", "Repor volume perdido", "Rejuvenescer com naturalidade"],
      multi: false,
    },
    {
      id: "health",
      question: "Você possui alguma condição de saúde relevante?",
      options: ["Não", "Hipertensão", "Diabetes", "Doenças autoimunes", "Uso de anticoagulantes", "Prefiro informar na consulta"],
      multi: false,
    },
    {
      id: "experience",
      question: "Você já realizou algum procedimento estético antes?",
      options: ["Nunca realizei", "Sim, toxina botulínica", "Sim, preenchimento", "Sim, bioestimuladores", "Sim, cirurgia estética", "Sim, vários procedimentos"],
      multi: false,
    },
    {
      id: "priority",
      question: "O que é mais importante para você na escolha de um tratamento?",
      options: ["Resultado natural e discreto", "Segurança máxima", "Sem tempo de recuperação", "Durabilidade", "Acompanhamento médico dedicado"],
      multi: false,
    },
  ],
};

const ageRanges = [
  { id: "adolescente", label: "Adolescente", sub: "13–17 anos", emoji: "🌱", quizSlug: "adolescente" },
  { id: "jovem", label: "+20 anos", sub: "18–29 anos", emoji: "✨", quizSlug: "jovem" },
  { id: "mais30", label: "+30 anos", sub: "30–49 anos", emoji: "💎", quizSlug: "mais30" },
  { id: "mais50", label: "50+", sub: "50 anos ou mais", emoji: "🌿", quizSlug: "mais50" },
];

type Step = "referral" | "thankyou" | "quiz" | "result";

const inputClass =
  "w-full bg-white/80 border border-[#c9a96e]/30 rounded-lg px-4 py-3.5 font-body text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 transition";

export default function GoldenFriends() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("referral");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [referralForm, setReferralForm] = useState({
    name: "", email: "", phone: "", friendName: "", friendContact: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const age = params.get("age");
    if (params.get("quiz") === "true") {
      if (age && quizByAge[age]) setSelectedAge(age);
      setStep("quiz");
    }
  }, []);

  const activeQuiz = quizByAge[selectedAge] ?? quizByAge["mais30"];

  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralForm({ ...referralForm, [e.target.name]: e.target.value });
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralForm.name || !referralForm.phone || !referralForm.friendName || !referralForm.friendContact || !selectedAge) {
      toast.error("Preencha todos os campos obrigatórios, incluindo a faixa etária.");
      return;
    }
    const range = ageRanges.find(a => a.id === selectedAge);
    const slug = range?.quizSlug ?? selectedAge;
    const quizLink = `${window.location.origin}/golden-friends/quiz/${slug}`;
    const msg = `Olá ${referralForm.friendName}! 💛 ${referralForm.name} te indicou para a RP Golden Clinic. Faça seu quiz estético personalizado (${range?.label ?? ""}) e receba um guia exclusivo: ${quizLink}`;

    // Salvar no Supabase
    await supabase.from("golden_referrals").insert({
      referrer_name: referralForm.name,
      referrer_email: referralForm.email,
      referrer_phone: referralForm.phone,
      friend_name: referralForm.friendName,
      friend_contact: referralForm.friendContact,
      friend_age_range: range?.label ?? selectedAge,
      quiz_slug: slug,
      status: "quiz_sent",
    });

    const digits = referralForm.friendContact.replace(/\D/g, "");
    if (digits.length >= 8) {
      window.open(`https://wa.me/55${digits}?text=${encodeURIComponent(msg)}`, "_blank");
    }
    toast.success("Indicação enviada com sucesso!");
    setStep("thankyou");
  };

  const handleAnswer = (questionId: string, option: string, multi: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (multi) {
        return {
          ...prev,
          [questionId]: current.includes(option)
            ? current.filter((o) => o !== option)
            : [...current, option],
        };
      }
      return { ...prev, [questionId]: [option] };
    });
  };

  const canAdvance = () => {
    const q = activeQuiz[quizStep];
    return (answers[q.id]?.length ?? 0) > 0;
  };

  const handleNextQuiz = () => {
    if (quizStep < activeQuiz.length - 1) {
      setQuizStep((s) => s + 1);
    } else {
      setStep("result");
    }
  };

  const quizTitle: Record<string, string> = {
    adolescente: "Quiz para Adolescentes",
    mais20: "Quiz +20 Anos",
    mais30: "Quiz +30 Anos",
    mais50: "Quiz 50+",
  };

  return (
    <div className="min-h-screen bg-[#faf7f4]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f4]/90 backdrop-blur-md border-b border-[#c9a96e]/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-[0.25em] uppercase text-foreground">
            Golden Clinic
          </Link>
          <Link to="/" className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-[#c9a96e] transition-colors">
            ← Voltar ao site
          </Link>
        </div>
      </nav>

      <div className="pt-20">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: FORMULÁRIO DE INDICAÇÃO ── */}
          {step === "referral" && (
            <motion.div key="referral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Hero */}
              <section className="relative bg-foreground text-primary-foreground pt-16 pb-10 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNjOWE5NmUiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0tNiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                <div className="relative max-w-3xl mx-auto text-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 border border-[#c9a96e]/40 text-[#c9a96e] text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-8">
                      <Heart size={12} fill="currentColor" /> Golden Friends
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight mb-6">
                      Indique um amigo e ajude<br />
                      <span className="text-[#c9a96e]">a melhorar sua autoestima</span>
                    </h1>
                    <p className="font-body text-lg font-light text-primary-foreground/70 max-w-xl mx-auto mb-10">
                      Leva menos de 1 minuto e você ainda pode receber benefícios exclusivos
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-body font-light text-primary-foreground/60">
                      {["100% gratuito", "Sem compromisso", "Resultado personalizado"].map((t) => (
                        <span key={t} className="flex items-center gap-2">
                          <Check size={14} className="text-[#c9a96e]" /> {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Hero Image */}
              <section className="bg-foreground px-6 pb-10">
                <div className="max-w-4xl mx-auto">
                  <img
                    src={goldenFriendsHero}
                    alt="Pacientes da RP Golden Clinic"
                    className="w-full rounded-t-2xl object-cover shadow-2xl"
                  />
                </div>
              </section>

              {/* Formulário */}
              <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-[#c9a96e]/10"
                  >
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Fazer minha indicação</h2>
                    <p className="font-body text-sm text-foreground/50 mb-8">Preencha seus dados e os do seu amigo</p>

                    <form onSubmit={handleReferralSubmit} className="space-y-5">
                      {/* Seus dados */}
                      <div>
                        <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Seus dados</p>
                        <div className="space-y-4">
                          <div className="relative">
                            <User size={15} className="absolute left-4 top-4 text-foreground/30" />
                            <input name="name" value={referralForm.name} onChange={handleReferralChange}
                              placeholder="Seu nome *" className={`${inputClass} pl-11`} />
                          </div>
                          <div className="relative">
                            <Mail size={15} className="absolute left-4 top-4 text-foreground/30" />
                            <input name="email" type="email" value={referralForm.email} onChange={handleReferralChange}
                              placeholder="Seu e-mail (opcional)" className={`${inputClass} pl-11`} />
                          </div>
                          <div className="relative">
                            <Phone size={15} className="absolute left-4 top-4 text-foreground/30" />
                            <input name="phone" value={referralForm.phone} onChange={handleReferralChange}
                              placeholder="Seu WhatsApp *" className={`${inputClass} pl-11`} />
                          </div>
                        </div>
                      </div>

                      {/* Dados do amigo */}
                      <div className="border-t border-[#c9a96e]/10 pt-5">
                        <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Dados do amigo</p>
                        <div className="space-y-4">
                          <div className="relative">
                            <User size={15} className="absolute left-4 top-4 text-foreground/30" />
                            <input name="friendName" value={referralForm.friendName} onChange={handleReferralChange}
                              placeholder="Nome do amigo *" className={`${inputClass} pl-11`} />
                          </div>
                          <div className="relative">
                            <Phone size={15} className="absolute left-4 top-4 text-foreground/30" />
                            <input name="friendContact" value={referralForm.friendContact} onChange={handleReferralChange}
                              placeholder="WhatsApp ou e-mail do amigo *" className={`${inputClass} pl-11`} />
                          </div>

                          {/* Faixa etária do amigo */}
                          <div>
                            <p className="font-body text-xs text-foreground/50 mb-3">
                              Faixa etária do amigo <span className="text-red-400">*</span>
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {ageRanges.map((range) => (
                                <button
                                  type="button"
                                  key={range.id}
                                  onClick={() => setSelectedAge(range.id)}
                                  className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-all ${
                                    selectedAge === range.id
                                      ? "bg-[#c9a96e]/10 border-[#c9a96e] text-foreground"
                                      : "bg-[#faf7f4] border-[#c9a96e]/20 text-foreground/70 hover:border-[#c9a96e]/50"
                                  }`}
                                >
                                  <span className="text-xl">{range.emoji}</span>
                                  <div>
                                    <p className="font-body text-sm font-medium leading-none">{range.label}</p>
                                    <p className="font-body text-xs text-foreground/40 mt-0.5">{range.sub}</p>
                                  </div>
                                  {selectedAge === range.id && (
                                    <div className="ml-auto w-4 h-4 rounded-full bg-[#c9a96e] flex items-center justify-center">
                                      <Check size={10} className="text-white" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button type="submit"
                        className="w-full bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white py-4 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2">
                        Indicar amigo <ArrowRight size={16} />
                      </button>

                      <div className="flex items-center justify-center gap-2 text-xs font-body text-foreground/40">
                        <Shield size={12} /> Seus dados estão seguros. Não enviamos spam.
                      </div>
                    </form>
                  </motion.div>

                </div>
              </section>

              {/* Como funciona */}
              <section className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-[#c9a96e] text-center mb-3">Como funciona</p>
                  <h2 className="font-display text-3xl font-semibold text-center text-foreground mb-12">Simples em 3 passos</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { num: "01", title: "Você indica", desc: "Preencha o formulário com seus dados, os do seu amigo e a faixa etária dele." },
                      { num: "02", title: "Amigo faz o quiz", desc: "Seu amigo recebe um link e responde um quiz estético personalizado para a idade dele." },
                      { num: "03", title: "Recebe o guia", desc: "Ele recebe um guia exclusivo e é convidado para uma avaliação com a Dra. Roberta." },
                    ].map((item) => (
                      <div key={item.num} className="text-center">
                        <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 text-[#c9a96e] font-display text-lg font-semibold flex items-center justify-center mx-auto mb-4">
                          {item.num}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="font-body text-sm font-light text-foreground/60 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <footer className="bg-foreground py-8 px-6 text-center">
                <p className="font-body text-xs text-primary-foreground/30 tracking-wider">
                  © 2026 RP Golden Clinic. Todos os direitos reservados.
                </p>
              </footer>
            </motion.div>
          )}

          {/* ── STEP THANKYOU ── */}
          {step === "thankyou" && (
            <motion.div key="thankyou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
              <div className="max-w-2xl w-full mx-auto text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-8">
                  <Heart size={36} className="text-[#c9a96e]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-4">
                    Obrigada pela sua indicacao!
                  </h1>
                  <p className="font-body text-base font-light text-foreground/60 max-w-lg mx-auto mb-6 leading-relaxed">
                    Enviamos o link do quiz para <strong className="text-foreground">{referralForm.friendName}</strong> via WhatsApp.
                  </p>

                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#c9a96e]/10 mb-8 text-left">
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-4">Proximo passo</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] font-display text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                        <p className="font-body text-sm text-foreground/70">Seu amigo <strong>{referralForm.friendName}</strong> recebera o link do quiz pelo WhatsApp</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] font-display text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                        <p className="font-body text-sm text-foreground/70">Ele respondera o questionario personalizado para a faixa etaria dele</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] font-display text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                        <p className="font-body text-sm text-foreground/70">Ao final do quiz, ele recebera um <strong>guia exclusivo</strong> com dicas e tratamentos personalizados</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => { setStep("referral"); setReferralForm({ name:"", email:"", phone:"", friendName:"", friendContact:"" }); setSelectedAge(""); }}
                      className="bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-8 py-4 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Indicar outro amigo <ArrowRight size={16} />
                    </button>
                    <Link to="/" className="border border-[#c9a96e]/30 text-foreground/60 px-8 py-4 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:border-[#c9a96e] transition-colors text-center">
                      Voltar ao site
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: QUIZ ── */}
          {step === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex flex-col">
              {/* Hero */}
              <section className="bg-foreground text-primary-foreground py-16 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="inline-flex items-center gap-2 border border-[#c9a96e]/40 text-[#c9a96e] text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-6">
                    <Star size={12} fill="currentColor" /> {quizTitle[selectedAge] ?? "Quiz Estético"}
                  </div>
                  <h1 className="font-display text-3xl md:text-5xl font-semibold mb-4">
                    Descubra como melhorar<br />
                    <span className="text-[#c9a96e]">sua estética em poucos passos</span>
                  </h1>
                  <p className="font-body text-base font-light text-primary-foreground/70 max-w-lg mx-auto">
                    Responda algumas perguntas rápidas e receba um plano inicial personalizado
                  </p>
                </motion.div>
              </section>

              {/* Perguntas */}
              <section className="flex-1 py-16 px-6">
                <div className="max-w-2xl mx-auto">
                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex-1 bg-[#c9a96e]/15 rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-[#b8935a] to-[#c9a96e] h-1.5 rounded-full"
                        animate={{ width: `${((quizStep + 1) / activeQuiz.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className="font-body text-xs text-foreground/40 whitespace-nowrap">
                      {quizStep + 1} / {activeQuiz.length}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quizStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-[#c9a96e]/10"
                    >
                      <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
                        {activeQuiz[quizStep].question}
                      </h2>
                      {activeQuiz[quizStep].multi
                        ? <p className="font-body text-xs text-foreground/40 mb-6">Pode selecionar mais de uma opção</p>
                        : <div className="mb-6" />
                      }

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeQuiz[quizStep].options.map((option) => {
                          const selected = answers[activeQuiz[quizStep].id]?.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => handleAnswer(activeQuiz[quizStep].id, option, activeQuiz[quizStep].multi)}
                              className={`text-left px-4 py-3.5 rounded-lg border text-sm font-body font-light transition-all flex items-center gap-3 ${
                                selected
                                  ? "bg-[#c9a96e]/10 border-[#c9a96e] text-foreground"
                                  : "bg-[#faf7f4] border-[#c9a96e]/20 text-foreground/70 hover:border-[#c9a96e]/50"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected ? "border-[#c9a96e] bg-[#c9a96e]" : "border-foreground/20"}`}>
                                {selected && <Check size={10} className="text-white" />}
                              </div>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 mt-8">
                        {quizStep > 0 && (
                          <button
                            onClick={() => setQuizStep((s) => s - 1)}
                            className="flex-1 py-3.5 rounded-lg border border-[#c9a96e]/30 text-foreground/60 text-xs tracking-[0.15em] uppercase font-body hover:border-[#c9a96e] transition-colors"
                          >
                            Voltar
                          </button>
                        )}
                        <button
                          onClick={handleNextQuiz}
                          disabled={!canAdvance()}
                          className="flex-1 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white py-3.5 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {quizStep === activeQuiz.length - 1 ? "Ver meu resultado" : "Continuar"}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          )}

          {/* ── STEP 3: RESULTADO ── */}
          {step === "result" && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
              <div className="max-w-2xl w-full mx-auto text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-8">
                  <Check size={36} className="text-[#c9a96e]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-4">
                    Seu guia foi enviado<br />para seu e-mail 📩
                  </h1>
                  <p className="font-body text-base font-light text-foreground/60 max-w-lg mx-auto mb-12 leading-relaxed">
                    Em breve você receberá um guia personalizado com dicas práticas e tratamentos indicados para o seu perfil estético.
                  </p>

                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#c9a96e]/10 mb-8">
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Próximo passo</p>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                      Agende sua avaliação presencial
                    </h2>
                    <p className="font-body text-sm font-light text-foreground/60 mb-6 leading-relaxed">
                      Conheça a Dra. Roberta pessoalmente e receba um plano de tratamento exclusivo para você, com a atenção que você merece.
                    </p>
                    <a href={WHATSAPP_AGENDAR} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-8 py-4 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
                      Agendar minha avaliação <ArrowRight size={16} />
                    </a>
                  </div>

                  <Link to="/" className="font-body text-sm text-foreground/40 hover:text-[#c9a96e] transition-colors">
                    Voltar ao site
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
