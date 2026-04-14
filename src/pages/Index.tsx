import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ResultsSection from "@/components/ResultsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import SchedulingSection from "@/components/SchedulingSection";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("rp_cookie_accepted")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("rp_cookie_accepted", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground text-primary-foreground/80 px-6 py-4 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs leading-relaxed text-center sm:text-left">
          Nós utilizamos cookies para personalizar anúncios e melhorar a sua experiência no site. Ao continuar navegando, você concorda com a nossa política de privacidade.
        </p>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={accept}
            className="bg-white text-foreground px-6 py-2 rounded-full text-xs font-body font-medium hover:bg-white/90 transition-colors"
          >
            OK
          </button>
          <Link
            to="/politica-de-privacidade"
            className="text-[#c9a96e] text-xs font-body hover:underline whitespace-nowrap"
          >
            Saiba Mais
          </Link>
        </div>
      </div>
    </div>
  );
}

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <ResultsSection />
    <TestimonialsSection />
    <FAQSection />
    <SchedulingSection />
    <Footer />
    <WhatsAppFAB />
    <CookieBanner />
  </div>
);

export default Index;
