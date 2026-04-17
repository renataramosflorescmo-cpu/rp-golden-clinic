import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Film, Copy, ArrowLeft, Video, Clapperboard, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { claudeMessage, geminiVeo } from "@/lib/aiProxy";

const VEO_GUIDE = `Diretrizes de Video RP Golden Clinic:

PALETA: Dourado #C99C63, Bege #E5C578, Branco #FFFFFF, Cinza #3D3D3D
TOM: Autoridade Acolhedora, Elegancia Acessivel, Beleza Natural

AVATARES:
1. Dra. Roberta (Autoridade): Medica dermatologista, 40 anos, jaleco branco, cabelo castanho, maquiagem natural, acessorios minimalistas
2. UGC Cliente (Lifestyle): Mulher 25-35 anos, roupas casuais chiques bege/branco, pele radiante, estilo influenciador autentico
3. UGC Procedimentos (Educativo): Esteticista 28-38 anos, uniforme branco com detalhes dourados, cabelo preso, expressao didatica

CTAs:
- Agendamento: "Clique no link da bio e agende sua avaliacao premium!"
- Engajamento: "Comenta aqui embaixo! Manda DM pra gente!"
- Lifestyle: "Vem conhecer a RP Golden Clinic. Sua melhor versao esta aqui."
- Educacao: "Siga para mais dicas e procedimentos explicados."

ESTRUTURA: Hook (0-3s) → Conteudo de Valor → CTA claro
FORMATO: 9:16 vertical, 1080x1920, ate 90s para Reels, ate 60s para Shorts`;

interface Article { id: string; title: string; excerpt: string; content: string; category: string; }

