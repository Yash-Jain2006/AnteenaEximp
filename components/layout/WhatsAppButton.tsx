import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppButton() {
  const href = whatsappUrl();
  return (
    <a className="whatsapp-button" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label="Chat with Anteena Eximp on WhatsApp">
      <MessageCircle aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
