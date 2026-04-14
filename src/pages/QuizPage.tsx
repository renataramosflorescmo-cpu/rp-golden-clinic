import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Star, ArrowRight, Heart, Sparkles, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { sendGuideEmail, quizPdfMap } from "@/lib/emailService";

const WHATSAPP_AGENDAR = `https://wa.me/5511932110460?text=${encodeURIComponent("Olá, Dra. Roberta! Completei o quiz estético pelo programa Golden Friends e gostaria de agendar minha avaliação.")}`;

// ── TIPOS ─────────────────────────────────────────────────────────────────────

type QuizOption = { label: string; tag?: string };
type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  multi?: boolean;
};
type QuizConfig = {
  slug: string;
  emoji: string;
  badge: string;
  headline: string;
  subheadline: string;
  accentColor: string;
  questions: QuizQuestion[];
  result: {
    title: string;
    body: string;
    pdfItems: string[];
    cta: string;
  };
};

// ── CONFIGURAÇÕES DOS 4 QUIZZES ───────────────────────────────────────────────

const quizzes: Record<string, QuizConfig> = {
  adolescente: {
    slug: "adolescente",
    emoji: "🌱",
    badge: "Quiz Adolescentes · 13–17 anos",
    headline: "Sua pele está pedindo ajuda?\nDescubra o que ela precisa 👇",
    subheadline: "Responda 5 perguntas rápidas e receba um guia personalizado para a sua pele",
    accentColor: "#a8c5a0",
    questions: [
      {
        id: "skin_type",
        question: "Como você descreveria sua pele hoje?",
        options: [
          { label: "Muito oleosa", tag: "oily" },
          { label: "Oleosa com espinhas", tag: "acne" },
          { label: "Mista", tag: "mixed" },
          { label: "Normal", tag: "normal" },
        ],
      },
      {
        id: "main_issue",
        question: "Você costuma ter:",
        options: [
          { label: "Espinhas inflamadas" },
          { label: "Cravos" },
          { label: "Manchas de acne" },
          { label: "Pouco ou nenhum problema" },
        ],
      },
      {
        id: "routine",
        question: "Sua rotina de cuidados é:",
        options: [
          { label: "Não tenho rotina" },
          { label: "Lavo o rosto às vezes" },
          { label: "Uso alguns produtos" },
          { label: "Tenho rotina completa" },
        ],
      },
      {
        id: "bother",
        question: "O que mais te incomoda?",
        options: [
          { label: "Espinhas" },
          { label: "Oleosidade" },
          { label: "Marcas na pele" },
          { label: "Aparência geral" },
        ],
      },
      {
        id: "professional",
        question: "Você já fez tratamento com profissional?",
        options: [
          { label: "Nunca" },
          { label: "Já tentei, mas não continuei" },
          { label: "Sim, estou fazendo" },
        ],
      },
    ],
    result: {
      title: "Sua pele apresenta tendência à acne e precisa de cuidados específicos",
      body: "Com a orientação certa e uma rotina personalizada, você pode transformar sua pele e sua autoestima ainda na adolescência.",
      pdfItems: [
        "Rotina básica de skincare para peles jovens",
        "Erros comuns que pioram a acne",
        "Dicas de limpeza, hidratação e proteção solar",
      ],
      cta: "Agende uma avaliação com a Dra. Roberta e comece o tratamento certo desde cedo",
    },
  },

  jovem: {
    slug: "jovem",
    emoji: "✨",
    badge: "Quiz Jovens · 18–29 anos",
    headline: "Descubra o que está impedindo\nsua pele de ficar perfeita",
    subheadline: "6 perguntas rápidas para entender o que sua pele realmente precisa",
    accentColor: "#c9a96e",
    questions: [
      {
        id: "goal",
        question: "Qual seu principal objetivo com sua pele?",
        options: [
          { label: "Acabar com a acne" },
          { label: "Melhorar a textura" },
          { label: "Clarear manchas" },
          { label: "Prevenir o envelhecimento" },
        ],
      },
      {
        id: "skin_type",
        question: "Como é sua pele?",
        options: [
          { label: "Oleosa" },
          { label: "Mista" },
          { label: "Seca" },
          { label: "Sensível" },
        ],
      },
      {
        id: "spots",
        question: "Você percebe manchas ou marcas?",
        options: [
          { label: "Sim, muitas" },
          { label: "Algumas" },
          { label: "Poucas" },
          { label: "Nenhuma" },
        ],
      },
      {
        id: "sunscreen",
        question: "Com que frequência você usa protetor solar?",
        options: [
          { label: "Nunca" },
          { label: "Às vezes" },
          { label: "Quase sempre" },
          { label: "Todos os dias" },
        ],
      },
      {
        id: "routine",
        question: "Sua rotina de skincare é:",
        options: [
          { label: "Inexistente" },
          { label: "Básica" },
          { label: "Intermediária" },
          { label: "Avançada" },
        ],
      },
      {
        id: "procedures",
        question: "Você já fez procedimentos estéticos?",
        options: [
          { label: "Nunca" },
          { label: "Apenas limpeza de pele" },
          { label: "Alguns tratamentos" },
          { label: "Regularmente" },
        ],
      },
    ],
    result: {
      title: "Sua pele tem potencial para evoluir muito com os cuidados certos",
      body: "Com procedimentos direcionados e uma rotina consistente, você pode alcançar a pele que sempre quis.",
      pdfItems: [
        "Rotina ideal para sua faixa etária",
        "Procedimentos indicados: limpeza de pele, peelings leves",
        "Estratégias de prevenção precoce do envelhecimento",
      ],
      cta: "Agende sua avaliação e monte um plano personalizado com a Dra. Roberta",
    },
  },

  mais30: {
    slug: "mais30",
    emoji: "💎",
    badge: "Quiz Pele 30+ anos",
    headline: "Sua pele já começou a mudar.\nVocê sabe como cuidar dela agora?",
    subheadline: "Responda 6 perguntas e receba um guia com as melhores estratégias para sua pele nessa fase",
    accentColor: "#c9a96e",
    questions: [
      {
        id: "bother",
        question: "O que mais te incomoda hoje?",
        options: [
          { label: "Linhas finas" },
          { label: "Manchas" },
          { label: "Flacidez leve" },
          { label: "Falta de viço" },
        ],
      },
      {
        id: "aging_signs",
        question: "Você percebe sinais de envelhecimento?",
        options: [
          { label: "Sim, claramente" },
          { label: "Começando agora" },
          { label: "Muito pouco" },
          { label: "Não" },
        ],
      },
      {
        id: "skin_state",
        question: "Sua pele está:",
        options: [
          { label: "Mais opaca" },
          { label: "Com textura irregular" },
          { label: "Perdendo firmeza" },
          { label: "Normal" },
        ],
      },
      {
        id: "sunscreen",
        question: "Uso de protetor solar:",
        options: [
          { label: "Nunca" },
          { label: "Às vezes" },
          { label: "Frequente" },
          { label: "Diário" },
        ],
      },
      {
        id: "procedures",
        question: "Você já realizou tratamentos estéticos?",
        options: [
          { label: "Nunca" },
          { label: "Alguns básicos" },
          { label: "Procedimentos mais avançados" },
          { label: "Faço regularmente" },
        ],
      },
      {
        id: "concern_level",
        question: "Seu nível de preocupação com envelhecimento é:",
        options: [
          { label: "Baixo" },
          { label: "Médio" },
          { label: "Alto" },
          { label: "Muito alto" },
        ],
      },
    ],
    result: {
      title: "Sua pele está entrando em uma fase que exige estímulo de colágeno e cuidados preventivos",
      body: "Com as estratégias certas agora, você pode desacelerar os sinais do envelhecimento e manter a pele firme e luminosa por muito mais tempo.",
      pdfItems: [
        "Estratégias anti-idade personalizadas para pele 30+",
        "Ativos recomendados: retinol, vitamina C, ácido hialurônico",
        "Procedimentos indicados: bioestimuladores, lasers leves, peelings",
      ],
      cta: "Agende sua avaliação e comece a prevenir sinais mais profundos",
    },
  },

  mais50: {
    slug: "mais50",
    emoji: "🌿",
    badge: "Quiz Pele 50+ anos",
    headline: "Recupere a firmeza e\na vitalidade da sua pele",
    subheadline: "6 perguntas para descobrir o plano de rejuvenescimento ideal para você",
    accentColor: "#b8935a",
    questions: [
      {
        id: "bother",
        question: "O que mais te incomoda hoje?",
        options: [
          { label: "Rugas profundas" },
          { label: "Flacidez" },
          { label: "Manchas" },
          { label: "Perda de volume" },
        ],
      },
      {
        id: "skin_state",
        question: "Você sente que sua pele está:",
        options: [
          { label: "Mais fina" },
          { label: "Flácida" },
          { label: "Ressecada" },
          { label: "Sem brilho" },
        ],
      },
      {
        id: "procedures",
        question: "Já realizou procedimentos estéticos?",
        options: [
          { label: "Nunca" },
          { label: "Poucos" },
          { label: "Alguns" },
          { label: "Frequentemente" },
        ],
      },
      {
        id: "goal",
        question: "Seu objetivo principal é:",
        options: [
          { label: "Rejuvenescer" },
          { label: "Melhorar a firmeza" },
          { label: "Uniformizar a pele" },
          { label: "Melhorar aparência geral" },
        ],
      },
      {
        id: "result_type",
        question: "Você busca resultados:",
        options: [
          { label: "Naturais e sutis" },
          { label: "Moderados" },
          { label: "Mais visíveis" },
          { label: "Ainda não sei" },
        ],
      },
      {
        id: "routine",
        question: "Como está sua rotina de cuidados?",
        options: [
          { label: "Não tenho" },
          { label: "Básica" },
          { label: "Regular" },
          { label: "Completa" },
        ],
      },
    ],
    result: {
      title: "Sua pele pode recuperar firmeza e vitalidade com tratamentos personalizados",
      body: "Com os procedimentos adequados para essa fase, é possível rejuvenescer com naturalidade e recuperar a confiança e beleza que você merece.",
      pdfItems: [
        "Estratégias de rejuvenescimento para pele 50+",
        "Cuidados essenciais: hidratação profunda, proteção e ativos",
        "Possíveis procedimentos: preenchimento, bioestimuladores, Profhilo",
      ],
      cta: "Agende sua avaliação com a Dra. Roberta e descubra o melhor plano para você",
    },
  },
};

