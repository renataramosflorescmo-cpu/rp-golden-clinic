import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, Trash2, Eye, EyeOff, LogOut, FileText, Upload, Save, ArrowLeft,
  Image as ImageIcon, X, Star, Home, User, MessageSquare, MapPin, Scissors, BookOpen, Heart, Users, Sparkles, Search, Globe, Settings, FileCode, Shield, Camera,
} from "lucide-react";
import { toast } from "sonner";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────
interface Article { id: string; title: string; slug: string; excerpt: string; content: string; category: string; image_url: string; author: string; read_time: number; status: string; meta_description: string; keyword: string; featured: boolean; scheduled_at: string | null; created_at: string; }
interface Testimonial { id: string; name: string; role: string; text: string; stars: number; sort_order: number; visible: boolean; }
interface Unit { id: string; name: string; address: string; phone: string; whatsapp: string; page_url: string; image_url: string; visible: boolean; sort_order: number; }
interface Treatment { id: string; title: string; short_description: string; slug: string; icon: string; image_url: string; visible: boolean; sort_order: number; }
interface HeroData { id: string; title: string; subtitle: string; cta_text: string; cta_link: string; image_url: string; }
interface AboutData { id: string; name: string; crm: string; title: string; description: string; badge_text: string; image_url: string; }

