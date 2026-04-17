import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, Trash2, Eye, EyeOff, LogOut, FileText, Upload, Save, ArrowLeft,
  Image as ImageIcon, X, Star, Home, User, MessageSquare, MapPin, Scissors, BookOpen, Heart, Users, Sparkles, Search, Globe, Settings, FileCode, Shield, Camera, Inbox, Instagram, Video,
} from "lucide-react";
import { toast } from "sonner";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { claudeMessage, geminiImage } from "@/lib/aiProxy";
import AdminVideoAgent from "./AdminVideoAgent";

// ─── Types ─────────────────────────────────────────────
interface Article { id: string; title: string; slug: string; excerpt: string; content: string; category: string; image_url: string; author: string; read_time: number; status: string; meta_description: string; keyword: string; featured: boolean; scheduled_at: string | null; created_at: string; }
interface Testimonial { id: string; name: string; role: string; text: string; stars: number; sort_order: number; visible: boolean; }
interface Unit { id: string; name: string; address: string; phone: string; whatsapp: string; page_url: string; image_url: string; visible: boolean; sort_order: number; }
interface Treatment { id: string; title: string; short_description: string; slug: string; icon: string; image_url: string; visible: boolean; sort_order: number; }
interface HeroData { id: string; title: string; subtitle: string; cta_text: string; cta_link: string; image_url: string; }
interface AboutData { id: string; name: string; crm: string; title: string; description: string; badge_text: string; image_url: string; }

type Section = "home" | "blog" | "hero" | "about" | "testimonials" | "units" | "treatments" | "referrals" | "seo" | "config" | "results" | "leads" | "instagram" | "google" | "videos" | "analytics" | "analyticsBlog";
interface GoogleReview { id: string; author_name: string; author_photo: string; rating: number; text: string; reply: string; review_date: string; unit_name: string; is_visible: boolean; sort_order: number; }
interface Lead { id: string; name: string; phone: string; email: string; service: string; message: string; source: string; created_at: string; }
interface ResultImage { id: string; image_url: string; alt_text: string; treatment: string; sort_order: number; is_visible: boolean; }
interface SeoPage { id: string; page_key: string; title: string; description: string; keywords: string; og_image: string; canonical_url: string; schema_json: string; }
interface Referral { id: string; referrer_name: string; referrer_email: string; referrer_phone: string; friend_name: string; friend_contact: string; friend_age_range: string; quiz_slug: string; quiz_completed: boolean; friend_email: string; pdf_sent: boolean; status: string; notes: string; created_at: string; }

const categories = ["Toxina Botulinica", "Bioestimulador", "Preenchimento", "Harmonizacao", "Skincare", "Bem-estar"];
const inputClass = "w-full bg-white border border-[#c9a96e]/20 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30";

function slugify(t: string) { return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

// ─── Image Upload Helper ───────────────────────────────
function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File): Promise<string | null> {
    if (file.size > 10*1024*1024) { toast.error("Max 10MB"); return null; }
    setUploading(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1200; let w = img.width, h = img.height;
          if (w > MAX) { h = Math.round(h*MAX/w); w = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          canvas.toBlob(async (blob) => {
            if (!blob) { setUploading(false); resolve(null); return; }
            const fn = `site_${Date.now()}.jpg`;
            const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fn, blob, { contentType: "image/jpeg", upsert: true });
            if (error) { toast.error("Erro upload: " + error.message); console.error("Upload error:", error); setUploading(false); resolve(null); return; }
            const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fn);
            setUploading(false); toast.success("Imagem enviada"); resolve(data.publicUrl);
          }, "image/jpeg", 0.75);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
  return { uploading, upload };
}

