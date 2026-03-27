import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#servicos" },
  { label: "Resultados", href: "#resultados" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Agendar", href: "#agendamento" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#hero" className="font-display text-2xl font-bold text-primary">
          Vitale<span className="text-accent">.</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#agendamento"
          className="hidden md:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Agende sua Avaliação
        </a>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-body text-base text-foreground/80 hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#agendamento"
                  onClick={() => setOpen(false)}
                  className="inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  Agende sua Avaliação
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
