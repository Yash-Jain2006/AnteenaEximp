import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Anteena Eximp website content, product information, and inquiries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero current="Terms" title="Terms of Use" description="Website information is provided to support trade discussions and is not a final commercial offer." />
      <section className="article-body">
        <section>
          <h2>Indicative information</h2>
          <p>Product availability, grades, packing, pricing, documentation, lead times, and shipping terms shown on this website are indicative and subject to written confirmation.</p>
        </section>
        <section>
          <h2>Quotations and orders</h2>
          <p>No order is confirmed until product specification, price, payment terms, documentation, packing, and delivery scope are agreed in writing by the parties.</p>
        </section>
        <section>
          <h2>Product compliance</h2>
          <p>Buyers are responsible for confirming destination-market import rules, labelling, documentation, and product compliance requirements before order confirmation.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>For commercial questions, contact <a href={`mailto:${SITE.businessEmail}`}>{SITE.businessEmail}</a>.</p>
        </section>
      </section>
    </>
  );
}
