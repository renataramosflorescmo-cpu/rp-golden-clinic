import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function PoliticaPrivacidade() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_privacy").select("content").limit(1).single().then(({ data }) => {
      if (data?.content) setContent(data.content);
      setLoading(false);
    });
  }, []);

  function renderMarkdown(text: string) {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) { elements.push(<br key={i} />); }
      else if (trimmed.startsWith("## ")) {
        elements.push(<h2 key={i} className="font-display text-xl font-semibold text-foreground mt-8 mb-3">{trimmed.replace("## ", "")}</h2>);
      } else if (trimmed.startsWith("### ")) {
        elements.push(<h3 key={i} className="font-display text-lg font-semibold text-foreground mt-6 mb-2">{trimmed.replace("### ", "")}</h3>);
      } else if (trimmed.startsWith("- ")) {
        elements.push(<li key={i} className="font-body text-sm font-light text-foreground/70 leading-relaxed ml-6 mb-1 list-disc">{trimmed.replace("- ", "")}</li>);
      } else if (trimmed === "---") {
        elements.push(<hr key={i} className="my-6 border-[#c9a96e]/20" />);
      } else {
        const parts = trimmed.split(/(\*\*.*?\*\*)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        );
        elements.push(<p key={i} className="font-body text-sm font-light text-foreground/70 leading-relaxed mb-2">{parts}</p>);
      }
    });
    return elements;
  }

  return (
    <div className="min-h-screen bg-[#faf7f4]">
      <Navbar />
      <div className="pt-20">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8">Política de Privacidade</h1>
          <p className="font-body text-xs text-foreground/40 mb-8">Última atualização: 08 de abril de 2026</p>
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-1">{renderMarkdown(content)}</div>
          )}
        </article>
      </div>
      <Footer />
    </div>
  );
}
