import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5511932110460?text=Ol%C3%A1%2C+Dra.+Roberta%21+Gostaria+de+agendar+uma+consulta.";

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,45%)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    aria-label="Abrir conversa no WhatsApp com a RP Golden Clinic"
  >
    <MessageCircle size={28} className="text-primary-foreground" aria-hidden="true" />
  </a>
);

export default WhatsAppFAB;