// ── MENSAGENS DINÂMICAS ───────────────────────────────────────────────────────

const progressMessages: Record<number, string> = {
  0: "Vamos começar!",
  1: "Ótimo começo! Continue...",
  2: "Baseado nas suas respostas, seu perfil está se formando...",
  3: "Falta pouco! Estamos quase lá...",
  4: "Última etapa antes do seu resultado personalizado",
  5: "Quase pronto! Seu guia está sendo preparado...",
};

// ── COMPONENTE ────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const { type } = useParams<{ type: string }>();
  const config = quizzes[type ?? ""] ?? quizzes["mais30"];

  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"quiz" | "email" | "done">("quiz");
  const [emailForm, setEmailForm] = useState({ name: "", email: "" });
  const [sending, setSending] = useState(false);

  const total = config.questions.length;
  const progress = ((quizStep + 1) / total) * 100;
  const remaining = total - quizStep - 1;

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const canAdvance = () => !!answers[config.questions[quizStep].id];

  const handleNext = () => {
    if (quizStep < total - 1) setQuizStep((s) => s + 1);
    else setStage("email");
  };

  const pdfInfo = quizPdfMap[config.slug] ?? quizPdfMap["adolescente"];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email) { toast.error("Informe seu e-mail."); return; }
    setSending(true);
    const ok = await sendGuideEmail({
      to_email: emailForm.email,
      to_name: emailForm.name || "Olá",
      quiz_type: config.badge,
      guide_title: pdfInfo.title,
      guide_url: pdfInfo.url,
      result_title: config.result.title,
      result_body: config.result.body,
      cta: config.result.cta,
    });
    setSending(false);
    if (ok) { toast.success("Guia enviado para seu e-mail! 📩"); setStage("done"); }
    else { toast.error("Erro ao enviar. Tente novamente."); }
  };

  const accent = config.accentColor;

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f4]/90 backdrop-blur-md border-b border-[#c9a96e]/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-[0.25em] uppercase text-foreground">
          Golden Clinic
        </Link>
        <Link to="/golden-friends" className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-[#c9a96e] transition-colors">
          ← Golden Friends
        </Link>
      </div>
    </nav>
  );

  // ── TELA: EMAIL ──
  if (stage === "email") {
    return (
      <div className="min-h-screen bg-[#faf7f4]">
        <Navbar />
        <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <div className="max-w-lg w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border text-center"
              style={{ borderColor: `${accent}20` }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${accent}15` }}>
                <Mail size={28} style={{ color: accent }} />
              </div>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-4 border"
                style={{ borderColor: `${accent}40`, color: accent }}>
                <Sparkles size={11} /> Quase lá!
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-snug">
                Para onde enviamos seu guia personalizado?
              </h2>
              <p className="font-body text-sm font-light text-foreground/55 mb-8 leading-relaxed">
                Informe seu nome e e-mail para receber o <strong>{pdfInfo.title}</strong> gratuitamente.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                  className="w-full bg-[#faf7f4] border border-[#c9a96e]/30 rounded-lg px-4 py-3.5 font-body text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 transition"
                  style={{ ["--tw-ring-color" as string]: `${accent}40` }}
                />
                <input
                  type="email"
                  placeholder="Seu e-mail *"
                  required
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="w-full bg-[#faf7f4] border border-[#c9a96e]/30 rounded-lg px-4 py-3.5 font-body text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 transition"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full text-white py-4 rounded-xl text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}
                >
                  {sending ? "Enviando..." : "Enviar meu guia gratuitamente"}
                  {!sending && <Mail size={15} />}
                </button>
              </form>

              {/* Download direto como alternativa */}
              <div className="mt-6 pt-6 border-t border-foreground/8">
                <a
                  href={pdfInfo.url}
                  download
                  className="inline-flex items-center gap-2 font-body text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  <Download size={13} /> Ou faça o download direto do PDF
                </a>
              </div>

              <p className="font-body text-[11px] text-foreground/30 mt-4">
                Seus dados estão seguros. Não enviamos spam.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── TELA: RESULTADO ──
  if (stage === "done") {
    return (
      <div className="min-h-screen bg-[#faf7f4]">
        <Navbar />
        <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <div className="max-w-2xl w-full mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${accent}20` }}>
                <Check size={36} style={{ color: accent }} />
              </div>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6 border"
                style={{ borderColor: `${accent}50`, color: accent }}>
                <Sparkles size={12} /> Resultado personalizado
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                {config.result.title}
              </h1>
              <p className="font-body text-base font-light text-foreground/60 leading-relaxed max-w-lg mx-auto">
                {config.result.body}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Guia PDF */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border mb-6" style={{ borderColor: `${accent}20` }}>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${accent}15` }}>
                      📩
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: accent }}>
                        Seu guia foi enviado para seu e-mail
                      </p>
                      <p className="font-body text-xs text-foreground/40">Guia estético personalizado</p>
                    </div>
                  </div>
                  <a
                    href={pdfInfo.url}
                    download
                    className="flex items-center gap-1.5 text-xs font-body px-3 py-2 rounded-lg border transition-colors hover:opacity-80"
                    style={{ borderColor: `${accent}30`, color: accent }}
                  >
                    <Download size={13} /> Download
                  </a>
                </div>
                <ul className="space-y-3">
                  {config.result.pdfItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body text-sm font-light text-foreground/70">
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: `${accent}20` }}>
                        <Check size={11} style={{ color: accent }} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Urgência */}
              <div className="bg-foreground/5 rounded-xl p-5 mb-6 border border-foreground/10 text-center">
                <p className="font-body text-sm font-light text-foreground/70 italic">
                  "Quanto antes você começar, melhores serão os resultados."
                </p>
              </div>

              {/* CTA */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{ borderColor: `${accent}20` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={16} style={{ color: accent }} fill={accent} />
                  <p className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>Próximo passo</p>
                </div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3 leading-snug">
                  Agende sua avaliação presencial
                </h2>
                <p className="font-body text-sm font-light text-foreground/60 mb-6 leading-relaxed">
                  {config.result.cta}
                </p>
                <a
                  href={WHATSAPP_AGENDAR}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  Agendar minha avaliação <ArrowRight size={16} />
                </a>
              </div>

              <div className="text-center mt-8">
                <Link to="/" className="font-body text-sm text-foreground/40 hover:text-[#c9a96e] transition-colors">
                  Voltar ao site
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f4]">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="bg-foreground text-primary-foreground py-14 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 border text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-6"
              style={{ borderColor: `${accent}50`, color: accent }}>
              <Star size={12} fill={accent} /> {config.badge}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold mb-4 whitespace-pre-line leading-tight">
              {config.headline}
            </h1>
            <p className="font-body text-sm font-light text-primary-foreground/60 max-w-lg mx-auto">
              {config.subheadline}
            </p>
          </motion.div>
        </section>

        {/* Quiz */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">

            {/* Progress bar + mensagem dinâmica */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-foreground/50">
                  {progressMessages[quizStep] ?? "Baseado nas suas respostas, seu perfil está sendo criado..."}
                </span>
                <span className="font-body text-xs font-medium" style={{ color: accent }}>
                  {remaining === 0 ? "Última pergunta!" : `Falta${remaining > 1 ? "m" : ""} ${remaining} passo${remaining > 1 ? "s" : ""}...`}
                </span>
              </div>
              <div className="bg-foreground/10 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}aa, ${accent})` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                {config.questions.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: i <= quizStep ? accent : "#e5e7eb" }} />
                ))}
              </div>
            </div>

            {/* Card da pergunta */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quizStep}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border"
                style={{ borderColor: `${accent}15` }}
              >
                {/* Número da pergunta */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: accent }}>
                    {quizStep + 1}
                  </div>
                  <span className="font-body text-xs text-foreground/40 tracking-wide">de {total}</span>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8 leading-snug">
                  {config.questions[quizStep].question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {config.questions[quizStep].options.map((option) => {
                    const selected = answers[config.questions[quizStep].id] === option.label;
                    return (
                      <button
                        key={option.label}
                        onClick={() => handleSelect(config.questions[quizStep].id, option.label)}
                        className="text-left px-5 py-4 rounded-xl border text-sm font-body font-light transition-all flex items-center gap-3"
                        style={selected ? {
                          backgroundColor: `${accent}12`,
                          borderColor: accent,
                          color: "#1a1a1a",
                        } : {
                          backgroundColor: "#faf7f4",
                          borderColor: `${accent}25`,
                          color: "#6b7280",
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                          style={selected ? { borderColor: accent, backgroundColor: accent } : { borderColor: "#d1d5db" }}>
                          {selected && <Check size={11} className="text-white" />}
                        </div>
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-8">
                  {quizStep > 0 && (
                    <button
                      onClick={() => setQuizStep((s) => s - 1)}
                      className="flex-1 py-3.5 rounded-xl border border-foreground/15 text-foreground/50 text-xs tracking-[0.15em] uppercase font-body hover:border-foreground/30 transition-colors"
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!canAdvance()}
                    className="flex-1 text-white py-3.5 rounded-xl text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}
                  >
                    {quizStep === total - 1 ? "Ver meu resultado" : "Continuar"}
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Urgência */}
                {quizStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-body text-xs text-center text-foreground/35 mt-5 italic"
                  >
                    "Quanto antes você começar, melhores serão os resultados"
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Personalização dinâmica */}
            {quizStep >= 1 && Object.keys(answers).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 px-5 py-4 rounded-xl bg-white border text-center"
                style={{ borderColor: `${accent}20` }}
              >
                <p className="font-body text-xs text-foreground/50">
                  <span style={{ color: accent }} className="font-medium">Baseado nas suas respostas,</span>{" "}
                  estamos preparando um guia exclusivo para o seu perfil estético
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
