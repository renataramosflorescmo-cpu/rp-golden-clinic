import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// Lazy-loaded pages (code splitting)
const SedeChacaraSantoAntonio = lazy(() => import("./pages/SedeChacaraSantoAntonio.tsx"));
const Contato = lazy(() => import("./pages/Contato.tsx"));
const Resultados = lazy(() => import("./pages/Resultados.tsx"));
const ToxinaBotulinica = lazy(() => import("./pages/ToxinaBotulinica.tsx"));
const BioestimuladorColageno = lazy(() => import("./pages/BioestimuladorColageno.tsx"));
const EnzimasLipoliticas = lazy(() => import("./pages/EnzimasLipoliticas.tsx"));
const PreenchimentoAcidoHialuronico = lazy(() => import("./pages/PreenchimentoAcidoHialuronico.tsx"));
const Profhilo = lazy(() => import("./pages/Profhilo.tsx"));
const PDRNPage = lazy(() => import("./pages/PDRN.tsx"));
const GoldenFriends = lazy(() => import("./pages/GoldenFriends.tsx"));
const QuizPage = lazy(() => import("./pages/QuizPage.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogArticle = lazy(() => import("./pages/BlogArticle.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade.tsx"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#faf7f4]">
    <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sede-chacara-santo-antonio" element={<SedeChacaraSantoAntonio />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/tratamentos/toxina-botulinica" element={<ToxinaBotulinica />} />
          <Route path="/tratamentos/bioestimuladores-colageno" element={<BioestimuladorColageno />} />
          <Route path="/tratamentos/enzimas-lipoliticas" element={<EnzimasLipoliticas />} />
          <Route path="/tratamentos/preenchimento-acido-hialuronico" element={<PreenchimentoAcidoHialuronico />} />
          <Route path="/tratamentos/profhilo" element={<Profhilo />} />
          <Route path="/tratamentos/pdrn" element={<PDRNPage />} />
          <Route path="/golden-friends" element={<GoldenFriends />} />
          <Route path="/golden-friends/quiz/:type" element={<QuizPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