// ─── Main Admin ────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { uploading, upload } = useImageUpload();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  const sidebarGroups: { title: string; items: { key: Section; label: string; icon: any }[] }[] = [
    {
      title: "Páginas",
      items: [
        { key: "hero", label: "Hero", icon: Home },
        { key: "about", label: "Sobre", icon: User },
        { key: "treatments", label: "Tratamentos", icon: Scissors },
        { key: "testimonials", label: "Depoimentos", icon: MessageSquare },
        { key: "results", label: "Resultados", icon: Camera },
        { key: "units", label: "Unidades", icon: MapPin },
      ],
    },
    {
      title: "Retenção",
      items: [
        { key: "referrals", label: "Golden Friends", icon: Heart },
        { key: "leads", label: "Leads", icon: Inbox },
      ],
    },
    {
      title: "Conteúdo",
      items: [
        { key: "blog", label: "Blog", icon: BookOpen },
        { key: "instagram", label: "IA Instagram", icon: Instagram },
        { key: "videos", label: "IA Vídeos", icon: Video },
      ],
    },
    {
      title: "Performance",
      items: [
        { key: "seo", label: "SEO", icon: Globe },
        { key: "analytics", label: "Analytics Site", icon: Search },
        { key: "analyticsBlog", label: "Analytics Blog", icon: Search },
        { key: "google", label: "Google Reviews", icon: Star },
      ],
    },
    {
      title: "Configuração",
      items: [
        { key: "config", label: "Configuração", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f4] flex">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-foreground flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-foreground/70 p-1" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xs font-semibold text-primary-foreground tracking-[0.15em] uppercase">Golden Clinic</h1>
          <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-[9px] px-1.5 py-0.5 rounded font-body">Admin</span>
        </div>
        <a href="/" target="_blank" className="text-primary-foreground/40 text-xs font-body">Site</a>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-56 bg-foreground flex flex-col z-50 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <button onClick={() => { setSection("home"); setSidebarOpen(false); }} className="text-left">
            <h1 className="font-display text-sm font-semibold text-primary-foreground tracking-[0.15em] uppercase hover:text-[#c9a96e] transition-colors">Golden Clinic</h1>
            <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-[10px] px-2 py-0.5 rounded font-body mt-1 inline-block">Admin</span>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-primary-foreground/40 p-1" aria-label="Fechar menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {sidebarGroups.map((group) => (
            <div key={group.title} className="mb-1">
              <p className="px-5 pt-4 pb-1 font-body text-[10px] tracking-[0.15em] uppercase text-primary-foreground/25 font-medium">{group.title}</p>
              {group.items.map((item) => (
                <button key={item.key} onClick={() => { setSection(item.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left font-body text-[13px] transition-colors ${
                    section === item.key ? "bg-white/10 text-[#c9a96e]" : "text-primary-foreground/50 hover:text-primary-foreground/80"
                  }`}>
                  <item.icon size={15} /> {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="block text-primary-foreground/40 text-xs font-body hover:text-[#c9a96e]">Ver site</a>
          <button onClick={handleLogout} className="flex items-center gap-1 text-primary-foreground/40 text-xs font-body hover:text-red-400">
            <LogOut size={12} /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="lg:ml-56 flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <AnimatePresence mode="wait">
          {section === "home" && <AdminHome key="home" onNavigate={setSection} />}
          {section === "blog" && <BlogSection key="blog" uploading={uploading} upload={upload} />}
          {section === "hero" && <HeroSection key="hero" uploading={uploading} upload={upload} />}
          {section === "about" && <AboutSection key="about" uploading={uploading} upload={upload} />}
          {section === "testimonials" && <TestimonialsSection key="testimonials" />}
          {section === "units" && <UnitsSection key="units" />}
          {section === "treatments" && <TreatmentsSection key="treatments" uploading={uploading} upload={upload} />}
          {section === "results" && <ResultsAdminSection key="results" uploading={uploading} upload={upload} />}
          {section === "analytics" && <AnalyticsSection key="analytics" type="site" />}
          {section === "analyticsBlog" && <AnalyticsSection key="analyticsBlog" type="blog" />}
          {section === "google" && <GoogleReviewsSection key="google" />}
          {section === "leads" && <LeadsSection key="leads" />}
          {section === "referrals" && <ReferralsSection key="referrals" />}
          {section === "instagram" && <InstagramAgentSection key="instagram" />}
          {section === "videos" && <AdminVideoAgent key="videos" />}
          {section === "seo" && <SeoSection key="seo" />}
          {section === "config" && <ConfigSection key="config" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ADMIN HOME
// ═══════════════════════════════════════════════════════
function AdminHome({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const quickGroups = [
    {
      title: "Páginas",
      desc: "Gerencie o conteúdo das seções do site",
      color: "from-[#b8935a] to-[#c9a96e]",
      items: [
        { key: "hero" as Section, label: "Hero", icon: Home },
        { key: "about" as Section, label: "Sobre", icon: User },
        { key: "treatments" as Section, label: "Tratamentos", icon: Scissors },
        { key: "testimonials" as Section, label: "Depoimentos", icon: MessageSquare },
        { key: "results" as Section, label: "Resultados", icon: Camera },
        { key: "units" as Section, label: "Unidades", icon: MapPin },
      ],
    },
    {
      title: "Retenção",
      desc: "Indicações, leads e relacionamento",
      color: "from-pink-500 to-red-500",
      items: [
        { key: "referrals" as Section, label: "Golden Friends", icon: Heart },
        { key: "leads" as Section, label: "Leads", icon: Inbox },
      ],
    },
    {
      title: "Conteúdo",
      desc: "Blog, redes sociais e produção com IA",
      color: "from-purple-500 to-indigo-500",
      items: [
        { key: "blog" as Section, label: "Blog", icon: BookOpen },
        { key: "instagram" as Section, label: "IA Instagram", icon: Instagram },
        { key: "videos" as Section, label: "IA Vídeos", icon: Video },
      ],
    },
    {
      title: "Performance",
      desc: "SEO, analytics e avaliações",
      color: "from-blue-500 to-cyan-500",
      items: [
        { key: "seo" as Section, label: "SEO", icon: Globe },
        { key: "analytics" as Section, label: "Analytics Site", icon: Search },
        { key: "analyticsBlog" as Section, label: "Analytics Blog", icon: Search },
        { key: "google" as Section, label: "Google Reviews", icon: Star },
      ],
    },
    {
      title: "Configuração",
      desc: "Privacidade, robots.txt e sitemap",
      color: "from-gray-500 to-gray-700",
      items: [
        { key: "config" as Section, label: "Configuração", icon: Settings },
      ],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Painel Administrativo</h1>
        <p className="font-body text-sm text-foreground/40">RP Golden Clinic · Bem-vinda ao admin. Escolha uma seção para começar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-xl border border-[#c9a96e]/10 overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`bg-gradient-to-r ${group.color} p-5`}>
              <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
              <p className="font-body text-xs text-white/70 mt-1">{group.desc}</p>
            </div>
            <div className="p-4">
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-body text-sm text-foreground/70 hover:bg-[#c9a96e]/5 hover:text-foreground transition-colors"
                  >
                    <item.icon size={15} className="text-[#c9a96e]" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/" target="_blank" className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 text-center hover:shadow-md transition-shadow">
          <Globe size={20} className="text-[#c9a96e] mx-auto mb-2" />
          <p className="font-body text-xs text-foreground/40">Ver site</p>
        </a>
        <a href="/blog" target="_blank" className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 text-center hover:shadow-md transition-shadow">
          <BookOpen size={20} className="text-[#c9a96e] mx-auto mb-2" />
          <p className="font-body text-xs text-foreground/40">Ver blog</p>
        </a>
        <a href="/golden-friends" target="_blank" className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 text-center hover:shadow-md transition-shadow">
          <Heart size={20} className="text-[#c9a96e] mx-auto mb-2" />
          <p className="font-body text-xs text-foreground/40">Golden Friends</p>
        </a>
        <a href="/resultados" target="_blank" className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 text-center hover:shadow-md transition-shadow">
          <Camera size={20} className="text-[#c9a96e] mx-auto mb-2" />
          <p className="font-body text-xs text-foreground/40">Resultados</p>
        </a>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════
function HeroSection({ uploading, upload }: { uploading: boolean; upload: (f:File)=>Promise<string|null> }) {
  const [data, setData] = useState<HeroData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { supabase.from("site_hero").select("*").limit(1).single().then(({data}) => { if(data) setData(data); }); }, []);

  async function save() {
    if (!data) return; setSaving(true);
    await supabase.from("site_hero").update({ title: data.title, subtitle: data.subtitle, cta_text: data.cta_text, cta_link: data.cta_link, image_url: data.image_url }).eq("id", data.id);
    toast.success("Hero atualizado"); setSaving(false);
  }

  if (!data) return <div className="text-foreground/40 font-body">Carregando...</div>;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Hero Principal</h2>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50"><Save size={14} /> {saving?"Salvando...":"Salvar"}</button>
      </div>
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5 max-w-2xl">
        <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Titulo</label><input value={data.title} onChange={e=>setData({...data,title:e.target.value})} className={inputClass}/></div>
        <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Subtitulo</label><textarea value={data.subtitle} onChange={e=>setData({...data,subtitle:e.target.value})} rows={3} className={inputClass+" resize-none"}/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Texto do botao</label><input value={data.cta_text} onChange={e=>setData({...data,cta_text:e.target.value})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Link do botao</label><input value={data.cta_link} onChange={e=>setData({...data,cta_link:e.target.value})} className={inputClass}/></div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════
function AboutSection({ uploading, upload }: { uploading: boolean; upload: (f:File)=>Promise<string|null> }) {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { supabase.from("site_about").select("*").limit(1).single().then(({data}) => { if(data) setData(data); }); }, []);

  async function save() {
    if (!data) return; setSaving(true);
    await supabase.from("site_about").update({ name: data.name, crm: data.crm, title: data.title, description: data.description, badge_text: data.badge_text, image_url: data.image_url }).eq("id", data.id);
    toast.success("Sobre atualizado"); setSaving(false);
  }

  if (!data) return <div className="text-foreground/40 font-body">Carregando...</div>;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Sobre a Dra. Roberta</h2>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50"><Save size={14} /> {saving?"Salvando...":"Salvar"}</button>
      </div>
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Nome</label><input value={data.name} onChange={e=>setData({...data,name:e.target.value})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">CRM</label><input value={data.crm} onChange={e=>setData({...data,crm:e.target.value})} className={inputClass}/></div>
        </div>
        <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Titulo / Cargo</label><input value={data.title} onChange={e=>setData({...data,title:e.target.value})} className={inputClass}/></div>
        <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Descricao</label><textarea value={data.description} onChange={e=>setData({...data,description:e.target.value})} rows={6} className={inputClass+" resize-y"}/></div>
        <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Texto do badge</label><input value={data.badge_text} onChange={e=>setData({...data,badge_text:e.target.value})} className={inputClass}/></div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// TESTIMONIALS SECTION
// ═══════════════════════════════════════════════════════
function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [reqForm, setReqForm] = useState({ clientName: "", clientPhone: "", treatment: "" });
  const [form, setForm] = useState({ name: "", role: "", text: "", stars: 5, sort_order: 0 });

  useEffect(() => { load(); }, []);
  async function load() { const {data} = await supabase.from("site_testimonials").select("*").order("sort_order"); if(data) setItems(data); }

  function openNew() { setEditing(null); setForm({ name:"", role:"", text:"", stars:5, sort_order: items.length+1 }); setShowForm(true); }
  function openEdit(t: Testimonial) { setEditing(t); setForm({ name: t.name, role: t.role, text: t.text, stars: t.stars, sort_order: t.sort_order }); setShowForm(true); }
  function closeForm() { setEditing(null); setForm({ name:"", role:"", text:"", stars:5, sort_order:0 }); setShowForm(false); }

  async function save() {
    if (!form.name || !form.text) { toast.error("Preencha nome e texto"); return; }
    if (editing) { await supabase.from("site_testimonials").update(form).eq("id", editing.id); }
    else { await supabase.from("site_testimonials").insert(form); }
    toast.success("Salvo!"); closeForm(); load();
  }

  async function remove(id: string) { if(!confirm("Excluir?")) return; await supabase.from("site_testimonials").delete().eq("id", id); toast.success("Excluido"); load(); }
  async function toggle(t: Testimonial) { await supabase.from("site_testimonials").update({ visible: !t.visible }).eq("id", t.id); load(); }

  function sendWhatsAppRequest() {
    if (!reqForm.clientName || !reqForm.clientPhone) { toast.error("Preencha nome e WhatsApp do cliente"); return; }
    const digits = reqForm.clientPhone.replace(/\D/g, "");
    const phone = digits.startsWith("55") ? digits : "55" + digits;
    const msg = `Ola ${reqForm.clientName}! 💛

Aqui e a equipe da *RP Golden Clinic*. Esperamos que voce esteja satisfeita com ${reqForm.treatment ? "o tratamento de *" + reqForm.treatment + "*" : "nossos servicos"}.

Gostaramos muito de contar com o seu depoimento para compartilhar no nosso site. Seria incrivel ouvir sua experiencia!

Poderia nos enviar um breve relato sobre:
- Como foi sua experiencia na clinica
- Os resultados que voce percebeu
- O que mais gostou do atendimento

Seu depoimento ajuda outras pessoas a conhecerem nosso trabalho. Muito obrigada! 🙏

_Dra. Roberta Castro Peres - RP Golden Clinic_`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("WhatsApp aberto para " + reqForm.clientName);
    setReqForm({ clientName: "", clientPhone: "", treatment: "" });
    setShowRequest(false);
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Depoimentos</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowRequest(true); setShowForm(false); }} className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Solicitar Depoimento
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={14} /> Novo</button>
        </div>
      </div>

      {/* Solicitar depoimento via WhatsApp */}
      {showRequest && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <p className="font-body text-sm font-medium text-green-700">Solicitar depoimento via WhatsApp</p>
            </div>
            <button onClick={() => setShowRequest(false)} className="text-green-400 hover:text-green-600"><X size={16}/></button>
          </div>
          <p className="font-body text-xs text-green-600/70">Preencha os dados do cliente e enviaremos uma mensagem personalizada pedindo o depoimento.</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-body text-xs text-green-700/70 mb-1 block">Nome do cliente *</label><input value={reqForm.clientName} onChange={e=>setReqForm({...reqForm,clientName:e.target.value})} placeholder="Nome completo" className={inputClass}/></div>
            <div><label className="font-body text-xs text-green-700/70 mb-1 block">WhatsApp do cliente *</label><input value={reqForm.clientPhone} onChange={e=>setReqForm({...reqForm,clientPhone:e.target.value})} placeholder="(11) 99999-9999" className={inputClass}/></div>
          </div>
          <div><label className="font-body text-xs text-green-700/70 mb-1 block">Tratamento realizado (opcional)</label><input value={reqForm.treatment} onChange={e=>setReqForm({...reqForm,treatment:e.target.value})} placeholder="Ex: Bioestimuladores, Preenchimento, Toxina Botulinica..." className={inputClass}/></div>
          <button onClick={sendWhatsAppRequest} className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg text-xs font-medium hover:bg-[#20bd5a] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Enviar solicitacao via WhatsApp
          </button>
        </div>
      )}
      {showForm && (
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Nome *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Tratamento</label><input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className={inputClass}/></div>
        </div>
        <div><label className="font-body text-xs text-foreground/50 mb-1 block">Depoimento *</label><textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} rows={3} className={inputClass+" resize-none"}/></div>
        <div className="flex gap-4 items-end">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Estrelas</label><input type="number" min={1} max={5} value={form.stars} onChange={e=>setForm({...form,stars:parseInt(e.target.value)||5})} className={inputClass+" w-20"}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Ordem</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} className={inputClass+" w-20"}/></div>
          <button onClick={save} className="bg-[#c9a96e] text-white px-4 py-3 rounded-lg text-xs font-medium"><Save size={14}/></button>
          <button onClick={closeForm} className="text-foreground/40 text-xs font-body">Cancelar</button>
        </div>
      </div>
      )}
      {/* List */}
      <div className="space-y-3">
        {items.map(t=>(
          <div key={t.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">{t.name} <span className="font-body text-xs text-foreground/40 font-normal">— {t.role}</span></p>
              <p className="font-body text-xs text-foreground/50 truncate mt-1">"{t.text}"</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${t.visible?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{t.visible?"Visivel":"Oculto"}</span>
            <button onClick={()=>toggle(t)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg">{t.visible?<EyeOff size={14} className="text-foreground/40"/>:<Eye size={14} className="text-green-500"/>}</button>
            <button onClick={()=>openEdit(t)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg"><Edit3 size={14} className="text-[#c9a96e]"/></button>
            <button onClick={()=>remove(t.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400"/></button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// UNITS SECTION
// ═══════════════════════════════════════════════════════
function UnitsSection() {
  const [items, setItems] = useState<Unit[]>([]);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", address:"", phone:"", whatsapp:"", page_url:"", sort_order:0 });

  useEffect(() => { load(); }, []);
  async function load() { const {data} = await supabase.from("site_units").select("*").order("sort_order"); if(data) setItems(data); }

  function openNew() { setEditing(null); setForm({ name:"", address:"", phone:"", whatsapp:"", page_url:"", sort_order: items.length+1 }); setShowForm(true); }
  function openEdit(u: Unit) { setEditing(u); setForm({ name: u.name, address: u.address, phone: u.phone, whatsapp: u.whatsapp, page_url: u.page_url, sort_order: u.sort_order }); setShowForm(true); }
  function closeForm() { setEditing(null); setForm({ name:"", address:"", phone:"", whatsapp:"", page_url:"", sort_order:0 }); setShowForm(false); }

  async function save() {
    if (!form.name) { toast.error("Preencha o nome"); return; }
    if (editing) { await supabase.from("site_units").update(form).eq("id", editing.id); }
    else { await supabase.from("site_units").insert(form); }
    toast.success("Salvo!"); closeForm(); load();
  }

  async function remove(id: string) { if(!confirm("Excluir?")) return; await supabase.from("site_units").delete().eq("id", id); toast.success("Excluido"); load(); }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Unidades</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={14} /> Nova</button>
      </div>
      {showForm && (
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Nome *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Telefone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className={inputClass}/></div>
        </div>
        <div><label className="font-body text-xs text-foreground/50 mb-1 block">Endereco</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className={inputClass}/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">WhatsApp (DDI+DDD+numero)</label><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">URL da pagina</label><input value={form.page_url} onChange={e=>setForm({...form,page_url:e.target.value})} className={inputClass}/></div>
        </div>
        <div className="flex gap-4 items-end">
          <button onClick={save} className="bg-[#c9a96e] text-white px-4 py-3 rounded-lg text-xs font-medium"><Save size={14}/></button>
          <button onClick={closeForm} className="text-foreground/40 text-xs font-body">Cancelar</button>
        </div>
      </div>
      )}
      <div className="space-y-3">
        {items.map(u=>(
          <div key={u.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 flex items-center gap-4">
            <MapPin size={18} className="text-[#c9a96e] flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">{u.name}</p>
              <p className="font-body text-xs text-foreground/40 truncate">{u.address}</p>
            </div>
            <button onClick={()=>openEdit(u)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg"><Edit3 size={14} className="text-[#c9a96e]"/></button>
            <button onClick={()=>remove(u.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400"/></button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// TREATMENTS SECTION
// ═══════════════════════════════════════════════════════
function TreatmentsSection({ uploading, upload }: { uploading: boolean; upload: (f:File)=>Promise<string|null> }) {
  const [items, setItems] = useState<Treatment[]>([]);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", short_description:"", slug:"", icon:"Sparkles", sort_order:0 });

  useEffect(() => { load(); }, []);
  async function load() { const {data} = await supabase.from("site_treatments").select("*").order("sort_order"); if(data) setItems(data); }

  function openNew() { setEditing(null); setForm({ title:"", short_description:"", slug:"", icon:"Sparkles", sort_order: items.length+1 }); setShowForm(true); }
  function openEdit(t: Treatment) { setEditing(t); setForm({ title: t.title, short_description: t.short_description, slug: t.slug, icon: t.icon, sort_order: t.sort_order }); setShowForm(true); }
  function closeForm() { setEditing(null); setForm({ title:"", short_description:"", slug:"", icon:"Sparkles", sort_order:0 }); setShowForm(false); }

  async function save() {
    if (!form.title) { toast.error("Preencha o titulo"); return; }
    const slug = form.slug || slugify(form.title);
    if (editing) { await supabase.from("site_treatments").update({ ...form, slug }).eq("id", editing.id); }
    else { await supabase.from("site_treatments").insert({ ...form, slug }); }
    toast.success("Salvo!"); closeForm(); load();
  }

  async function remove(id: string) { if(!confirm("Excluir?")) return; await supabase.from("site_treatments").delete().eq("id", id); toast.success("Excluido"); load(); }
  async function toggle(t: Treatment) { await supabase.from("site_treatments").update({ visible: !t.visible }).eq("id", t.id); load(); }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Tratamentos</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={14} /> Novo</button>
      </div>
      {showForm && (
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Titulo *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value,slug:slugify(e.target.value)})} className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Slug</label><input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className={inputClass}/></div>
        </div>
        <div><label className="font-body text-xs text-foreground/50 mb-1 block">Descricao curta</label><textarea value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})} rows={2} className={inputClass+" resize-none"}/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Icone</label><input value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} placeholder="Sparkles, Syringe, Pill..." className={inputClass}/></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Ordem</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} className={inputClass}/></div>
        </div>
        <div className="flex gap-4">
          <button onClick={save} className="bg-[#c9a96e] text-white px-4 py-3 rounded-lg text-xs font-medium"><Save size={14}/></button>
          <button onClick={closeForm} className="text-foreground/40 text-xs font-body">Cancelar</button>
        </div>
      </div>
      )}
      <div className="space-y-3">
        {items.map(t=>(
          <div key={t.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">{t.title}</p>
              <p className="font-body text-xs text-foreground/40 truncate">{t.short_description}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${t.visible?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{t.visible?"Visivel":"Oculto"}</span>
            <button onClick={()=>toggle(t)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg">{t.visible?<EyeOff size={14} className="text-foreground/40"/>:<Eye size={14} className="text-green-500"/>}</button>
            <button onClick={()=>openEdit(t)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg"><Edit3 size={14} className="text-[#c9a96e]"/></button>
            <button onClick={()=>remove(t.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400"/></button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// INSTAGRAM AGENT SECTION
// ═══════════════════════════════════════════════════════
const IG_GUIDE = `Guia de Produção de Conteúdo para Instagram - RP Golden Clinic

Tom de Voz: Autoridade Acolhedora. Elegância Acessível. Foco na Beleza Natural. Personalização.
"Nossa missão não é transformar seu rosto, mas revelar a sua melhor versão com naturalidade e ciência." - Dra. Roberta

Identidade Visual: Dourado (#C99C63) e Bege (#E5C578) para destaques. Tons neutros off-white (#FDFBF7) e marrom escuro (#4A3B2C). Tipografia serif para títulos; sem serifa para corpo.

Pilares de Conteúdo:
1. Adolescentes (Acne e Oleosidade) - Reels curtos, Stories Mito x Verdade
2. Jovens 18-29 (Prevenção e Glow) - Carrosséis educativos, Reels de rotina
3. Pele 30+ (Anti-Idade Preventivo) - Vídeos explicativos, Antes/Depois, infográficos
4. Pele 50+ (Rejuvenescimento Intensivo) - Depoimentos, vídeos sobre tecnologias, empoderamento

Estrutura do Post: 1) Gancho (Hook) nos primeiros 3 segundos 2) Conteúdo de Valor clínico acessível 3) CTA claro
Hashtags: Mesclar amplas (#DermatologiaEstetica) com locais (#ClinicaEsteticaSP #BelezaNatural)
Frequência: Feed 4-5x/semana. Stories diariamente (3-6 sequências).`;

function InstagramAgentSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [format, setFormat] = useState("carrossel");
  const [pillar, setPillar] = useState("geral");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("blog_articles").select("id, title, slug, excerpt, content, category").eq("status", "published").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setArticles(data as Article[]);
    });
    const saved = localStorage.getItem("rp_ig_history");
    if (saved) try { setHistory(JSON.parse(saved)); } catch {}
  }, []);

  const formats: Record<string, string> = {
    carrossel: "Carrossel (5-10 slides)",
    reel: "Roteiro de Reel (60-90s)",
    story: "Sequência de Stories (4-6)",
    feed: "Post Feed (legenda)",
    caption: "Legenda para foto existente",
  };
  const pillars: Record<string, string> = {
    geral: "Geral",
    adolescente: "Pilar 1: Adolescentes (Acne)",
    jovem: "Pilar 2: Jovens 18-29 (Prevenção)",
    mais30: "Pilar 3: Pele 30+ (Anti-Idade)",
    mais50: "Pilar 4: Pele 50+ (Rejuvenescimento)",
  };

  async function generate() {
    setGenerating(true); setResult(null);
    try {
      const article = articles.find(a => a.id === selectedArticle);
      const articleContext = article ? `\n\nArtigo de referência do blog:\nTítulo: ${article.title}\nCategoria: ${article.category}\nResumo: ${article.excerpt}\nConteúdo:\n${article.content?.substring(0, 2000)}` : "";
      const pillarContext = pillar !== "geral" ? `\nPilar de conteúdo: ${pillars[pillar]}` : "";

      const prompt = `${IG_GUIDE}
${pillarContext}
${articleContext}

${customPrompt ? `Instrução adicional: ${customPrompt}` : ""}

Gere conteúdo para Instagram no formato: ${formats[format]}

Retorne SOMENTE JSON válido:
{
  "titulo": "Título do post",
  "formato": "${format}",
  "gancho": "Frase de abertura (hook) para captar atenção nos primeiros 3 segundos",
  "slides": ["Slide 1: texto...", "Slide 2: texto..."],
  "legenda": "Legenda completa para o Instagram com emojis e formatação",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "cta": "Call to action principal",
  "direcaoVisual": "Descrição da arte/foto recomendada para cada slide",
  "pilar": "${pillars[pillar]}",
  "melhorHorario": "Sugestão de horário para publicação"
}`;

      const data = await claudeMessage({ messages: [{ role: "user", content: prompt }] });
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta inválida");
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
      const newHistory = [{ ...parsed, createdAt: new Date().toISOString(), articleTitle: article?.title || "" }, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("rp_ig_history", JSON.stringify(newHistory));
    } catch (e: any) {
      toast.error("Erro: " + (e.message || "").substring(0, 100));
    }
    setGenerating(false);
  }

  function copyToClipboard(text: string) { navigator.clipboard.writeText(text); toast.success("Copiado!"); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <Instagram size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Agente IA Instagram</h2>
            <p className="font-body text-sm text-foreground/40">Gere conteúdo para Instagram baseado nos artigos do blog e nas diretrizes da marca</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Generator */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5">
            {/* Format */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">Formato do conteúdo</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.entries(formats).map(([key, label]) => (
                  <button key={key} onClick={() => setFormat(key)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-body text-center transition-all ${format === key ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-700" : "border-[#c9a96e]/20 text-foreground/50 hover:border-purple-200"}`}>
                    {label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Pillar */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">Pilar de conteúdo (faixa etária)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.entries(pillars).map(([key, label]) => (
                  <button key={key} onClick={() => setPillar(key)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-body text-center transition-all ${pillar === key ? "bg-[#c9a96e]/10 border-[#c9a96e] text-[#c9a96e]" : "border-[#c9a96e]/20 text-foreground/50 hover:border-[#c9a96e]/40"}`}>
                    {label.split(":")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog article */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Artigo do blog como base (opcional)</label>
              <select value={selectedArticle} onChange={e => setSelectedArticle(e.target.value)} className={inputClass}>
                <option value="">Sem artigo - criar conteúdo original</option>
                {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>

            {/* Custom prompt */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Instrução adicional (opcional)</label>
              <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3} className={inputClass + " resize-none"} placeholder="Ex: Foque em bioestimuladores para mulheres 40+, tom mais informal..." />
            </div>

            <button onClick={generate} disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white py-4 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {generating ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando conteúdo...</> : <><Instagram size={18} /> Gerar Conteúdo Instagram</>}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 overflow-hidden">
              <div className="p-6 border-b border-[#c9a96e]/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-body bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-medium">{formats[result.formato] || result.formato}</span>
                    {result.pilar && <span className="text-xs font-body text-foreground/30">{result.pilar}</span>}
                  </div>
                  {result.melhorHorario && <span className="text-xs font-body text-foreground/40">Melhor horário: {result.melhorHorario}</span>}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{result.titulo}</h3>
                {result.gancho && <p className="font-body text-sm text-purple-600 italic">Hook: "{result.gancho}"</p>}
              </div>

              {/* Slides */}
              {result.slides && result.slides.length > 0 && (
                <div className="p-6 border-b border-[#c9a96e]/10">
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Slides / Sequência</p>
                  <div className="space-y-3">
                    {result.slides.map((slide: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <p className="font-body text-sm text-foreground/70 leading-relaxed">{slide}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption */}
              {result.legenda && (
                <div className="p-6 border-b border-[#c9a96e]/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Legenda</p>
                    <button onClick={() => copyToClipboard(result.legenda)} className="text-xs font-body text-purple-500 hover:underline">Copiar</button>
                  </div>
                  <div className="bg-[#faf7f4] rounded-lg p-4 font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{result.legenda}</div>
                </div>
              )}

              {/* Hashtags */}
              {result.hashtags && (
                <div className="p-6 border-b border-[#c9a96e]/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Hashtags</p>
                    <button onClick={() => copyToClipboard(result.hashtags.join(" "))} className="text-xs font-body text-purple-500 hover:underline">Copiar todas</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((h: string, i: number) => (
                      <span key={i} className="text-xs font-body bg-purple-50 text-purple-600 px-2 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual direction */}
              {result.direcaoVisual && (
                <div className="p-6 border-b border-[#c9a96e]/10">
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Direção Visual</p>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">{result.direcaoVisual}</p>
                </div>
              )}

              {/* CTA */}
              {result.cta && (
                <div className="p-6">
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-2">Call to Action</p>
                  <p className="font-body text-sm font-medium text-foreground">{result.cta}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Guide info */}
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Diretrizes da Marca</p>
            <div className="space-y-2 font-body text-xs text-foreground/50">
              <p>- Tom: Autoridade Acolhedora, Elegância Acessível</p>
              <p>- Cores: Dourado #C99C63, Bege #E5C578</p>
              <p>- Foco: Beleza Natural, Personalização</p>
              <p>- Freq: Feed 4-5x/semana, Stories diário</p>
              <p>- Hook nos 3 primeiros segundos</p>
              <p>- CTA claro em cada post</p>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Últimos gerados ({history.length})</p>
            {history.length === 0 ? (
              <p className="font-body text-xs text-foreground/30">Nenhum conteúdo gerado ainda</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="p-3 bg-[#faf7f4] rounded-lg cursor-pointer hover:bg-[#c9a96e]/5" onClick={() => setResult(h)}>
                    <p className="font-body text-xs font-medium text-foreground truncate">{h.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-body text-purple-500">{h.formato}</span>
                      <span className="text-[10px] font-body text-foreground/30">{new Date(h.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ANALYTICS SECTION
// ═══════════════════════════════════════════════════════
function AnalyticsSection({ type }: { type: "site" | "blog" }) {
  const [gaId, setGaId] = useState(localStorage.getItem(`rp_ga_${type}`) || "");
  const [embedUrl, setEmbedUrl] = useState(localStorage.getItem(`rp_ga_embed_${type}`) || "");
  const [saved, setSaved] = useState(!!localStorage.getItem(`rp_ga_${type}`));

  function saveConfig() {
    localStorage.setItem(`rp_ga_${type}`, gaId);
    localStorage.setItem(`rp_ga_embed_${type}`, embedUrl);
    setSaved(true);
    toast.success("Configuração salva!");
  }

  const issite = type === "site";
  const title = issite ? "Google Analytics - Site" : "Google Analytics - Blog";
  const desc = issite ? "Métricas de visitas, origens e páginas do site principal" : "Métricas de visitas, origens e artigos mais lidos do blog";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${issite ? "bg-blue-500" : "bg-green-500"}`}>
            <Search size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
            <p className="font-body text-sm text-foreground/40">{desc}</p>
          </div>
        </div>
      </div>

      {/* Config */}
      <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-5">
        <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Configuração</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1.5 block">ID de Medição GA4</label>
            <input value={gaId} onChange={e => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" className={inputClass} />
            <p className="font-body text-xs text-foreground/30 mt-1">Encontre em Google Analytics → Admin → Fluxos de dados → ID de medição</p>
          </div>
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1.5 block">Status</label>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${gaId ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              <div className={`w-2 h-2 rounded-full ${gaId ? "bg-green-500" : "bg-amber-500"}`} />
              <span className={`font-body text-xs ${gaId ? "text-green-700" : "text-amber-700"}`}>{gaId ? "Configurado" : "Aguardando ID"}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="font-body text-xs text-foreground/50 mb-1.5 block">URL do Looker Studio / Data Studio (embed)</label>
          <input value={embedUrl} onChange={e => setEmbedUrl(e.target.value)} placeholder="https://lookerstudio.google.com/embed/reporting/..." className={inputClass} />
          <p className="font-body text-xs text-foreground/30 mt-1">No Looker Studio, crie um relatório → Compartilhar → Incorporar → Copie a URL do iframe</p>
        </div>

        <button onClick={saveConfig} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90">
          <Save size={14} /> Salvar Configuração
        </button>
      </div>

      {/* Script de instalação */}
      {gaId && (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Script de Rastreamento</p>
            <button onClick={() => {
              const script = `<!-- Google Analytics GA4 -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${gaId}');\n</script>`;
              navigator.clipboard.writeText(script);
              toast.success("Script copiado!");
            }} className="text-xs font-body text-[#c9a96e] hover:underline">Copiar script</button>
          </div>
          <div className="bg-[#1c1917] rounded-lg p-4 overflow-x-auto">
            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">{`<!-- Google Analytics GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}'${!issite ? `, {
    'page_title': document.title,
    'content_group': 'blog'
  }` : ""});
</script>`}</pre>
          </div>
          <p className="font-body text-xs text-foreground/30 mt-3">Este script já está instalado automaticamente no site. As métricas começam a ser coletadas imediatamente após a configuração do ID.</p>
        </div>
      )}

      {/* Dashboard embed */}
      {embedUrl ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 overflow-hidden mb-6">
          <div className="p-4 border-b border-[#c9a96e]/10 flex items-center justify-between">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Dashboard de Métricas</p>
            <a href={embedUrl.replace("/embed/", "/").replace("embed/reporting", "reporting")} target="_blank" className="text-xs font-body text-blue-500 hover:underline">Abrir no Looker Studio</a>
          </div>
          <iframe src={embedUrl} width="100%" height="600" frameBorder="0" style={{ border: 0 }} allowFullScreen loading="lazy" title={`Analytics ${type}`} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center mb-6">
          <Search size={48} className="text-foreground/10 mx-auto mb-4" />
          <p className="font-body text-foreground/40 mb-2">Nenhum dashboard configurado</p>
          <p className="font-body text-xs text-foreground/30 mb-6">Configure a URL do Looker Studio acima para visualizar as métricas aqui</p>
        </div>
      )}

      {/* Métricas manuais - placeholder cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(issite ? [
          { label: "Páginas populares", items: ["Home", "Tratamentos", "Resultados", "Contato", "Unidades"] },
          { label: "Origens de tráfego", items: ["Google Orgânico", "Instagram", "WhatsApp", "Direto", "Facebook"] },
          { label: "Dispositivos", items: ["Mobile 72%", "Desktop 23%", "Tablet 5%"] },
          { label: "Métricas chave", items: ["Sessões", "Usuários", "Taxa rejeição", "Duração média", "Páginas/sessão"] },
        ] : [
          { label: "Artigos populares", items: ["Quiet Beauty", "Canetas Emagrecedoras", "Queda Capilar", "Bioestimulador vs Preenchimento", "Skinimalism"] },
          { label: "Categorias", items: ["Bem-estar", "Bioestimulador", "Skincare", "Toxina Botulínica", "Harmonização"] },
          { label: "Origens do blog", items: ["Google Orgânico", "Instagram Bio", "WhatsApp", "Newsletter", "Direto"] },
          { label: "Engajamento", items: ["Tempo de leitura", "Scroll depth", "Compartilhamentos", "CTR no CTA", "Retorno"] },
        ]).map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
            <p className="font-body text-xs tracking-[0.1em] uppercase text-[#c9a96e] font-medium mb-3">{card.label}</p>
            <div className="space-y-2">
              {card.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]/30" />
                  <span className="font-body text-xs text-foreground/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* How to setup */}
      <div className={`rounded-xl border p-5 ${issite ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}`}>
        <p className={`font-body text-xs font-medium mb-3 ${issite ? "text-blue-700" : "text-green-700"}`}>Como configurar o dashboard completo</p>
        <div className={`font-body text-xs space-y-1.5 ${issite ? "text-blue-600/70" : "text-green-600/70"}`}>
          <p>1. Acesse <strong>analytics.google.com</strong> e crie uma propriedade GA4 para o site</p>
          <p>2. Copie o <strong>ID de medição</strong> (G-XXXXXXXXXX) e cole acima</p>
          <p>3. Para o dashboard visual, acesse <strong>lookerstudio.google.com</strong></p>
          <p>4. Crie um relatório conectado ao Google Analytics</p>
          <p>5. {issite ? "Adicione métricas: Sessões, Usuários, Páginas/sessão, Origens, Dispositivos" : "Adicione métricas filtradas por /blog/*: Artigos lidos, Tempo de leitura, Origens"}</p>
          <p>6. Clique em <strong>Compartilhar → Incorporar relatório</strong> e cole a URL acima</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// GOOGLE REVIEWS SECTION
// ═══════════════════════════════════════════════════════
const GOOGLE_REVIEW_LINK = "https://www.google.com/search?hl=en-BR&gl=br&q=Dra+Roberta+Castro+Dermatologia&ludocid=17061125954302208991#lrd=";

function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [editing, setEditing] = useState<GoogleReview | null>(null);
  const [form, setForm] = useState({ author_name: "", rating: 5, text: "", reply: "", review_date: new Date().toISOString().split("T")[0], unit_name: "Chácara Santo Antônio" });
  const [reqForm, setReqForm] = useState({ name: "", phone: "", unit: "Chácara Santo Antônio", procedure: "" });

  useEffect(() => { load(); }, []);
  async function load() { const { data } = await supabase.from("google_reviews").select("*").order("sort_order"); if (data) setReviews(data as GoogleReview[]); }

  function openNew() { setEditing(null); setForm({ author_name: "", rating: 5, text: "", reply: "", review_date: new Date().toISOString().split("T")[0], unit_name: "Chácara Santo Antônio" }); setShowForm(true); setShowRequest(false); }
  function openEdit(r: GoogleReview) { setEditing(r); setForm({ author_name: r.author_name, rating: r.rating, text: r.text, reply: r.reply, review_date: r.review_date, unit_name: r.unit_name }); setShowForm(true); setShowRequest(false); }
  function closeForm() { setEditing(null); setShowForm(false); setForm({ author_name: "", rating: 5, text: "", reply: "", review_date: "", unit_name: "Chácara Santo Antônio" }); }

  async function save() {
    if (!form.author_name || !form.text) { toast.error("Preencha nome e texto"); return; }
    if (editing) { await supabase.from("google_reviews").update(form).eq("id", editing.id); }
    else { await supabase.from("google_reviews").insert({ ...form, sort_order: reviews.length + 1 }); }
    toast.success("Salvo!"); closeForm(); load();
  }

  async function toggle(r: GoogleReview) { await supabase.from("google_reviews").update({ is_visible: !r.is_visible }).eq("id", r.id); load(); }
  async function remove(id: string) { if (!confirm("Excluir?")) return; await supabase.from("google_reviews").delete().eq("id", id); toast.success("Excluído"); load(); }

  function sendReviewRequest() {
    if (!reqForm.name || !reqForm.phone) { toast.error("Preencha nome e telefone"); return; }
    const digits = reqForm.phone.replace(/\D/g, "");
    const phone = digits.startsWith("55") ? digits : "55" + digits;
    const msg = `Olá, ${reqForm.name}! Aqui é do time de relacionamento da RP Golden Clinic. Tudo bem? Passando para saber como você está se sentindo após sua visita na nossa unidade ${reqForm.unit}${reqForm.procedure ? " para " + reqForm.procedure : ""}. Como foi sua experiência conosco?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("WhatsApp aberto");
    setReqForm({ name: "", phone: "", unit: "Chácara Santo Antônio", procedure: "" });
    setShowRequest(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Google Meu Negócio</h2>
          <p className="font-body text-sm text-foreground/40">{reviews.length} avaliações · Exibidas na página de Unidades</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowRequest(true); setShowForm(false); }} className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-green-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Solicitar Avaliação
          </button>
          <a href={GOOGLE_REVIEW_LINK} target="_blank" className="flex items-center gap-2 border border-blue-500 text-blue-600 px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-blue-50">
            <Globe size={14} /> Ver no Google
          </a>
          <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={14} /> Adicionar</button>
        </div>
      </div>

      {/* Request review via WhatsApp */}
      {showRequest && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm font-medium text-green-700">Solicitar avaliação no Google via WhatsApp</p>
            <button onClick={() => setShowRequest(false)} className="text-green-400"><X size={16} /></button>
          </div>
          <p className="font-body text-xs text-green-600/70">O paciente receberá uma mensagem perguntando sobre a experiência. Se positiva, envie o link do Google na sequência.</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-body text-xs text-green-700/70 mb-1 block">Nome do paciente *</label><input value={reqForm.name} onChange={e => setReqForm({ ...reqForm, name: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs text-green-700/70 mb-1 block">WhatsApp *</label><input value={reqForm.phone} onChange={e => setReqForm({ ...reqForm, phone: e.target.value })} className={inputClass} /></div>
          </div>
          <div><label className="font-body text-xs text-green-700/70 mb-1 block">Procedimento (opcional)</label><input value={reqForm.procedure} onChange={e => setReqForm({ ...reqForm, procedure: e.target.value })} placeholder="Ex: Bioestimuladores, Toxina..." className={inputClass} /></div>
          <div className="flex gap-3">
            <button onClick={sendReviewRequest} className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg text-xs font-medium">Enviar via WhatsApp</button>
            <button onClick={() => { navigator.clipboard.writeText(GOOGLE_REVIEW_LINK); toast.success("Link do Google copiado!"); }} className="flex items-center gap-2 border border-blue-300 text-blue-600 px-4 py-3 rounded-lg text-xs font-medium">Copiar link Google</button>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-4">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">{editing ? "Editar" : "Nova"} avaliação</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-body text-xs text-foreground/50 mb-1 block">Nome do autor *</label><input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-xs text-foreground/50 mb-1 block">Estrelas</label><select value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} className={inputClass}><option value={5}>5 estrelas</option><option value={4}>4 estrelas</option></select></div>
              <div><label className="font-body text-xs text-foreground/50 mb-1 block">Data</label><input type="date" value={form.review_date} onChange={e => setForm({ ...form, review_date: e.target.value })} className={inputClass} /></div>
            </div>
          </div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Texto da avaliação *</label><textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
          <div><label className="font-body text-xs text-foreground/50 mb-1 block">Resposta da clínica (opcional)</label><textarea value={form.reply} onChange={e => setForm({ ...form, reply: e.target.value })} rows={2} className={inputClass + " resize-none"} /></div>
          <div className="flex gap-3">
            <button onClick={save} className="bg-[#c9a96e] text-white px-4 py-3 rounded-lg text-xs font-medium"><Save size={14} /></button>
            <button onClick={closeForm} className="text-foreground/40 text-xs font-body">Cancelar</button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className={`bg-white rounded-xl border p-5 flex items-start gap-4 ${r.is_visible ? "border-[#c9a96e]/10" : "border-red-200 opacity-50"}`}>
            <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] font-display text-sm font-semibold flex-shrink-0">
              {r.author_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display text-sm font-semibold text-foreground">{r.author_name}</p>
                <div className="flex">{[...Array(r.rating)].map((_, i) => <Star key={i} size={11} className="text-yellow-500 fill-yellow-500" />)}</div>
                <span className="text-xs font-body text-foreground/30">{r.review_date}</span>
              </div>
              <p className="font-body text-xs text-foreground/60 leading-relaxed">"{r.text}"</p>
              {r.reply && <p className="font-body text-xs text-[#c9a96e] mt-2 italic">Resposta: {r.reply}</p>}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggle(r)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg">{r.is_visible ? <EyeOff size={14} className="text-foreground/40" /> : <Eye size={14} className="text-green-500" />}</button>
              <button onClick={() => openEdit(r)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg"><Edit3 size={14} className="text-[#c9a96e]" /></button>
              <button onClick={() => remove(r.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-5">
        <p className="font-body text-xs font-medium text-blue-700 mb-2">Fluxo de solicitação de avaliação</p>
        <div className="font-body text-xs text-blue-600/70 space-y-1">
          <p>1. Clique em "Solicitar Avaliação" e preencha os dados do paciente</p>
          <p>2. O WhatsApp abre com mensagem perguntando sobre a experiência</p>
          <p>3. Se o paciente responder positivamente, envie o link do Google (botão "Copiar link Google")</p>
          <p>4. Nunca envie o link na primeira mensagem — sempre filtre a satisfação antes</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// LEADS SECTION
// ═══════════════════════════════════════════════════════
function LeadsSection() {
  const [items, setItems] = useState<Lead[]>([]);
  useEffect(() => { load(); }, []);
  async function load() { const { data } = await supabase.from("site_leads").select("*").order("created_at", { ascending: false }); if (data) setItems(data); }
  async function remove(id: string) { if(!confirm("Excluir?")) return; await supabase.from("site_leads").delete().eq("id", id); toast.success("Excluido"); load(); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Leads do Site</h2>
          <p className="font-body text-sm text-foreground/40">{items.length} contatos recebidos</p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center">
          <Inbox size={48} className="text-foreground/10 mx-auto mb-4" />
          <p className="font-body text-foreground/40">Nenhum contato recebido ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(l => (
            <div key={l.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-display text-sm font-semibold text-foreground">{l.name}</p>
                    <span className="text-xs font-body bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-0.5 rounded-full">{l.service}</span>
                    <span className="text-xs font-body text-foreground/30">{l.source}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-body text-xs text-foreground/50">
                    <span>Tel: {l.phone}</span>
                    <span>Email: {l.email || "—"}</span>
                    <span>{new Date(l.created_at).toLocaleDateString("pt-BR")} {new Date(l.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {l.message && <p className="font-body text-xs text-foreground/40 mt-2 italic">"{l.message}"</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`https://wa.me/55${l.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-green-50 rounded-lg" title="Abrir WhatsApp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <button onClick={() => remove(l.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// RESULTS / GALLERY SECTION
// ═══════════════════════════════════════════════════════
function ResultsAdminSection({ uploading, upload }: { uploading: boolean; upload: (f:File)=>Promise<string|null> }) {
  const [items, setItems] = useState<ResultImage[]>([]);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() { const { data } = await supabase.from("site_results").select("*").order("sort_order"); if (data) setItems(data); }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingMultiple(true);
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} excede 5MB`); continue; }
      const url = await upload(file);
      if (url) {
        await supabase.from("site_results").insert({ image_url: url, alt_text: `Resultado ${items.length + count + 1}`, sort_order: items.length + count + 1 });
        count++;
      }
    }
    toast.success(`${count} imagem(ns) enviada(s)`);
    setUploadingMultiple(false);
    load();
    e.target.value = "";
  }

  async function toggle(item: ResultImage) {
    await supabase.from("site_results").update({ is_visible: !item.is_visible }).eq("id", item.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta imagem?")) return;
    await supabase.from("site_results").delete().eq("id", id);
    toast.success("Excluída");
    load();
  }

  async function updateAlt(id: string, alt: string) {
    await supabase.from("site_results").update({ alt_text: alt }).eq("id", id);
  }

  async function updateTreatment(id: string, treatment: string) {
    await supabase.from("site_results").update({ treatment }).eq("id", id);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Resultados</h2>
          <p className="font-body text-sm text-foreground/40">{items.length} imagens na galeria</p>
        </div>
        <label className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 cursor-pointer">
          {uploadingMultiple ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</> : <><Upload size={14} /> Upload Imagens</>}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Specifications */}
      <div className="bg-[#c9a96e]/5 rounded-xl border border-[#c9a96e]/10 p-5 mb-6">
        <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Especificações das imagens</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body text-xs text-foreground/50">
          <div className="bg-white rounded-lg p-3 border border-[#c9a96e]/10">
            <p className="font-medium text-foreground mb-1">Tamanho máximo</p>
            <p>5 MB por imagem</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#c9a96e]/10">
            <p className="font-medium text-foreground mb-1">Dimensão ideal</p>
            <p>800 x 1000 px (retrato)</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#c9a96e]/10">
            <p className="font-medium text-foreground mb-1">Formatos aceitos</p>
            <p>JPG, PNG, WebP</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#c9a96e]/10">
            <p className="font-medium text-foreground mb-1">Proporção</p>
            <p>4:5 (antes/depois)</p>
          </div>
        </div>
        <p className="font-body text-xs text-foreground/30 mt-3">As imagens são redimensionadas automaticamente para 1200px de largura máxima e comprimidas em JPEG 75% para otimizar o carregamento.</p>
      </div>

      {/* Gallery grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center">
          <Camera size={48} className="text-foreground/10 mx-auto mb-4" />
          <p className="font-body text-foreground/40 mb-2">Nenhuma imagem na galeria</p>
          <p className="font-body text-xs text-foreground/30">Faça upload de fotos de resultados usando o botão acima</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-xl border overflow-hidden ${item.is_visible ? "border-[#c9a96e]/10" : "border-red-200 opacity-50"}`}>
              <div className="aspect-[4/5] relative">
                <img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => toggle(item)} className={`w-7 h-7 rounded-full flex items-center justify-center ${item.is_visible ? "bg-green-500" : "bg-red-400"} text-white text-xs`}>
                    {item.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => remove(item.id)} className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <input
                  defaultValue={item.alt_text}
                  onBlur={e => updateAlt(item.id, e.target.value)}
                  className="w-full text-xs font-body border border-[#c9a96e]/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/30"
                  placeholder="Descrição da imagem"
                />
                <input
                  defaultValue={item.treatment}
                  onBlur={e => updateTreatment(item.id, e.target.value)}
                  className="w-full text-xs font-body border border-[#c9a96e]/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/30"
                  placeholder="Tratamento (ex: Bioestimuladores)"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// CONFIG SECTION (robots.txt + sitemap.xml)
// ═══════════════════════════════════════════════════════
function ConfigSection() {
  const [robotsTxt, setRobotsTxt] = useState("");
  const [sitemapXml, setSitemapXml] = useState("");
  const [loadingRobots, setLoadingRobots] = useState(true);
  const [loadingSitemap, setLoadingSitemap] = useState(true);
  const [savingRobots, setSavingRobots] = useState(false);
  const [savingSitemap, setSavingSitemap] = useState(false);
  const [privacyContent, setPrivacyContent] = useState("");
  const [privacyId, setPrivacyId] = useState("");
  const [privacyChecklist, setPrivacyChecklist] = useState<Record<string, boolean>>({});
  const [loadingPrivacy, setLoadingPrivacy] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [tab, setTab] = useState<"robots" | "sitemap" | "lgpd">("lgpd");

  useEffect(() => {
    fetch("/robots.txt").then(r => r.text()).then(t => { setRobotsTxt(t); setLoadingRobots(false); }).catch(() => setLoadingRobots(false));
    fetch("/sitemap.xml").then(r => r.text()).then(t => { if (t.startsWith("<?xml") || t.startsWith("<urlset")) { setSitemapXml(t); } else { setSitemapXml(""); } setLoadingSitemap(false); }).catch(() => setLoadingSitemap(false));
    supabase.from("site_privacy").select("*").limit(1).single().then(({ data }) => {
      if (data) { setPrivacyContent(data.content); setPrivacyId(data.id); setPrivacyChecklist(data.checklist || {}); }
      setLoadingPrivacy(false);
    });
  }, []);

  async function savePrivacy() {
    setSavingPrivacy(true);
    await supabase.from("site_privacy").update({ content: privacyContent, checklist: privacyChecklist, updated_at: new Date().toISOString() }).eq("id", privacyId);
    toast.success("Política de privacidade atualizada!");
    setSavingPrivacy(false);
  }

  const checklistItems: { key: string; label: string }[] = [
    { key: "info_coletadas", label: "Informações coletadas" },
    { key: "finalidade", label: "Finalidade do tratamento" },
    { key: "base_legal", label: "Base legal (consentimento, contrato, legítimo interesse)" },
    { key: "compartilhamento", label: "Compartilhamento com terceiros" },
    { key: "direitos_titular", label: "Direitos do titular (Art. 18)" },
    { key: "retencao", label: "Período de retenção" },
    { key: "cookies", label: "Política de cookies" },
    { key: "dpo", label: "Contato do DPO / Encarregado" },
    { key: "seguranca", label: "Segurança dos dados" },
    { key: "alteracoes", label: "Alterações na política" },
  ];

  async function saveRobots() {
    setSavingRobots(true);
    const blob = new Blob([robotsTxt], { type: "text/plain" });
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload("robots.txt", blob, { contentType: "text/plain", upsert: true });
    if (error) toast.error("Erro: " + error.message);
    else toast.success("robots.txt salvo no storage. Para aplicar no site, copie o conteudo e atualize o arquivo public/robots.txt no codigo-fonte e faca deploy.");
    setSavingRobots(false);
  }

  async function saveSitemap() {
    setSavingSitemap(true);
    const blob = new Blob([sitemapXml], { type: "application/xml" });
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload("sitemap.xml", blob, { contentType: "application/xml", upsert: true });
    if (error) toast.error("Erro: " + error.message);
    else toast.success("sitemap.xml salvo no storage. Para aplicar no site, copie o conteudo e atualize o arquivo public/sitemap.xml no codigo-fonte e faca deploy.");
    setSavingSitemap(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Configuracao</h2>
        <p className="font-body text-sm text-foreground/40">Visualize e edite robots.txt e sitemap.xml</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("lgpd")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "lgpd" ? "bg-white border border-[#c9a96e]/20 text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <Shield size={16} /> Política de Privacidade
        </button>
        <button onClick={() => setTab("robots")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "robots" ? "bg-white border border-[#c9a96e]/20 text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <FileCode size={16} /> robots.txt
        </button>
        <button onClick={() => setTab("sitemap")} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-body font-medium transition-all ${tab === "sitemap" ? "bg-white border border-[#c9a96e]/20 text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground"}`}>
          <Globe size={16} /> sitemap.xml
        </button>
      </div>

      {tab === "lgpd" && (
        <div className="space-y-6">
          {/* LGPD Info banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex items-start gap-3">
            <Shield size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-medium text-purple-700">Conformidade LGPD</p>
              <p className="font-body text-xs text-purple-600/70 mt-1">A política de privacidade deve conter: dados coletados, finalidade, base legal, compartilhamento, direitos do titular (LGPD Art. 18), retenção, cookies e contato do DPO. Mantenha atualizada conforme mudanças nos serviços.</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
            <p className="font-body text-sm font-medium text-foreground mb-4">Checklist LGPD</p>
            <div className="grid grid-cols-2 gap-3">
              {checklistItems.map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!privacyChecklist[item.key]}
                    onChange={() => setPrivacyChecklist({ ...privacyChecklist, [item.key]: !privacyChecklist[item.key] })}
                    className="w-4 h-4 rounded border-[#c9a96e]/30 text-[#c9a96e] focus:ring-[#c9a96e]/30"
                  />
                  <span className="font-body text-xs text-foreground/70">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">Conteúdo da Política</p>
                <p className="font-body text-xs text-foreground/40">Edite o texto da política de privacidade. Use Markdown (## para títulos, - para listas, **negrito**).</p>
              </div>
              <div className="flex items-center gap-3">
                <a href="/politica-de-privacidade" target="_blank" className="text-xs font-body text-[#c9a96e] hover:underline">Ver página</a>
              </div>
            </div>
            {loadingPrivacy ? (
              <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <textarea
                value={privacyContent}
                onChange={e => setPrivacyContent(e.target.value)}
                rows={25}
                className={inputClass + " font-mono text-xs leading-relaxed resize-y"}
              />
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="font-body text-xs text-foreground/30">{privacyContent.split("\n").length} linhas · {privacyContent.length} caracteres</p>
              <button onClick={savePrivacy} disabled={savingPrivacy} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {savingPrivacy ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          {/* Formatting reference */}
          <div className="bg-[#c9a96e]/5 rounded-xl border border-[#c9a96e]/10 p-6">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Formatação Markdown</p>
            <div className="font-body text-xs text-foreground/50 space-y-1.5">
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">## Título</code> — Título de seção (h2)</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">### Subtítulo</code> — Subtítulo (h3)</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">**texto**</code> — Negrito</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">- item</code> — Lista com marcadores</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">---</code> — Linha separadora</p>
            </div>
          </div>
        </div>
      )}

      {tab === "robots" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">robots.txt</p>
                <p className="font-body text-xs text-foreground/40">Controla quais paginas os bots podem rastrear. URL: /robots.txt</p>
              </div>
              <a href="/robots.txt" target="_blank" className="text-xs font-body text-[#c9a96e] hover:underline">Ver atual</a>
            </div>
            {loadingRobots ? (
              <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <textarea value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} rows={20} className={inputClass + " font-mono text-xs leading-relaxed resize-y"} />
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="font-body text-xs text-foreground/30">{robotsTxt.split("\n").length} linhas</p>
              <button onClick={saveRobots} disabled={savingRobots} className="flex items-center gap-2 bg-[#c9a96e] text-white px-4 py-2.5 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {savingRobots ? "Salvando..." : "Salvar backup"}
              </button>
            </div>
          </div>

          {/* Reference */}
          <div className="bg-[#c9a96e]/5 rounded-xl border border-[#c9a96e]/10 p-6">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Referencia rapida</p>
            <div className="font-body text-xs text-foreground/50 space-y-1.5">
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">User-agent: *</code> — Aplica regra para todos os bots</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">Allow: /</code> — Permite rastrear tudo</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">Disallow: /admin/</code> — Bloqueia rastreamento do admin</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">User-agent: GPTBot</code> — Regra especifica para o ChatGPT</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">Sitemap: https://...</code> — Informa a localizacao do sitemap</p>
            </div>
          </div>
        </div>
      )}

      {tab === "sitemap" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-body text-sm font-medium text-foreground">sitemap.xml</p>
                <p className="font-body text-xs text-foreground/40">Lista todas as URLs do site para o Google indexar. URL: /sitemap.xml</p>
              </div>
              <a href="/sitemap.xml" target="_blank" className="text-xs font-body text-[#c9a96e] hover:underline">Ver atual</a>
            </div>
            {loadingSitemap ? (
              <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <textarea value={sitemapXml} onChange={e => setSitemapXml(e.target.value)} rows={25} className={inputClass + " font-mono text-xs leading-relaxed resize-y"} />
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="font-body text-xs text-foreground/30">{sitemapXml ? sitemapXml.split("<url>").length - 1 + " URLs" : "Vazio"}</p>
              <button onClick={saveSitemap} disabled={savingSitemap} className="flex items-center gap-2 bg-[#c9a96e] text-white px-4 py-2.5 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {savingSitemap ? "Salvando..." : "Salvar backup"}
              </button>
            </div>
          </div>

          {/* Reference */}
          <div className="bg-[#c9a96e]/5 rounded-xl border border-[#c9a96e]/10 p-6">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Referencia rapida</p>
            <div className="font-body text-xs text-foreground/50 space-y-1.5">
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">&lt;url&gt;</code> — Define uma pagina</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">&lt;loc&gt;</code> — URL completa da pagina</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">&lt;changefreq&gt;</code> — Frequencia de atualizacao (daily, weekly, monthly)</p>
              <p><code className="bg-white px-1.5 py-0.5 rounded text-foreground/70">&lt;priority&gt;</code> — Importancia de 0.0 a 1.0 (home = 1.0)</p>
              <p>Apos editar, e necessario fazer deploy para aplicar as mudancas no site.</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// SEO SECTION
// ═══════════════════════════════════════════════════════
function SeoSection() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [editing, setEditing] = useState<SeoPage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() { const { data } = await supabase.from("site_seo").select("*").order("page_key"); if (data) setPages(data); }

  async function save() {
    if (!editing) return;
    setSaving(true);
    await supabase.from("site_seo").update({
      title: editing.title,
      description: editing.description,
      keywords: editing.keywords,
      og_image: editing.og_image,
      canonical_url: editing.canonical_url,
      schema_json: editing.schema_json,
      updated_at: new Date().toISOString(),
    }).eq("id", editing.id);
    toast.success("SEO atualizado para: " + editing.page_key);
    setSaving(false);
    setEditing(null);
    load();
  }

  async function addPage() {
    const key = prompt("Chave da pagina (ex: sobre, tratamentos/toxina):");
    if (!key) return;
    await supabase.from("site_seo").insert({ page_key: key, title: "", description: "", keywords: "", canonical_url: `https://express-my-value.vercel.app/${key}` });
    toast.success("Pagina adicionada");
    load();
  }

  async function removePage(id: string) {
    if (!confirm("Excluir esta pagina SEO?")) return;
    await supabase.from("site_seo").delete().eq("id", id);
    toast.success("Removida");
    load();
  }

  const pageLabels: Record<string, string> = {
    home: "Pagina Inicial",
    blog: "Blog",
    contato: "Contato",
    resultados: "Resultados",
    "golden-friends": "Golden Friends",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">SEO e Metadados</h2>
          <p className="font-body text-sm text-foreground/40">Configure titulo, descricao, keywords e Schema.org para cada pagina</p>
        </div>
        <button onClick={addPage} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90">
          <Plus size={14} /> Nova Pagina
        </button>
      </div>

      {/* Editing form */}
      {editing && (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium">Editando: {pageLabels[editing.page_key] || editing.page_key}</p>
            <button onClick={() => setEditing(null)} className="text-foreground/30 hover:text-foreground"><X size={16} /></button>
          </div>
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1 block">Titulo da Pagina (tag title + og:title)</label>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputClass} placeholder="RP Golden Clinic - Dermatologia Estetica" />
            <p className="font-body text-xs text-foreground/30 mt-1">{editing.title.length}/60 caracteres (ideal: 50-60)</p>
          </div>
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1 block">Meta Description (og:description)</label>
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputClass + " resize-none"} placeholder="Descricao da pagina para Google e redes sociais" />
            <p className="font-body text-xs text-foreground/30 mt-1">{editing.description.length}/160 caracteres (ideal: 120-160)</p>
          </div>
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1 block">Palavras-chave (separadas por virgula)</label>
            <input value={editing.keywords} onChange={e => setEditing({ ...editing, keywords: e.target.value })} className={inputClass} placeholder="dermatologista sao paulo, bioestimulador, preenchimento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs text-foreground/50 mb-1 block">URL Canonica</label>
              <input value={editing.canonical_url} onChange={e => setEditing({ ...editing, canonical_url: e.target.value })} className={inputClass} placeholder="https://express-my-value.vercel.app/" />
            </div>
            <div>
              <label className="font-body text-xs text-foreground/50 mb-1 block">Imagem OG (URL)</label>
              <input value={editing.og_image} onChange={e => setEditing({ ...editing, og_image: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="font-body text-xs text-foreground/50 mb-1 block">Schema.org JSON-LD (opcional - dados estruturados customizados)</label>
            <textarea value={editing.schema_json} onChange={e => setEditing({ ...editing, schema_json: e.target.value })} rows={6} className={inputClass + " resize-y font-mono text-xs"} placeholder='{"@context":"https://schema.org","@type":"MedicalBusiness",...}' />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#c9a96e] text-white px-5 py-3 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50">
              <Save size={14} /> {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setEditing(null)} className="text-foreground/40 text-xs font-body">Cancelar</button>
          </div>
        </div>
      )}

      {/* Pages list */}
      <div className="space-y-3">
        {pages.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-[#c9a96e]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">{pageLabels[p.page_key] || p.page_key}</p>
              <p className="font-body text-xs text-foreground/40 truncate">{p.title || "Sem titulo definido"}</p>
              <p className="font-body text-xs text-foreground/30 truncate mt-0.5">{p.description ? p.description.substring(0, 80) + "..." : "Sem descricao"}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {p.keywords && <span className="text-xs font-body text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Keywords</span>}
              {p.schema_json && <span className="text-xs font-body text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Schema</span>}
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-[#c9a96e]/10 rounded-lg"><Edit3 size={14} className="text-[#c9a96e]" /></button>
              <button onClick={() => removePage(p.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-[#c9a96e]/5 rounded-xl border border-[#c9a96e]/10 p-6">
        <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e] font-medium mb-3">Dicas de SEO</p>
        <div className="space-y-2 font-body text-xs text-foreground/50">
          <p>- <strong>Titulo:</strong> 50-60 caracteres. Inclua o nome da clinica e a palavra-chave principal.</p>
          <p>- <strong>Descricao:</strong> 120-160 caracteres. Descreva o conteudo da pagina de forma atraente.</p>
          <p>- <strong>Keywords:</strong> 5-10 palavras-chave separadas por virgula. Foque em termos que seus pacientes buscam.</p>
          <p>- <strong>Schema.org:</strong> Dados estruturados ajudam o Google a entender seu site. O schema MedicalBusiness ja esta configurado na home.</p>
          <p>- <strong>Imagem OG:</strong> Imagem que aparece quando o link e compartilhado. Tamanho ideal: 1200x630px.</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// GOLDEN FRIENDS / REFERRALS
// ═══════════════════════════════════════════════════════
function ReferralsSection() {
  const [items, setItems] = useState<Referral[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await supabase.from("golden_referrals").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("golden_referrals").update({ status }).eq("id", id);
    toast.success("Status atualizado");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta indicacao?")) return;
    await supabase.from("golden_referrals").delete().eq("id", id);
    toast.success("Excluido");
    load();
  }

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    quiz_sent: "bg-blue-50 text-blue-600",
    quiz_done: "bg-green-50 text-green-600",
    scheduled: "bg-amber-50 text-amber-600",
    converted: "bg-[#c9a96e]/10 text-[#c9a96e]",
  };
  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    quiz_sent: "Quiz enviado",
    quiz_done: "Quiz feito",
    scheduled: "Agendou",
    converted: "Convertido",
  };

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Golden Friends</h2>
          <p className="font-body text-sm text-foreground/40">{items.length} indicacoes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { key: "all", label: "Total", count: items.length },
          { key: "quiz_sent", label: "Quiz enviado", count: items.filter(i => i.status === "quiz_sent").length },
          { key: "quiz_done", label: "Quiz feito", count: items.filter(i => i.status === "quiz_done").length },
          { key: "scheduled", label: "Agendou", count: items.filter(i => i.status === "scheduled").length },
          { key: "converted", label: "Convertido", count: items.filter(i => i.status === "converted").length },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`rounded-xl border p-4 text-center transition-all ${filter === s.key ? "border-[#c9a96e] bg-[#c9a96e]/5" : "border-[#c9a96e]/10 bg-white"}`}>
            <p className="font-display text-2xl font-semibold text-foreground">{s.count}</p>
            <p className="font-body text-xs text-foreground/40">{s.label}</p>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center">
          <Users size={48} className="text-foreground/10 mx-auto mb-4" />
          <p className="font-body text-foreground/40">Nenhuma indicacao {filter !== "all" ? "com este status" : "ainda"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {r.referrer_name} <span className="font-body text-xs text-foreground/30 font-normal">indicou</span> {r.friend_name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-body ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[r.status] || r.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-body text-xs text-foreground/50">
                    <span>Tel: {r.referrer_phone}</span>
                    <span>Amigo: {r.friend_contact}</span>
                    <span>Faixa: {r.friend_age_range}</span>
                    <span>{new Date(r.created_at).toLocaleDateString("pt-BR")} {new Date(r.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {r.friend_email && <p className="font-body text-xs text-foreground/40 mt-1">Email indicado: {r.friend_email}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                    className="border border-[#c9a96e]/20 rounded-lg px-2 py-1.5 text-xs font-body bg-white focus:outline-none">
                    <option value="pending">Pendente</option>
                    <option value="quiz_sent">Quiz enviado</option>
                    <option value="quiz_done">Quiz feito</option>
                    <option value="scheduled">Agendou</option>
                    <option value="converted">Convertido</option>
                  </select>
                  <button onClick={() => remove(r.id)} className="p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// AI BLOG GENERATOR
// ═══════════════════════════════════════════════════════
function AIBlogGenerator({ onBack, onArticleGenerated }: { onBack: () => void; onArticleGenerated: (data: any) => void }) {
  const [aiTab, setAiTab] = useState<"article"|"image">("article");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgStyle, setImgStyle] = useState("clinical");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const imgStyles: Record<string, string> = {
    clinical: "Foto profissional de clinica dermatologica premium, ambiente sofisticado com tons dourados e creme, iluminacao suave e quente",
    treatment: "Close-up profissional de procedimento estetico dermatologico em clinica premium, tons dourados, ambiente elegante e acolhedor",
    lifestyle: "Retrato elegante de mulher com pele radiante e saudavel, estilo editorial de revista premium, tons quentes dourados e nude",
    skincare: "Flatlay elegante de produtos de skincare dermatologico premium, fundo creme com detalhes em dourado, minimalista e sofisticado",
    portrait: "Retrato profissional de dermatologista mulher em consultorio premium, jaleco branco, ambiente sofisticado com tons dourados",
  };
  const imgStyleLabels: Record<string, string> = {
    clinical: "Ambiente Clinico",
    treatment: "Procedimento",
    lifestyle: "Lifestyle/Beleza",
    skincare: "Produtos Skincare",
    portrait: "Retrato Profissional",
  };

  async function generateImage() {
    if (!imgPrompt) { toast.error("Descreva a imagem desejada"); return; }

    setGeneratingImg(true);
    setGeneratedImages([]);
    try {
      const brandPrompt = `${imgStyles[imgStyle] || imgStyles.clinical}. ${imgPrompt}.
Paleta de cores da marca: dourado #D4A574, creme #F8F6F0, marrom escuro #342723.
Tipografia serif elegante estilo Cormorant Garamond.
Estetica premium, sofisticada, dermatologia estetica de alto padrao.
Sem texto na imagem. Alta resolucao, aspecto ratio 16:9.`;

      const data: any = await geminiImage({
        contents: [{ parts: [{ text: `Generate an image: ${brandPrompt}` }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      });

      const images: string[] = [];

      if (data.candidates) {
        for (const candidate of data.candidates) {
          if (candidate.content?.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData?.data) {
                images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
              }
            }
          }
        }
      }

      if (images.length === 0) {
        toast.error("A API nao retornou imagens. Tente outro modelo ou prompt.");
      } else {
        setGeneratedImages(images);
        toast.success(`${images.length} imagem(ns) gerada(s)!`);
      }
    } catch (e: any) {
      toast.error("Erro: " + (e.message || "tente novamente").substring(0, 100));
    }
    setGeneratingImg(false);
  }

  async function uploadGeneratedImage(base64: string) {
    try {
      const res = await fetch(base64);
      const blob = await res.blob();
      const fn = `ai_${Date.now()}.png`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fn, blob, { contentType: blob.type, upsert: true });
      if (error) { toast.error("Erro ao salvar: " + error.message); return; }
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fn);
      navigator.clipboard.writeText(data.publicUrl);
      toast.success("Imagem salva no Supabase! URL copiada.");
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  }

  async function generate() {
    if (!topic) { toast.error("Informe o tema do artigo"); return; }

    setGenerating(true);
    try {
      const prompt = `Voce e a Dra. Roberta Castro Peres, CRM 160891, dermatologista e fundadora da RP Golden Clinic em Sao Paulo. Escreva um artigo completo para o blog da clinica sobre: "${topic}".
${keywords ? `Palavras-chave SEO: ${keywords}` : ""}

O artigo deve:
- Ser escrito em primeira pessoa como a Dra. Roberta
- Ter tom sofisticado, humanizado e acolhedor
- Incluir subtitulos com ## (h2) e ### (h3) em Markdown
- Incluir uma secao de Perguntas Frequentes (FAQ) com 3 perguntas
- Ter entre 800-1200 palavras
- Terminar com uma conclusao e CTA para agendar consulta

Responda APENAS em JSON valido com esta estrutura:
{"title":"titulo do artigo","slug":"slug-do-artigo","excerpt":"resumo em 2 frases","content":"conteudo completo em Markdown","category":"categoria (Toxina Botulinica, Bioestimulador, Preenchimento, Harmonizacao, Skincare ou Bem-estar)","read_time":5,"meta_description":"meta description para SEO","keyword":"palavra-chave principal","author":"Dra. Roberta Castro Peres"}`;

      const data = await claudeMessage({ messages: [{ role: "user", content: prompt }] });
      const text = data.content[0].text;

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta invalida da IA");

      const article = JSON.parse(jsonMatch[0]);
      toast.success("Artigo gerado com sucesso!");
      onArticleGenerated(article);
    } catch (e: any) {
      toast.error("Erro ao gerar: " + (e.message || "tente novamente").substring(0, 100));
    }
    setGenerating(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-foreground/40 font-body text-sm hover:text-foreground">
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-purple-50 rounded-xl p-1.5">
          <button onClick={()=>setAiTab("article")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-body font-medium transition-all ${aiTab==="article"?"bg-white text-purple-600 shadow-sm":"text-purple-400 hover:text-purple-600"}`}>
            <FileText size={16}/> Gerar Artigo
          </button>
          <button onClick={()=>setAiTab("image")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-body font-medium transition-all ${aiTab==="image"?"bg-white text-purple-600 shadow-sm":"text-purple-400 hover:text-purple-600"}`}>
            <ImageIcon size={16}/> Gerar Imagem
          </button>
        </div>

        {aiTab === "image" && (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={24} className="text-purple-600" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Gerador de Imagens com IA</h2>
              <p className="font-body text-sm text-foreground/50">Crie imagens para o blog seguindo a identidade visual da Golden Clinic.</p>
            </div>

            {/* How to use */}
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-purple-600 font-medium mb-4">Como usar</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0">1</div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Configure a chave Gemini</p>
                    <p className="font-body text-xs text-foreground/50">Acesse <strong>aistudio.google.com</strong>, clique em <strong>Get API Key</strong> e crie uma chave gratuita. Cole acima.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0">2</div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Escolha o estilo e descreva</p>
                    <p className="font-body text-xs text-foreground/50">Selecione um estilo visual e descreva o que deseja. A IA aplicara automaticamente as cores dourado/creme e a estetica premium da clinica.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0">3</div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Salve e use</p>
                    <p className="font-body text-xs text-foreground/50">Clique em "Salvar no Supabase" para armazenar a imagem. A URL sera copiada automaticamente. Use como capa dos artigos do blog.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generator */}
            <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Estilo da imagem</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(imgStyleLabels).map(([key, label]) => (
                    <button key={key} onClick={()=>setImgStyle(key)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-body transition-all ${imgStyle===key?"bg-purple-50 border-purple-400 text-purple-600":"border-[#c9a96e]/20 text-foreground/50 hover:border-purple-300"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Descreva a imagem</label>
                <textarea value={imgPrompt} onChange={e=>setImgPrompt(e.target.value)} rows={3}
                  placeholder="Ex: Mulher recebendo tratamento de bioestimuladores em consultorio elegante, expressao serena e confiante"
                  className={inputClass+" resize-none"}/>
              </div>
              <button onClick={generateImage} disabled={generatingImg}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {generatingImg ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Gerando imagem...</> : <><ImageIcon size={18}/> Gerar Imagem com IA</>}
              </button>
            </div>

            {/* Generated images */}
            {generatedImages.length > 0 && (
              <div className="mt-6 space-y-4">
                <p className="font-body text-xs tracking-[0.15em] uppercase text-purple-600 font-medium">Imagens geradas</p>
                {generatedImages.map((img, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#c9a96e]/10 p-4">
                    <img src={img} alt="Gerada por IA" className="w-full rounded-lg mb-3"/>
                    <div className="flex gap-2">
                      <button onClick={()=>uploadGeneratedImage(img)} className="flex-1 flex items-center justify-center gap-2 bg-[#c9a96e] text-white py-2.5 rounded-lg text-xs font-medium hover:opacity-90">
                        <Upload size={14}/> Salvar no Supabase
                      </button>
                      <a href={img} download={`golden-clinic-${Date.now()}.png`} className="flex items-center justify-center gap-2 border border-[#c9a96e]/30 text-foreground/60 px-4 py-2.5 rounded-lg text-xs font-medium hover:border-[#c9a96e]">
                        <Save size={14}/> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {aiTab === "article" && (<>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-purple-600" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Gerador de Artigos com IA</h2>
          <p className="font-body text-sm text-foreground/50">Digite um tema e a IA gera um artigo completo otimizado para SEO.</p>
        </div>

        {/* Orientacoes */}
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 mb-6">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-purple-600 font-medium mb-4">Como usar</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0 mt-0.5">1</div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Configure sua chave da API</p>
                <p className="font-body text-xs text-foreground/50">Na primeira vez, insira a chave da API Claude. Acesse <strong>console.anthropic.com</strong>, crie uma conta, va em <strong>API Keys</strong> e gere uma chave (comeca com <code className="bg-purple-50 px-1 rounded">sk-ant-...</code>). Cole no campo abaixo e clique Salvar. A chave fica armazenada apenas no seu navegador.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0 mt-0.5">2</div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Escolha o tema do artigo</p>
                <p className="font-body text-xs text-foreground/50">Escreva o assunto desejado. Quanto mais especifico, melhor o resultado. Ex: <em>"Beneficios do bioestimulador de colageno para mulheres acima de 40 anos"</em> gera um artigo mais direcionado do que apenas <em>"bioestimulador"</em>.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Adicione palavras-chave (opcional)</p>
                <p className="font-body text-xs text-foreground/50">Palavras-chave ajudam o artigo a aparecer no Google. Separe por virgula. Ex: <em>"bioestimulador colageno, rejuvenescimento facial, pele madura"</em>.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-display text-xs font-semibold flex-shrink-0 mt-0.5">4</div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Gere e revise</p>
                <p className="font-body text-xs text-foreground/50">Clique em <strong>Gerar Artigo com IA</strong>. A IA criara um artigo completo em nome da Dra. Roberta com titulo, resumo, conteudo, FAQ e SEO. O artigo abre automaticamente no editor para voce revisar, ajustar e publicar.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-body text-xs text-amber-700"><strong>Importante:</strong> Sempre revise o artigo antes de publicar. A IA gera o conteudo como rascunho. Verifique informacoes medicas, ajuste o tom e adicione uma imagem de capa antes de publicar.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5">
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-2 block">Tema do artigo</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ex: Beneficios do bioestimulador de colageno para pele madura" className={inputClass} />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-2 block">Palavras-chave (opcional)</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Ex: bioestimulador colageno, rejuvenescimento natural" className={inputClass} />
          </div>

          <button onClick={generate} disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {generating ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando artigo...</>
            ) : (
              <><Sparkles size={18} /> Gerar Artigo com IA</>
            )}
          </button>
        </div>
        </>)}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// BLOG SECTION (moved from original)
// ═══════════════════════════════════════════════════════
function BlogSection({ uploading, upload }: { uploading: boolean; upload: (f:File)=>Promise<string|null> }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [view, setView] = useState<"list"|"editor"|"ai">("list");
  const [editing, setEditing] = useState<Article|null>(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { title:"",slug:"",excerpt:"",content:"",category:categories[0],image_url:"",author:"Dra. Roberta Castro Peres",read_time:5,status:"draft",meta_description:"",keyword:"",featured:false,created_at:new Date().toISOString().split("T")[0],scheduled_at:"" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchArticles(); }, []);
  async function fetchArticles() { const {data}=await supabase.from("blog_articles").select("*").order("created_at",{ascending:false}); if(data) setArticles(data); }

  function handleNew() { setEditing(null); setForm({...emptyForm, created_at:new Date().toISOString().split("T")[0]}); setView("editor"); }
  function handleEdit(a: Article) { setEditing(a); setForm({title:a.title,slug:a.slug,excerpt:a.excerpt,content:a.content,category:a.category,image_url:a.image_url,author:a.author,read_time:a.read_time,status:a.status,meta_description:a.meta_description,keyword:a.keyword,featured:a.featured||false,created_at:a.created_at?a.created_at.split("T")[0]:new Date().toISOString().split("T")[0],scheduled_at:a.scheduled_at?a.scheduled_at.split("T")[0]:""}); setView("editor"); }
  async function handleDelete(id: string) { if(!confirm("Excluir?")) return; await supabase.from("blog_articles").delete().eq("id",id); toast.success("Excluido"); fetchArticles(); }
  async function handleToggle(a: Article) { const s=a.status==="published"?"draft":"published"; await supabase.from("blog_articles").update({status:s}).eq("id",a.id); toast.success(s==="published"?"Publicado":"Despublicado"); fetchArticles(); }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file) return;
    const url=await upload(file); if(url) setForm(f=>({...f,image_url:url}));
  }

  async function handleSave() {
    if(!form.title||!form.excerpt||!form.content) { toast.error("Preencha campos obrigatorios"); return; }
    setSaving(true);
    const slug=form.slug||slugify(form.title);
    const payload: Record<string, any> = {
      title: form.title, slug, excerpt: form.excerpt, content: form.content,
      category: form.category, image_url: form.image_url, author: form.author,
      read_time: form.read_time, status: form.status, meta_description: form.meta_description,
      keyword: form.keyword, featured: form.featured,
      updated_at: new Date().toISOString(),
      created_at: form.created_at ? form.created_at + "T10:00:00Z" : new Date().toISOString(),
      scheduled_at: form.scheduled_at ? form.scheduled_at + "T10:00:00Z" : null,
    };
    let err;
    if(editing) { const res = await supabase.from("blog_articles").update(payload).eq("id",editing.id); err = res.error; }
    else { const res = await supabase.from("blog_articles").insert(payload); err = res.error; }
    if (err) { toast.error("Erro ao salvar: " + err.message); setSaving(false); return; }
    toast.success(editing?"Atualizado":"Criado"); setSaving(false); setView("list"); fetchArticles();
  }

  // ── AI VIEW ──
  if (view === "ai") return <AIBlogGenerator onBack={() => setView("list")} onArticleGenerated={(data: any) => {
    setForm({ ...emptyForm, ...data, created_at: new Date().toISOString().split("T")[0] });
    setEditing(null);
    setView("editor");
  }} />;

  if (view === "editor") return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <button onClick={()=>setView("list")} className="flex items-center gap-2 text-foreground/40 font-body text-sm hover:text-foreground"><ArrowLeft size={16}/> Voltar</button>
        <div className="flex items-center gap-3">
          <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="border border-[#c9a96e]/20 rounded-lg px-3 py-2 text-xs font-body bg-white"><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="scheduled">Agendado</option></select>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50"><Save size={14}/> {saving?"Salvando...":"Salvar"}</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-5">
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Titulo *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value,slug:slugify(e.target.value)})} className={inputClass}/><p className="font-body text-xs text-foreground/30 mt-1">/blog/{form.slug||"..."}</p></div>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Resumo *</label><textarea value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} rows={3} className={inputClass+" resize-none"}/></div>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Conteudo *</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={18} className={inputClass+" resize-y font-mono text-xs leading-relaxed"}/></div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6">
            <label className="font-body text-xs text-foreground/50 mb-3 block">Imagem de Capa</label>
            {form.image_url ? (
              <div className="relative rounded-lg overflow-hidden mb-3"><img src={form.image_url} alt="" className="w-full h-40 object-cover"/><button onClick={()=>setForm({...form,image_url:""})} className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"><X size={12} className="text-white"/></button></div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#c9a96e]/20 rounded-lg cursor-pointer hover:border-[#c9a96e]/50 mb-3">
                {uploading ? <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin"/> : <><Upload size={24} className="text-foreground/20 mb-2"/><span className="font-body text-xs text-foreground/40">Clique para enviar</span></>}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
              </label>
            )}
          </div>
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-4">
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Categoria</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputClass}>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Tempo de leitura</label><input type="number" value={form.read_time} onChange={e=>setForm({...form,read_time:parseInt(e.target.value)||5})} className={inputClass}/></div>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Data de publicacao</label><input type="date" value={form.created_at} onChange={e=>setForm({...form,created_at:e.target.value})} className={inputClass}/></div>
            {form.status === "scheduled" && (
              <div>
                <label className="font-body text-xs text-foreground/50 mb-1.5 block">Agendar publicacao para</label>
                <input type="date" value={form.scheduled_at} onChange={e=>setForm({...form,scheduled_at:e.target.value})} className={inputClass} min={new Date().toISOString().split("T")[0]}/>
                <p className="font-body text-xs text-foreground/30 mt-1">O artigo sera publicado automaticamente nesta data</p>
              </div>
            )}
            <div onClick={()=>setForm({...form,featured:!form.featured})} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${form.featured?"bg-[#c9a96e]/10 border-[#c9a96e] text-[#c9a96e]":"bg-white border-[#c9a96e]/20 text-foreground/40"}`}>
              <Star size={16} fill={form.featured?"currentColor":"none"}/><span className="font-body text-sm">{form.featured?"Artigo destaque":"Marcar como destaque"}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-6 space-y-4">
            <p className="font-body text-xs tracking-[0.15em] uppercase text-[#c9a96e]">SEO</p>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Meta descricao</label><textarea value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} rows={2} className={inputClass+" resize-none"}/></div>
            <div><label className="font-body text-xs text-foreground/50 mb-1.5 block">Palavra-chave</label><input value={form.keyword} onChange={e=>setForm({...form,keyword:e.target.value})} className={inputClass}/></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const filteredArticles = statusFilter === "all" ? articles : articles.filter(a => a.status === statusFilter);
  const draftCount = articles.filter(a => a.status === "draft").length;
  const scheduledCount = articles.filter(a => a.status === "scheduled").length;
  const publishedCount = articles.filter(a => a.status === "published").length;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="font-display text-2xl font-semibold text-foreground">Artigos do Blog</h2><p className="font-body text-sm text-foreground/40">{articles.length} artigos</p></div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setView("ai")} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-3 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Sparkles size={16}/> IA Blog</button>
          <button onClick={handleNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-3 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={16}/> Novo Artigo</button>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: `Todos (${articles.length})`, color: "bg-foreground/5 text-foreground/60" },
          { key: "published", label: `Publicados (${publishedCount})`, color: "bg-green-50 text-green-600 border-green-200" },
          { key: "draft", label: `Rascunhos (${draftCount})`, color: "bg-amber-50 text-amber-600 border-amber-200" },
          { key: "scheduled", label: `Agendados (${scheduledCount})`, color: "bg-blue-50 text-blue-600 border-blue-200" },
        ].map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-body font-medium border transition-all ${statusFilter === f.key ? f.color + " border-current" : "border-transparent text-foreground/30 hover:text-foreground/50"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filteredArticles.length===0 ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center"><FileText size={48} className="text-foreground/10 mx-auto mb-4"/><p className="font-body text-foreground/40 mb-4">{statusFilter === "all" ? "Nenhum artigo" : `Nenhum artigo com status "${statusFilter}"`}</p><button onClick={handleNew} className="text-[#c9a96e] font-body text-sm">Criar artigo</button></div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map(a=>(
            <div key={a.id} className={`rounded-xl border p-5 flex items-center gap-4 ${a.status==="draft"?"bg-amber-50/30 border-amber-200/50":a.status==="scheduled"?"bg-blue-50/30 border-blue-200/50":"bg-white border-[#c9a96e]/10"}`}>
              <div className="w-16 h-16 rounded-lg bg-[#e8e0d6] overflow-hidden flex-shrink-0">{a.image_url?<img src={a.image_url} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-[#c9a96e]/30"/></div>}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold text-foreground truncate">{a.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-body text-foreground/40">{a.category}</span>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full ${a.status==="published"?"bg-green-50 text-green-600":a.status==="scheduled"?"bg-blue-50 text-blue-600":"bg-amber-50 text-amber-600"}`}>{a.status==="published"?"Publicado":a.status==="scheduled"?"Agendado":"Rascunho"}</span>
                  <span className="text-xs font-body text-foreground/30">{new Date(a.created_at).toLocaleDateString("pt-BR")}</span>
                  {a.featured && <Star size={12} className="text-[#c9a96e]" fill="currentColor"/>}
                  {(a as any).scheduled_at && <span className="text-xs font-body text-blue-500">Publica em {new Date((a as any).scheduled_at).toLocaleDateString("pt-BR")}</span>}
                </div>
              </div>
              <button onClick={()=>handleToggle(a)} className="p-2 rounded-lg hover:bg-[#c9a96e]/10">{a.status==="published"?<EyeOff size={16} className="text-foreground/40"/>:<Eye size={16} className="text-green-500"/>}</button>
              <button onClick={()=>handleEdit(a)} className="p-2 rounded-lg hover:bg-[#c9a96e]/10"><Edit3 size={16} className="text-[#c9a96e]"/></button>
              <button onClick={()=>handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={16} className="text-red-400"/></button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
