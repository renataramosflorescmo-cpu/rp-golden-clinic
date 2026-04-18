import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SEO
        title="Página não encontrada | RP Golden Clinic"
        description="A página que você procura não existe ou foi removida. Volte ao site da RP Golden Clinic."
        path={location.pathname}
        noindex
      />
      <div className="text-center px-6">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Página não encontrada</p>
        <p className="mb-8 text-sm text-muted-foreground max-w-md">
          A página que você procura pode ter sido movida ou não existe mais.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/" className="text-primary underline hover:text-primary/90">
            Voltar ao início
          </a>
          <span className="text-muted-foreground">·</span>
          <a href="/blog" className="text-primary underline hover:text-primary/90">
            Ver blog
          </a>
          <span className="text-muted-foreground">·</span>
          <a href="/contato" className="text-primary underline hover:text-primary/90">
            Agendar consulta
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
