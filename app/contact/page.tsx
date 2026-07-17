import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Timer, UserRound } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Agricultural Products Exporter India",
  description:
    "Contact Anteena Eximp for agricultural product sourcing, export specifications, documentation, and WhatsApp support. Send your inquiry today.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        current="Contact"
        title="Start with a clear requirement."
        description="Share your product, quantity, destination, packing, and timing. Our trade desk will review the information and respond with the next practical step."
      />
      <section className="page-section contact-page">
        <div className="container contact-layout">
          <aside>
            <h2>Get in touch</h2>
            <p>For detailed pricing, use the quote form. For general sourcing and documentation questions, send a message here.</p>
            <ul>
              <li><Mail /><span><small>Business email</small><a href={`mailto:${SITE.businessEmail}`}>{SITE.businessEmail}</a></span></li>

              <li><MessageCircle /><span><small>WhatsApp</small><a href={whatsappUrl()} target="_blank" rel="noreferrer">{SITE.phone}</a></span></li>
              {SITE.contacts.map((contact) => (
                <li key={contact.name}>
                  <UserRound />
                  <span>
                    <small>{contact.name}</small>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>

                  </span>
                </li>
              ))}

              <li><MapPin /><span><small>Location</small>{SITE.location}</span></li>
              <li><Timer /><span><small>Response</small>Usually within one business day</span></li>
            </ul>
          </aside>
          <div className="form-card"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
