import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SedeChacaraSantoAntonio from "./pages/SedeChacaraSantoAntonio.tsx";
import Contato from "./pages/Contato.tsx";
import Resultados from "./pages/Resultados.tsx";
import ToxinaBotulinica from "./pages/ToxinaBotulinica.tsx";
import BioestimuladorColageno from "./pages/BioestimuladorColageno.tsx";
import EnzimasLipoliticas from "./pages/EnzimasLipoliticas.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sede-chacara-santo-antonio" element={<SedeChacaraSantoAntonio />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/tratamentos/toxina-botulinica" element={<ToxinaBotulinica />} />
          <Route path="/tratamentos/bioestimuladores-colageno" element={<BioestimuladorColageno />} />
          <Route path="/tratamentos/enzimas-lipoliticas" element={<EnzimasLipoliticas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
