import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { supabase, getImageUrl } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string;
  author: string;
  read_time: number;
  created_at: string;
}

const categories = [
  "Todos",
  "Toxina Botulinica",
  "Bioestimulador",
  "Preenchimento",
  "Harmonizacao",
  "Skincare",
  "Bem-estar",
];

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const { data, error } = await supabase
      .from("blog_articles")
      .select("id, title, slug, excerpt, category, image_url, author, read_time, featured, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data) setArticles(data);
    setLoading(false);
  }

  const filtered = articles.filter((a) => {
    const matchCat = filter === "Todos" || a.category === filter;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a: any) => a.featured);
  const allArticles = filtered.filter((a) => a.id !== featured?.id);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#faf7f4]">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="relative bg-foreground text-primary-foreground pt-16 pb-14 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNjOWE5NmUiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0tNiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">
                Artigos & Conhecimento
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight mb-4">
                Nossa <em className="text-[#c9a96e]">Curadoria</em><br />de Conteudo
              </h1>
              <p className="font-body text-base font-light text-primary-foreground/60 max-w-lg mx-auto">
                Por Dra. Roberta Castro Peres - CRM 160891
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-6 border-b border-[#c9a96e]/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-body tracking-wide transition-all ${
                      filter === cat
                        ? "bg-[#c9a96e] text-white"
                        : "bg-white border border-[#c9a96e]/20 text-foreground/60 hover:border-[#c9a96e]/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar artigos..."
                  className="pl-9 pr-4 py-2.5 rounded-full border border-[#c9a96e]/20 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-body text-sm text-foreground/40">Carregando artigos...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-lg text-foreground/40 mb-2">Nenhum artigo encontrado</p>
                <p className="font-body text-sm text-foreground/30">Em breve teremos novos conteudos</p>
              </div>
            ) : (
              <>
                {/* Featured - centered, larger */}
                {featured && (
                  <Link to={`/blog/${featured.slug}`} className="block mb-8">
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-[#c9a96e]/10 overflow-hidden hover:shadow-lg transition-shadow max-w-2xl mx-auto"
                    >
                      <div className="h-56 bg-[#e8e0d6] relative overflow-hidden">
                        {featured.image_url ? (
                          <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c9a96e]/10 to-[#c9a96e]/5">
                            <span className="font-display text-5xl text-[#c9a96e]/20">RP</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-[#c9a96e] text-white text-xs px-3 py-1 rounded-full font-body">Destaque</span>
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-3 text-xs font-body text-foreground/40 mb-3">
                          <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(featured.created_at)}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {featured.read_time} min</span>
                          <span className="bg-white/90 text-[#c9a96e] text-xs px-2 py-0.5 rounded-full border border-[#c9a96e]/20">{featured.category}</span>
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-3 leading-tight">{featured.title}</h2>
                        <p className="font-body text-sm font-light text-foreground/50 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                        <span className="mt-4 inline-flex text-[#c9a96e] items-center gap-1 text-xs font-body">Ler artigo <ArrowRight size={14} /></span>
                      </div>
                    </motion.article>
                  </Link>
                )}

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allArticles.map((article, i) => (
                        <Link key={article.id} to={`/blog/${article.slug}`}>
                          <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-[#c9a96e]/10 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                          >
                            <div className="h-48 bg-[#e8e0d6] relative overflow-hidden">
                              {article.image_url ? (
                                <img
                                  src={article.image_url}
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c9a96e]/10 to-[#c9a96e]/5">
                                  <span className="font-display text-4xl text-[#c9a96e]/20">RP</span>
                                </div>
                              )}
                              <span className="absolute top-3 left-3 bg-white/90 text-[#c9a96e] text-xs px-3 py-1 rounded-full font-body">
                                {article.category}
                              </span>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 text-xs font-body text-foreground/40 mb-3">
                                <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(article.created_at)}</span>
                                <span className="flex items-center gap-1"><Clock size={11} /> {article.read_time} min</span>
                              </div>
                              <h3 className="font-display text-lg font-semibold text-foreground mb-2 leading-snug line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="font-body text-sm font-light text-foreground/50 leading-relaxed line-clamp-3 flex-1">
                                {article.excerpt}
                              </p>
                              <span className="mt-4 text-[#c9a96e] flex items-center gap-1 text-xs font-body">
                                Ler artigo <ArrowRight size={14} />
                              </span>
                            </div>
                          </motion.article>
                        </Link>
                      ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