export default function AdminVideoAgent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState<"templates" | "roteiro" | "gerar">("templates");
  const [expandedSerie, setExpandedSerie] = useState<string | null>("serie1");

  // Roteiro state
  const [selectedArticle, setSelectedArticle] = useState("");
  const [avatar, setAvatar] = useState("dra_roberta");
  const [platform, setPlatform] = useState("reels");
  const [ctaType, setCtaType] = useState("agendamento");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [roteiro, setRoteiro] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Video generation state
  const [videoPrompt, setVideoPrompt] = useState("");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("blog_articles").select("id, title, excerpt, content, category").eq("status", "published").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setArticles(data as Article[]);
    });
    const saved = localStorage.getItem("rp_video_history");
    if (saved) try { setHistory(JSON.parse(saved)); } catch {}
  }, []);

  const avatars: Record<string, { label: string; desc: string }> = {
    dra_roberta: { label: "Dra. Roberta", desc: "Autoridade medica" },
    ugc_cliente: { label: "UGC Cliente", desc: "Lifestyle/Testemunho" },
    ugc_procedimentos: { label: "UGC Procedimentos", desc: "Educativo" },
  };
  const platforms: Record<string, string> = { reels: "Instagram Reels (90s)", tiktok: "TikTok (60s)", shorts: "YouTube Shorts (60s)", linkedin: "LinkedIn (3min)" };
  const ctas: Record<string, string> = { agendamento: "Agendamento", engajamento: "Engajamento", lifestyle: "Lifestyle", educacao: "Educacao" };

  async function generateRoteiro() {
    setGenerating(true); setRoteiro(null);
    try {
      const article = articles.find(a => a.id === selectedArticle);
      const articleCtx = article ? `\nArtigo base: ${article.title}\nResumo: ${article.excerpt}\nConteudo: ${article.content?.substring(0, 1500)}` : "";

      const prompt = `${VEO_GUIDE}
${articleCtx}
${customPrompt ? `Instrucao adicional: ${customPrompt}` : ""}

Gere um ROTEIRO COMPLETO de video para ${platforms[platform]} usando o avatar "${avatars[avatar].label}" (${avatars[avatar].desc}) com CTA tipo "${ctas[ctaType]}".

Retorne SOMENTE JSON valido:
{
  "titulo": "Titulo do video",
  "avatar": "${avatar}",
  "plataforma": "${platform}",
  "duracao": "45 segundos",
  "hook": "Frase de gancho para os primeiros 3 segundos",
  "cenas": [
    {"tempo": "0-3s", "tipo": "Gancho Visual", "visual": "Descricao da cena", "audio": "Texto falado", "direcao": "Instrucoes de camera/movimento"},
    {"tempo": "3-15s", "tipo": "Problema/Contexto", "visual": "...", "audio": "...", "direcao": "..."},
    {"tempo": "15-35s", "tipo": "Solucao/Valor", "visual": "...", "audio": "...", "direcao": "..."},
    {"tempo": "35-45s", "tipo": "CTA", "visual": "...", "audio": "...", "direcao": "..."}
  ],
  "legendaInstagram": "Legenda completa com emojis e hashtags",
  "promptVeo3": "Prompt otimizado para gerar este video no Google Veo 3 (em ingles, cinematico, 9:16, 4K)",
  "direcaoArte": "Descricao da identidade visual, cores, iluminacao",
  "musica": "Sugestao de estilo musical/trilha"
}`;

      const data = await claudeMessage({ messages: [{ role: "user", content: prompt }] });
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta invalida");
      const parsed = JSON.parse(jsonMatch[0]);
      setRoteiro(parsed);
      setVideoPrompt(parsed.promptVeo3 || "");
      const newHistory = [{ ...parsed, createdAt: new Date().toISOString() }, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem("rp_video_history", JSON.stringify(newHistory));
      toast.success("Roteiro gerado!");
    } catch (e: any) {
      toast.error("Erro: " + (e.message || "").substring(0, 100));
    }
    setGenerating(false);
  }

  async function generateVideo() {
    if (!videoPrompt) { toast.error("Preencha o prompt do video"); return; }
    setGeneratingVideo(true); setVideoResult(null);
    try {
      const data: any = await geminiVeo({
        instances: [{ prompt: videoPrompt }],
        parameters: { aspectRatio: "9:16", durationSeconds: 8, personGeneration: "allow_adult", numberOfVideos: 1 },
      });
      if (data.name) {
        setVideoResult(`Operacao iniciada: ${data.name}. O video esta sendo gerado pelo Google Veo. Isso pode levar alguns minutos. Copie o ID da operacao para verificar o status depois.`);
        toast.success("Video em geracao! Pode levar alguns minutos.");
      } else {
        setVideoResult(JSON.stringify(data, null, 2));
      }
    } catch (e: any) {
      toast.error("Erro Veo: " + (e.message || "").substring(0, 150));
    }
    setGeneratingVideo(false);
  }

  function copyText(text: string) { navigator.clipboard.writeText(text); toast.success("Copiado!"); }

  const templates = [
    { serie: "serie1", serieLabel: "Dra. Roberta - Desvendando Mitos", items: [
      { id: "1.1", titulo: "O Mito do Colágeno Tópico", avatar: "dra_roberta", cta: "agendamento", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Dra. Roberta está em pé na clínica, olhando diretamente para a câmera com expressão de leve surpresa. Ela balança a cabeça negativamente. Depois, caminha lentamente em direção à câmera, gesticulando enquanto explica. No final, sorri com confiança e aponta para baixo.", dialogo: "Pare de gastar dinheiro com cremes caros de colágeno. Eles não funcionam como você pensa. A molécula do colágeno é grande demais para penetrar na derme. Para resultados reais, precisamos estimular o seu próprio corpo a produzir colágeno. Aqui na RP Golden, utilizamos bioestimuladores injetáveis e ultrassom microfocado. Quer descobrir o protocolo ideal? Clique no link da bio!" },
      { id: "1.2", titulo: "Cirurgia vs. Procedimentos Não-Invasivos", avatar: "dra_roberta", cta: "agendamento", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Dra. Roberta está sentada em poltrona elegante, com expressão confiante. Levanta um dedo como revelação importante. Gesticula enquanto fala, mantendo contato visual.", dialogo: "Você acha que flacidez só resolve com cirurgia? A maioria dos casos pode ser corrigida com procedimentos não-invasivos. Fios de PDO, bioestimuladores, radiofrequência... resultados incríveis sem riscos da cirurgia. E o melhor? Resultados naturais, sem rosto 'puxado'. Aqui na RP Golden trabalhamos com beleza natural. Agende sua avaliação!" },
      { id: "1.3", titulo: "Idade Certa para Começar", avatar: "dra_roberta", cta: "educacao", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Dra. Roberta em close-up, expressão amigável. Faz gesto de 'abrir' um segredo. Tom conversacional, como falando com amiga.", dialogo: "Muita gente pergunta: com quantos anos posso começar? A resposta é: depende! Não é sobre idade, é sobre o que você quer. Tem gente de 25 que quer prevenção e gente de 50 que quer resultados mais agressivos. O importante é fazer com quem personaliza. Siga para mais dicas!" },
      { id: "1.4", titulo: "Recuperação Pós-Procedimento", avatar: "dra_roberta", cta: "engajamento", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Dra. Roberta em pé, expressão tranquilizadora. Gesticula respondendo pergunta frequente. Linguagem corporal transmite segurança.", dialogo: "A recuperação é importante. Mas com os procedimentos certos, é muito mais rápida do que imagina. Com bioestimuladores, leve inchaço nos primeiros dias, mas volta à rotina. Evitar sol, atividades pesadas por alguns dias, usar protetor. Comenta ou manda DM!" },
      { id: "1.5", titulo: "Resultados Naturais vs. Artificiais", avatar: "dra_roberta", cta: "agendamento", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Dra. Roberta em pé, expressão séria mas acolhedora. Aponta para câmera conversando diretamente. Tom educativo e empático.", dialogo: "Já viu rosto que parece 'mexido'? Aspecto artificial, sem movimento? Isso não é o que fazemos. Acreditamos em beleza natural. O objetivo é que ninguém perceba que você fez algo. Só aquele brilho, firmeza, viço. É ciência. Clique no link da bio!" },
    ]},
    { serie: "serie2", serieLabel: "UGC Cliente - Testemunhos", items: [
      { id: "2.1", titulo: "Transformação Completa", avatar: "ugc_cliente", cta: "lifestyle", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Mulher gravando selfie, mostrando pele radiante de perto. Sorri genuinamente, aponta para pele. Afasta câmera para mostrar rosto inteiro.", dialogo: "Gente, vocês não vão acreditar na diferença do protocolo Golden Glow! Eu chegava com pele cansada, sem brilho. Depois de 3 sessões, ficou assim... Sem filtro, sem edição! Minha mãe perguntou se fiz cirurgia. Corre pra RP Golden Clinic!" },
      { id: "2.2", titulo: "Rotina de Cuidados Pós-Procedimento", avatar: "ugc_cliente", cta: "engajamento", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Mulher no banheiro mostrando rotina de skincare. Pega produtos, mostra para câmera. Expressão educada e relatable.", dialogo: "Minha rotina ficou muito mais simples! Antes usava milhares de produtos. Agora: limpador suave, sérum, protetor solar. Pronto! Pele tão bem que não precisa tanto. Resultado dura! Siga para dicas toda semana!" },
      { id: "2.3", titulo: "Antes e Depois Sem Filtro", avatar: "ugc_cliente", cta: "agendamento", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Mulher segurando duas fotos: antes (pele cansada) e depois (radiante). Mostra fotos, depois rosto atual. Satisfação genuína.", dialogo: "Essa foto é de 3 meses atrás. Essa é de hoje. Pele mais firme, brilhante, sem manchas. Sem filtro, sem edição. Tudo com 4 sessões do Golden Glow. Clica no link da bio!" },
      { id: "2.4", titulo: "Confiança e Autoestima", avatar: "ugc_cliente", cta: "lifestyle", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Mulher em ambiente luxuoso, se olhando no espelho com confiança. Toca rosto suavemente. Olha para câmera com sorriso genuíno.", dialogo: "Sabe aquele feeling de acordar e gostar do que vê? Depois dos procedimentos na RP Golden, acordo assim todos os dias. Não é vaidade, é cuidado. Vem conhecer. Sua melhor versão está aqui!" },
      { id: "2.5", titulo: "Recomendação para Amigas", avatar: "ugc_cliente", cta: "engajamento", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Mulher conversando com câmera como com amigas. Gestos entusiasmados, compartilhando segredo. Expressão animada.", dialogo: "Minhas amigas perguntam: quanto custa? Dói? O segredo? E eu falo: vocês têm que ir na RP Golden! A Dra. Roberta é muito profissional, atenciosa. Já indiquei 5 amigas e todas voltaram agradecendo!" },
    ]},
    { serie: "serie3", serieLabel: "UGC Procedimentos - Educativo", items: [
      { id: "3.1", titulo: "O Que é Bioestimulador?", avatar: "ugc_procedimentos", cta: "educacao", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Esteticista em pé na clínica, expressão didática. Gesticula ensinando. Movimentos claros. Equipamentos ao fundo desfocados.", dialogo: "Sou a Camila, esteticista da RP Golden. O bioestimulador estimula seu corpo a produzir colágeno. Não é preenchimento, é estímulo. Microagulhas finas, praticamente indolor. Em 2-3 semanas, pele mais firme e radiante. Clique no link!" },
      { id: "3.2", titulo: "Passo-a-Passo do Procedimento", avatar: "ugc_procedimentos", cta: "engajamento", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Esteticista demonstrando passo-a-passo. Mostra materiais, explica etapas. Profissional mas acessível.", dialogo: "Passo-a-passo: limpeza profunda, anestésico tópico, injeção em pontos estratégicos (20 min), sérum calmante e protetor solar. Pronto! Leve inchaço, mas nada que impeça viver sua vida. Comenta ou manda DM!" },
      { id: "3.3", titulo: "Diferença Entre Procedimentos", avatar: "ugc_procedimentos", cta: "educacao", duracao: "45-60s", plataforma: "Reels, TikTok", acao: "Esteticista em pé, levanta dedos para contar/comparar. Gestos claros e didáticos.", dialogo: "Preenchimento é 'encher' uma área (lábios, maçãs). Bioestimulador estimula colágeno naturalmente - melhora qualidade da pele, mais firme e radiante. Na RP Golden usamos os dois conforme necessidade. Agende com a Dra. Roberta!" },
      { id: "3.4", titulo: "Cuidados Pós-Procedimento", avatar: "ugc_procedimentos", cta: "engajamento", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Esteticista mostrando cuidados. Pega produtos, mostra para câmera. Profissional e atenciosa.", dialogo: "Cuidados importantes: evitar sol 7 dias, protetor solar! Sem atividades pesadas 3-5 dias. Evitar álcool e fumar. Usar produtos recomendados. Seguindo direitinho, resultado incrível! Manda DM!" },
      { id: "3.5", titulo: "Frequência de Procedimentos", avatar: "ugc_procedimentos", cta: "educacao", duracao: "30-45s", plataforma: "Reels, TikTok", acao: "Esteticista respondendo pergunta frequente. Gesticula com clareza.", dialogo: "Quantas vezes? Depende do objetivo. Algumas fazem 1 sessão, outras 3-4. Manutenção a cada 6-12 meses. Na RP Golden personalizamos tudo. Clique no link da bio!" },
    ]},
    { serie: "serie4", serieLabel: "Vídeos Curtos de Impacto (15s)", items: [
      { id: "4.1", titulo: "O Gancho (Hook)", avatar: "dra_roberta", cta: "agendamento", duracao: "15s", plataforma: "TikTok, Reels", acao: "Dra. Roberta olha para câmera com surpresa. Levanta dedo como revelação. Gesto dramático mas profissional.", dialogo: "Você está gastando dinheiro com cremes que não funcionam. Deixa eu te contar o segredo que ninguém fala..." },
      { id: "4.2", titulo: "Antes e Depois Rápido", avatar: "ugc_cliente", cta: "agendamento", duracao: "15s", plataforma: "TikTok, Reels", acao: "Mulher mostra pele de antes e depois. Transição rápida.", dialogo: "De cansada para radiante em 4 semanas. Sem cirurgia, sem downtime. Só procedimentos na RP Golden Clinic." },
      { id: "4.3", titulo: "Pergunta Engajadora", avatar: "ugc_procedimentos", cta: "engajamento", duracao: "15s", plataforma: "TikTok, Reels", acao: "Esteticista faz pergunta para câmera. Expressão curiosa. Aponta para espectador.", dialogo: "Você já fez algum procedimento estético e ficou com medo do resultado? Comenta aqui embaixo!" },
      { id: "4.4", titulo: "Dica Rápida", avatar: "ugc_procedimentos", cta: "educacao", duracao: "15s", plataforma: "TikTok, Reels", acao: "Esteticista compartilha dica rápida. Fala rápido mas claro.", dialogo: "Dica: protetor solar é o melhor procedimento estético que existe. Use todo dia, mesmo em casa. Sua pele vai agradecer em 10 anos." },
      { id: "4.5", titulo: "Testemunho Rápido", avatar: "ugc_cliente", cta: "lifestyle", duracao: "15s", plataforma: "TikTok, Reels", acao: "Mulher mostra pele radiante de perto, sorrindo. Fala rápido com entusiasmo.", dialogo: "Minha pele nunca esteve tão boa. Sem filtro, sem edição. Tudo graças ao protocolo Golden Glow. Se você quer isso também, vem!" },
    ]},
  ];

  const inputClass = "w-full bg-white border border-[#c9a96e]/20 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Video size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">IA Videos</h2>
            <p className="font-body text-sm text-foreground/40">Gere roteiros e videos para redes sociais com Google Veo 3</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("templates")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "templates" ? "bg-white border border-red-200 text-red-600 shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <FileText size={16} /> Roteiros Prontos
        </button>
        <button onClick={() => setTab("roteiro")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "roteiro" ? "bg-white border border-red-200 text-red-600 shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <Clapperboard size={16} /> Roteiro com IA
        </button>
        <button onClick={() => setTab("gerar")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "gerar" ? "bg-white border border-red-200 text-red-600 shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <Film size={16} /> Gerar Video (Veo 3)
        </button>
      </div>

      {/* Templates */}
      {tab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-sm text-foreground/50">20 roteiros prontos organizados por série. Clique em "Usar" para enviar ao gerador Veo 3.</p>
          </div>
          {templates.map(serie => (
            <div key={serie.serie} className="bg-white rounded-xl border border-[#c9a96e]/10 overflow-hidden">
              <button onClick={() => setExpandedSerie(expandedSerie === serie.serie ? null : serie.serie)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#faf7f4] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${serie.serie === "serie1" ? "bg-red-500" : serie.serie === "serie2" ? "bg-pink-500" : serie.serie === "serie3" ? "bg-purple-500" : "bg-orange-500"}`}>
                    {serie.items.length}
                  </div>
                  <div className="text-left">
                    <p className="font-display text-sm font-semibold text-foreground">{serie.serieLabel}</p>
                    <p className="font-body text-xs text-foreground/40">{serie.items.length} roteiros · {serie.items[0]?.avatar === "dra_roberta" ? "Dra. Roberta" : serie.items[0]?.avatar === "ugc_cliente" ? "UGC Cliente" : "UGC Procedimentos"}</p>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-foreground/30 transition-transform ${expandedSerie === serie.serie ? "rotate-180" : ""}`} />
              </button>
              {expandedSerie === serie.serie && (
                <div className="border-t border-[#c9a96e]/10">
                  {serie.items.map(item => (
                    <div key={item.id} className="p-5 border-b border-[#c9a96e]/5 last:border-b-0 hover:bg-[#faf7f4]/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-body text-[10px] font-bold text-foreground/30">{item.id}</span>
                            <h4 className="font-display text-sm font-semibold text-foreground">{item.titulo}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-[10px] font-body bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{item.avatar === "dra_roberta" ? "Dra. Roberta" : item.avatar === "ugc_cliente" ? "UGC Cliente" : "Esteticista"}</span>
                            <span className="text-[10px] font-body bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-0.5 rounded-full">{item.cta}</span>
                            <span className="text-[10px] font-body bg-foreground/5 text-foreground/40 px-2 py-0.5 rounded-full">{item.duracao}</span>
                            <span className="text-[10px] font-body text-foreground/30">{item.plataforma}</span>
                          </div>
                          <p className="font-body text-xs text-foreground/50 mb-2"><strong>Ação:</strong> {item.acao}</p>
                          <p className="font-body text-xs text-foreground/60 italic">"{item.dialogo.substring(0, 150)}..."</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => { setVideoPrompt(`Cinematic portrait video (9:16), 4K, ${item.duracao} duration. Soft golden lighting, shallow DOF. Brand colors: gold #C99C63, beige #E5C578. Modern clinic setting. ${item.avatar === "dra_roberta" ? "Professional female dermatologist, 40yo, white lab coat, confident." : item.avatar === "ugc_cliente" ? "Beautiful woman 30yo, casual chic beige, selfie style, genuine smile." : "Professional aesthetician 32yo, white uniform gold details, didactic."} ACTION: ${item.acao}`); setTab("gerar"); }}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-[10px] font-medium hover:bg-red-600">
                            <Play size={10} /> Veo 3
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(item.dialogo); toast.success("Diálogo copiado!"); }}
                            className="flex items-center gap-1 border border-[#c9a96e]/20 text-foreground/40 px-3 py-2 rounded-lg text-[10px] font-medium hover:border-[#c9a96e]">
                            <Copy size={10} /> Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "roteiro" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5">
              {/* Avatar */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-3 block">Avatar</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(avatars).map(([key, val]) => (
                    <button key={key} onClick={() => setAvatar(key)}
                      className={`p-3 rounded-lg border text-center transition-all ${avatar === key ? "bg-red-50 border-red-300 text-red-700" : "border-[#c9a96e]/20 text-foreground/50"}`}>
                      <p className="font-body text-xs font-medium">{val.label}</p>
                      <p className="font-body text-[10px] text-foreground/40">{val.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform + CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">Plataforma</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className={inputClass}>
                    {Object.entries(platforms).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">CTA</label>
                  <select value={ctaType} onChange={e => setCtaType(e.target.value)} className={inputClass}>
                    {Object.entries(ctas).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* Article */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Artigo base (opcional)</label>
                <select value={selectedArticle} onChange={e => setSelectedArticle(e.target.value)} className={inputClass}>
                  <option value="">Conteudo original</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>

              {/* Custom */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Instrucao adicional</label>
                <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={2} className={inputClass + " resize-none"} placeholder="Ex: Foque em rejuvenescimento para mulheres 40+" />
              </div>

              <button onClick={generateRoteiro} disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {generating ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando roteiro...</> : <><Clapperboard size={18} /> Gerar Roteiro</>}
              </button>
            </div>

            {/* Result */}
            {roteiro && (
              <div className="bg-white rounded-xl border border-[#c9a96e]/10 overflow-hidden">
                <div className="p-6 border-b border-[#c9a96e]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-body bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">{avatars[roteiro.avatar]?.label || roteiro.avatar} · {roteiro.duracao}</span>
                    <button onClick={() => copyText(JSON.stringify(roteiro, null, 2))} className="text-xs font-body text-foreground/30 hover:text-red-500">Copiar JSON</button>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">{roteiro.titulo}</h3>
                  {roteiro.hook && <p className="font-body text-sm text-red-500 italic">Hook: "{roteiro.hook}"</p>}
                </div>

                {/* Cenas */}
                {roteiro.cenas && (
                  <div className="p-6 border-b border-[#c9a96e]/10">
                    <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-4">Cenas</p>
                    <div className="space-y-4">
                      {roteiro.cenas.map((c: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-16 text-center flex-shrink-0">
                            <span className="text-xs font-mono text-red-500 font-medium">{c.tempo}</span>
                            <p className="text-[10px] text-foreground/30 mt-0.5">{c.tipo}</p>
                          </div>
                          <div className="flex-1 bg-[#faf7f4] rounded-lg p-3">
                            <p className="font-body text-xs text-foreground/50 mb-1"><strong>Visual:</strong> {c.visual}</p>
                            <p className="font-body text-xs text-foreground/70 mb-1"><strong>Audio:</strong> "{c.audio}"</p>
                            {c.direcao && <p className="font-body text-[11px] text-foreground/30 italic">{c.direcao}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legenda */}
                {roteiro.legendaInstagram && (
                  <div className="p-6 border-b border-[#c9a96e]/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Legenda Instagram</p>
                      <button onClick={() => copyText(roteiro.legendaInstagram)} className="text-xs font-body text-red-500 hover:underline">Copiar</button>
                    </div>
                    <div className="bg-[#faf7f4] rounded-lg p-4 font-body text-xs text-foreground/60 whitespace-pre-wrap">{roteiro.legendaInstagram}</div>
                  </div>
                )}

                {/* Prompt Veo 3 */}
                {roteiro.promptVeo3 && (
                  <div className="p-6 border-b border-[#c9a96e]/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Prompt Veo 3</p>
                      <div className="flex gap-2">
                        <button onClick={() => copyText(roteiro.promptVeo3)} className="text-xs font-body text-red-500 hover:underline">Copiar</button>
                        <button onClick={() => { setVideoPrompt(roteiro.promptVeo3); setTab("gerar"); }} className="text-xs font-body text-purple-500 hover:underline">Usar no Veo 3</button>
                      </div>
                    </div>
                    <div className="bg-[#faf7f4] rounded-lg p-4 font-mono text-[11px] text-foreground/50 whitespace-pre-wrap">{roteiro.promptVeo3}</div>
                  </div>
                )}

                {roteiro.direcaoArte && (
                  <div className="p-6">
                    <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-2">Direcao de Arte</p>
                    <p className="font-body text-xs text-foreground/50">{roteiro.direcaoArte}</p>
                    {roteiro.musica && <p className="font-body text-xs text-foreground/30 mt-2">Musica: {roteiro.musica}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-red-500 font-medium mb-3">Avatares</p>
              <div className="space-y-2 font-body text-xs text-foreground/50">
                <p><strong className="text-foreground">Dra. Roberta:</strong> Jaleco branco, autoridade, procedimentos complexos</p>
                <p><strong className="text-foreground">UGC Cliente:</strong> Casual chique, testemunho, identificacao emocional</p>
                <p><strong className="text-foreground">UGC Procedimentos:</strong> Uniforme clinica, passo-a-passo, educativo</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-red-500 font-medium mb-3">Historico ({history.length})</p>
              {history.length === 0 ? <p className="font-body text-xs text-foreground/30">Nenhum roteiro gerado</p> : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((h, i) => (
                    <div key={i} className="p-2 bg-[#faf7f4] rounded-lg cursor-pointer hover:bg-red-50/50" onClick={() => { setRoteiro(h); if (h.promptVeo3) setVideoPrompt(h.promptVeo3); }}>
                      <p className="font-body text-xs font-medium text-foreground truncate">{h.titulo}</p>
                      <span className="text-[10px] text-foreground/30">{h.avatar} · {new Date(h.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "gerar" && (
        <div className="max-w-2xl space-y-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
              <Film size={24} className="text-red-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-1">Gerar Video com Google Veo 3</h3>
            <p className="font-body text-sm text-foreground/40">Cole o prompt gerado no roteiro ou escreva seu proprio</p>
          </div>

          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Prompt do video (ingles recomendado)</label>
              <textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} rows={8} className={inputClass + " resize-y font-mono text-xs"} placeholder="Cinematic portrait video (9:16), 4K resolution..." />
            </div>

            <button onClick={generateVideo} disabled={generatingVideo}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {generatingVideo ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando video...</> : <><Play size={18} /> Gerar Video com Veo 3</>}
            </button>

          </div>

          {videoResult && (
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-red-500 font-medium mb-3">Resultado</p>
              <div className="bg-[#faf7f4] rounded-lg p-4 font-mono text-xs text-foreground/60 whitespace-pre-wrap">{videoResult}</div>
              <button onClick={() => copyText(videoResult)} className="mt-3 text-xs font-body text-red-500 hover:underline">Copiar</button>
            </div>
          )}

          <div className="bg-red-50 rounded-xl border border-red-200 p-5">
            <p className="font-body text-xs font-medium text-red-700 mb-2">Como funciona</p>
            <div className="font-body text-xs text-red-600/70 space-y-1">
              <p>1. Gere um roteiro na aba "Roteiro com IA" — ele cria o prompt Veo 3 automaticamente</p>
              <p>2. Clique em "Usar no Veo 3" para enviar o prompt para esta aba</p>
              <p>3. Clique "Gerar Video" — o Google Veo processa e retorna o video</p>
              <p>4. A API Veo 3 requer conta Google Cloud com Vertex AI habilitado</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
