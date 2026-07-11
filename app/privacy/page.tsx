import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Anteena Eximp website inquiries and quote requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero current="Privacy" title="Privacy Policy" description="How Anteena Eximp handles website inquiry and quotation information." />
      <section className="article-body">
        <section>
          <h2>Information we collect</h2>
          <p>When you submit a contact or quote form, we collect the details you provide, such as name, company, email, phone, country, product requirement, quantity, packing, destination, and message content.</p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>We use this information to respond to inquiries, prepare quotations, clarify product specifications, coordinate trade communication, and maintain basic business records.</p>
        </section>
        <section>
          <h2>Sharing</h2>
          <p>Inquiry details may be shared with relevant sourcing, packing, documentation, inspection, logistics, or professional service partners only when required to evaluate or fulfil your request.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>For privacy-related questions, contact <a href={`mailto:${SITE.businessEmail}`}>{SITE.businessEmail}</a>.</p>
        </section>
      </section>
    </>
  );
}
