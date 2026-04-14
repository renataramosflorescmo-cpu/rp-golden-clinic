import emailjs from "@emailjs/browser";

// ── CONFIGURAÇÃO EMAILJS ──────────────────────────────────────────────────────
// Para ativar o envio de e-mails:
// 1. Crie conta gratuita em https://www.emailjs.com
// 2. Crie um serviço de e-mail (Gmail, Outlook, etc.)
// 3. Crie um template com as variáveis abaixo
// 4. Substitua as constantes com seus IDs reais

export const EMAILJS_CONFIG = {
  serviceId: "service_rpgolden",      // <- substitua pelo seu Service ID
  templateId: "template_quiz_result", // <- substitua pelo seu Template ID
  publicKey: "SEU_PUBLIC_KEY",        // <- substitua pela sua Public Key
};

// Mapeamento de quiz para PDF
export const quizPdfMap: Record<string, { url: string; title: string }> = {
  adolescente: {
    url: `${window.location.origin}/guia-pele-adolescente.pdf`,
    title: "Guia de Pele para Adolescentes – RP Golden Clinic",
  },
  jovem: {
    url: `${window.location.origin}/guia-pele-jovem.pdf`,
    title: "Guia de Pele 18-29 Anos – RP Golden Clinic",
  },
  mais30: {
    url: `${window.location.origin}/guia-pele-adolescente.pdf`,
    title: "Guia de Pele 30+ – RP Golden Clinic",
  },
  mais50: {
    url: `${window.location.origin}/guia-pele-mais50.pdf`,
    title: "Guia de Pele 50+ – RP Golden Clinic",
  },
};

export interface EmailParams {
  to_email: string;
  to_name: string;
  quiz_type: string;
  guide_title: string;
  guide_url: string;
  result_title: string;
  result_body: string;
  cta: string;
}

export async function sendGuideEmail(params: EmailParams): Promise<boolean> {
  // Se não estiver configurado, simula envio em dev
  if (EMAILJS_CONFIG.publicKey === "SEU_PUBLIC_KEY") {
    console.warn("[EmailJS] Configuração pendente. Configure suas credenciais em src/lib/emailService.ts");
    return true; // simula sucesso para não bloquear o fluxo
  }

  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        quiz_type: params.quiz_type,
        guide_title: params.guide_title,
        guide_url: params.guide_url,
        result_title: params.result_title,
        result_body: params.result_body,
        cta: params.cta,
      },
      EMAILJS_CONFIG.publicKey
    );
    return true;
  } catch (err) {
    console.error("[EmailJS] Erro ao enviar:", err);
    return false;
  }
}