type Section = "blog" | "hero" | "about" | "testimonials" | "units" | "treatments" | "referrals" | "seo" | "config" | "results";
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
  const [section, setSection] = useState<Section>("blog");
  const { uploading, upload } = useImageUpload();

  useEffect(() => {
    if (sessionStorage.getItem("rp_admin") !== "true") { navigate("/admin/login"); }
  }, []);

  const sidebarItems: { key: Section; label: string; icon: any }[] = [
    { key: "hero", label: "Hero", icon: Home },
    { key: "about", label: "Sobre", icon: User },
    { key: "treatments", label: "Tratamentos", icon: Scissors },
    { key: "testimonials", label: "Depoimentos", icon: MessageSquare },
    { key: "results", label: "Resultados", icon: Camera },
    { key: "units", label: "Unidades", icon: MapPin },
    { key: "referrals", label: "Golden Friends", icon: Heart },
    { key: "seo", label: "SEO", icon: Globe },
    { key: "config", label: "Configuracao", icon: Settings },
    { key: "blog", label: "Blog", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f4] flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-56 bg-foreground flex flex-col z-50">
        <div className="px-5 py-5 border-b border-white/10">
          <h1 className="font-display text-sm font-semibold text-primary-foreground tracking-[0.15em] uppercase">Golden Clinic</h1>
          <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-[10px] px-2 py-0.5 rounded font-body mt-1 inline-block">Admin</span>
        </div>
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left font-body text-sm transition-colors ${
                section === item.key ? "bg-white/10 text-[#c9a96e]" : "text-primary-foreground/50 hover:text-primary-foreground/80"
              }`}>
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="block text-primary-foreground/40 text-xs font-body hover:text-[#c9a96e]">Ver site</a>
          <button onClick={() => { sessionStorage.removeItem("rp_admin"); navigate("/admin/login"); }} className="flex items-center gap-1 text-primary-foreground/40 text-xs font-body hover:text-red-400">
            <LogOut size={12} /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-56 flex-1 p-8">
        <AnimatePresence mode="wait">
          {section === "blog" && <BlogSection key="blog" uploading={uploading} upload={upload} />}
          {section === "hero" && <HeroSection key="hero" uploading={uploading} upload={upload} />}
          {section === "about" && <AboutSection key="about" uploading={uploading} upload={upload} />}
          {section === "testimonials" && <TestimonialsSection key="testimonials" />}
          {section === "units" && <UnitsSection key="units" />}
          {section === "treatments" && <TreatmentsSection key="treatments" uploading={uploading} upload={upload} />}
          {section === "results" && <ResultsAdminSection key="results" uploading={uploading} upload={upload} />}
          {section === "referrals" && <ReferralsSection key="referrals" />}
          {section === "seo" && <SeoSection key="seo" />}
          {section === "config" && <ConfigSection key="config" />}
        </AnimatePresence>
      </main>
    </div>
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
  const [apiKey, setApiKey] = useState(localStorage.getItem("rp_claude_key") || "");
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("rp_gemini_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem("rp_claude_key"));
  const [showGeminiKeyInput, setShowGeminiKeyInput] = useState(!localStorage.getItem("rp_gemini_key"));
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgStyle, setImgStyle] = useState("clinical");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  function saveKey() {
    localStorage.setItem("rp_claude_key", apiKey);
    setShowKeyInput(false);
    toast.success("Chave Claude salva");
  }
  function saveGeminiKey() {
    localStorage.setItem("rp_gemini_key", geminiKey);
    setShowGeminiKeyInput(false);
    toast.success("Chave Gemini salva");
  }

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
    if (!geminiKey) { toast.error("Configure a chave da API Gemini"); setShowGeminiKeyInput(true); return; }

    setGeneratingImg(true);
    setGeneratedImages([]);
    try {
      const brandPrompt = `${imgStyles[imgStyle] || imgStyles.clinical}. ${imgPrompt}.
Paleta de cores da marca: dourado #D4A574, creme #F8F6F0, marrom escuro #342723.
Tipografia serif elegante estilo Cormorant Garamond.
Estetica premium, sofisticada, dermatologia estetica de alto padrao.
Sem texto na imagem. Alta resolucao, aspecto ratio 16:9.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an image: ${brandPrompt}` }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err.substring(0, 150));
      }

      const data = await res.json();
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
    if (!apiKey) { toast.error("Configure a chave da API Claude"); setShowKeyInput(true); return; }

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

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const text = data.content[0].text;

      // Extract JSON from response
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

            {/* Gemini Key */}
            {showGeminiKeyInput && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                <p className="font-body text-xs text-purple-600 font-medium mb-3">Chave da API Google Gemini</p>
                <div className="flex gap-2">
                  <input value={geminiKey} onChange={e=>setGeminiKey(e.target.value)} placeholder="AIza..." className={inputClass+" flex-1"} type="password"/>
                  <button onClick={saveGeminiKey} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-medium">Salvar</button>
                </div>
                <p className="font-body text-xs text-purple-400 mt-2">Obtenha em aistudio.google.com → Get API Key. Gratuito.</p>
              </div>
            )}

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
              {!showGeminiKeyInput && (
                <button onClick={()=>setShowGeminiKeyInput(true)} className="w-full text-center text-xs font-body text-foreground/30 hover:text-purple-500">Alterar chave Gemini</button>
              )}
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

        {/* API Key config */}
        {showKeyInput && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
            <p className="font-body text-xs text-purple-600 font-medium mb-3">Chave da API Claude (Anthropic)</p>
            <div className="flex gap-2">
              <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." className={inputClass + " flex-1"} type="password" />
              <button onClick={saveKey} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-medium">Salvar</button>
            </div>
            <p className="font-body text-xs text-purple-400 mt-2">Obtenha em console.anthropic.com → API Keys. A chave fica salva apenas no seu navegador.</p>
          </div>
        )}

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

          {!showKeyInput && (
            <button onClick={() => setShowKeyInput(true)} className="w-full text-center text-xs font-body text-foreground/30 hover:text-purple-500">
              Alterar chave da API
            </button>
          )}
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

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="font-display text-2xl font-semibold text-foreground">Artigos do Blog</h2><p className="font-body text-sm text-foreground/40">{articles.length} artigos</p></div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setView("ai")} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-3 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Sparkles size={16}/> IA Blog</button>
          <button onClick={handleNew} className="flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-5 py-3 rounded-lg text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90"><Plus size={16}/> Novo Artigo</button>
        </div>
      </div>
      {articles.length===0 ? (
        <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-12 text-center"><FileText size={48} className="text-foreground/10 mx-auto mb-4"/><p className="font-body text-foreground/40 mb-4">Nenhum artigo</p><button onClick={handleNew} className="text-[#c9a96e] font-body text-sm">Criar primeiro artigo</button></div>
      ) : (
        <div className="space-y-3">
          {articles.map(a=>(
            <div key={a.id} className="bg-white rounded-xl border border-[#c9a96e]/10 p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-[#e8e0d6] overflow-hidden flex-shrink-0">{a.image_url?<img src={a.image_url} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-[#c9a96e]/30"/></div>}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold text-foreground truncate">{a.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-body text-foreground/40">{a.category}</span>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full ${a.status==="published"?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{a.status==="published"?"Publicado":"Rascunho"}</span>
                  <span className="text-xs font-body text-foreground/30">{new Date(a.created_at).toLocaleDateString("pt-BR")}</span>
                  {a.featured && <Star size={12} className="text-[#c9a96e]" fill="currentColor"/>}
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
