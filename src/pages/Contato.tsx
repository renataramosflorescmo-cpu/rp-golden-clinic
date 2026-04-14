import { Mail, MapPin, Instagram, Handshake, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const WHATSAPP_URL =
  "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.+Vi+seu+perfil+no+site+e+me+interessei+muito.+Pode+me+ajudar%3F";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?sca_esv=18487c6ae7c08b5b&hl=en-BR&gl=br&sxsrf=ANbL-n6m-5THicZmCPqPRSW7hwXnXAPJ4Q:1774647791134&kgmid=/g/11t85qb5cy&shem=epsdc&shndl=30&kgs=4cc9190556c49a76&um=1&ie=UTF-8&fb=1&sa=X&geocode=KeFn3Yd3V86UMd9rYWapS8Xs&daddr=Rua+Lu%C3%ADs+Correia+de+Melo,+92+-+Ch%C3%A1cara+Santo+Ant%C3%B4nio,+S%C3%A3o+Paulo+-+SP,+04726-220";

const contactItems = [
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@drarobertacastro.com.br",
    href: "mailto:contato@drarobertacastro.com.br",
  },
  {
    icon: Instagram,
    title: "Redes Sociais",
    content: "@drarobertacastrodermatologia",
    href: "https://www.instagram.com/drarobertacastrodermatologia",
    external: true,
  },
  {
    icon: MapPin,
    title: "Sede",
    content: "Rua Luís Correia de Melo, 92 – Chácara Santo Antônio, São Paulo – SP, 04726-220",
    href: GOOGLE_MAPS_URL,
    external: true,
  },
  {
    icon: Handshake,
    title: "Imprensa e Parcerias",
    content: "marketing@drarobertacastro.com.br",
    href: "mailto:marketing@drarobertacastro.com.br",
  },
  {
    icon: CalendarCheck,
    title: "Representantes",
    content: "Agendar visita",
    href: WHATSAPP_URL,
    external: true,
  },
];

const Contato = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-wide">
          Contato
        </h1>
        <p className="text-foreground/50 font-body text-sm tracking-wide mb-12">
          Entre em contato conosco pelos canais abaixo
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Map embed */}
          <div className="rounded-md overflow-hidden border border-border aspect-[4/3]">
            <iframe
              title="Localização Golden Clinic"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.8!2d-46.6978!3d-23.6478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50f47e6c2e73%3A0x2e0b6e2d1f3a5c0a!2sR.%20Lu%C3%ADs%20Correia%20de%20Melo%2C%2092%20-%20Ch%C3%A1cara%20Santo%20Ant%C3%B4nio%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004726-220!5e0!3m2!1spt-BR!2sbr!4v1712700000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right — Contact info */}
          <div className="flex flex-col gap-6">
            {contactItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-4 bg-card border border-border rounded-md p-5 hover:border-primary/30 transition-colors"
              >
                <div className="bg-primary/10 rounded-full p-3 shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-foreground/60 group-hover:text-primary transition-colors leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
    <WhatsAppFAB />
  </div>
);

export default Contato;
