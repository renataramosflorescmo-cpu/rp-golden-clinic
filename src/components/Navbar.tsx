import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Resultados", href: "#resultados" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

const unidades = [
  { label: "Sede - Chácara Santo Antônio", href: "https://share.google/Xu72hrXSQAvgkFGBH" },
  { label: "Unidades credenciadas", href: "#contato" },
];

const WHATSAPP_URL = "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [unidadesOpen, setUnidadesOpen] = useState(false);
  const [mobileUnidadesOpen, setMobileUnidadesOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUnidadesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-[0.25em] uppercase text-foreground">
            Golden Clinic
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-body text-sm font-light tracking-wide text-foreground/60 hover:text-primary transition-colors uppercase">
                {l.label}
              </a>
            </li>
          ))}
          <li ref={dropdownRef} className="relative">
            <button
              onClick={() => setUnidadesOpen(!unidadesOpen)}
              className="font-body text-sm font-light tracking-wide text-foreground/60 hover:text-primary transition-colors uppercase flex items-center gap-1"
            >
              Unidades
              <ChevronDown size={14} className={`transition-transform ${unidadesOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {unidadesOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-3 bg-background border border-border rounded-sm shadow-lg min-w-[240px] py-2"
                >
                  {unidades.map((u) => (
                    <li key={u.label}>
                      <a
                        href={u.href}
                        target={u.href.startsWith("http") ? "_blank" : undefined}
                        rel={u.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        onClick={() => setUnidadesOpen(false)}
                        className="block px-4 py-2.5 font-body text-sm font-light text-foreground/70 hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        {u.label}
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

        <div className="hidden lg:flex items-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-gradient text-primary-foreground px-6 py-2.5 rounded-sm text-xs font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
          >
            Agendar
          </a>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="font-body text-sm tracking-wide uppercase text-foreground/70 hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setMobileUnidadesOpen(!mobileUnidadesOpen)}
                  className="font-body text-sm tracking-wide uppercase text-foreground/70 hover:text-primary flex items-center gap-1"
                >
                  Unidades
                  <ChevronDown size={14} className={`transition-transform ${mobileUnidadesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileUnidadesOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 flex flex-col gap-2 overflow-hidden"
                    >
                      {unidades.map((u) => (
                        <li key={u.label}>
                          <a
                            href={u.href}
                            target={u.href.startsWith("http") ? "_blank" : undefined}
                            rel={u.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(false)}
                            className="font-body text-sm font-light text-foreground/50 hover:text-primary transition-colors"
                          >
                            {u.label}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                  className="inline-flex bg-gold-gradient text-primary-foreground px-6 py-2.5 rounded-sm text-xs font-medium tracking-[0.15em] uppercase">
                  Agendar Consulta
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
