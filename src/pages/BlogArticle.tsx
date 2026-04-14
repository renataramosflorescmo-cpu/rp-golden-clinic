import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Link2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  read_time: number;
  meta_description: string;
  created_at: string;
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchArticle(slug);
  }, [slug]);

  async function fetchArticle(s: string) {
    const { data, error } = await supabase
      .from("blog_articles")
      .select("*")
      .eq("slug", s)
      .eq("status", "published")
      .single();

    if (!error && data) setArticle(data);
    setLoading(false);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function renderContent(content: string) {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<br key={i} />);
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="font-display text-xl font-semibold text-foreground mt-8 mb-3">
            {trimmed.replace("### ", "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("- ")) {
        elements.push(
          <li key={i} className="font-body text-base font-light text-foreground/70 leading-relaxed ml-4 mb-2 list-disc">
            {trimmed.replace("- ", "")}
          </li>
        );
      } else if (trimmed === "---") {
        elements.push(<hr key={i} className="my-8 border-[#c9a96e]/20" />);
      } else {
        elements.push(
          <p key={i} className="font-body text-base font-light text-foreground/70 leading-relaxed mb-4">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  }

  function getShareUrl() { return window.location.href; }
  function getShareText() { return article?.title || ""; }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText() + " " + getShareUrl())}`, "_blank");
  }
  function shareEmail() {
    window.open(`mailto:?subject=${encodeURIComponent(getShareText())}&body=${encodeURIComponent("Leia este artigo: " + getShareUrl())}`, "_blank");
  }
  function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, "_blank");
  }
  function shareTikTok() {
    navigator.clipboard.writeText(getShareUrl());
    alert("Link copiado! Cole no TikTok para compartilhar.");
  }
  function shareInstagram() {
    navigator.clipboard.writeText(getShareUrl());
    alert("Link copiado! Cole no Instagram Stories para compartilhar.");
  }
  function copyLink() {
    navigator.clipboard.writeText(getShareUrl());
    alert("Link copiado!");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f4]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#faf7f4]">
        <Navbar />
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">Artigo nao encontrado</h1>
          <p className="font-body text-foreground/50 mb-8">O artigo que voce procura nao existe ou foi removido.</p>
          <Link to="/blog" className="text-[#c9a96e] font-body text-sm flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar ao blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f4]">
      <Navbar />
      <div className="pt-20">
        {/* Hero Image */}
        {article.image_url && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Back */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#c9a96e] font-body text-xs tracking-wide mb-8 hover:opacity-70 transition-opacity">
              <ArrowLeft size={14} /> Voltar ao blog
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-body text-foreground/40 mb-4">
              <span className="bg-[#c9a96e]/10 text-[#c9a96e] px-3 py-1 rounded-full">{article.category}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(article.created_at)}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.read_time} min de leitura</span>
              <button onClick={copyLink} className="ml-auto flex items-center gap-1 text-foreground/30 hover:text-[#c9a96e] transition-colors">
                <Link2 size={14} /> Copiar link
              </button>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="font-body text-lg font-light text-foreground/60 leading-relaxed mb-10 border-l-2 border-[#c9a96e] pl-6">
              {article.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-10 pb-8 border-b border-[#c9a96e]/10">
              <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] font-display text-lg font-semibold">
                R
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{article.author}</p>
                <p className="font-body text-xs text-foreground/40">Fundadora e Diretora Clinica da RP Golden Clinic</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose-golden">{renderContent(article.content)}</div>

            {/* Share buttons */}
            <div className="mt-10 pt-8 border-t border-[#c9a96e]/10">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-4">Compartilhe este artigo</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={shareWhatsApp} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-body font-medium hover:bg-[#25D366]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <button onClick={shareFacebook} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] text-xs font-body font-medium hover:bg-[#1877F2]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
                <button onClick={shareEmail} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground/5 text-foreground/60 text-xs font-body font-medium hover:bg-foreground/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                  E-mail
                </button>
                <button onClick={shareInstagram} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E4405F]/10 text-[#E4405F] text-xs font-body font-medium hover:bg-[#E4405F]/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </button>
                <button onClick={shareTikTok} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground/5 text-foreground/60 text-xs font-body font-medium hover:bg-foreground/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86-4.43V7.56a8.16 8.16 0 005.58 2.18V6.29a4.85 4.85 0 01-.01.4z"/></svg>
                  TikTok
                </button>
                <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c9a96e]/10 text-[#c9a96e] text-xs font-body font-medium hover:bg-[#c9a96e]/20 transition-colors">
                  <Link2 size={14} />
                  Copiar link
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 bg-foreground rounded-2xl p-8 md:p-10 text-center">
              <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-3">
                Gostou do conteudo?
              </h3>
              <p className="font-body text-sm font-light text-primary-foreground/60 mb-6 max-w-md mx-auto">
                Agende uma avaliacao com a Dra. Roberta e descubra o tratamento ideal para voce.
              </p>
              <a
                href="https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Li+um+artigo+no+blog+e+gostaria+de+agendar+uma+consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white px-8 py-4 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                Agendar consulta
              </a>
            </div>
          </motion.div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
