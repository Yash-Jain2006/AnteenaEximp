import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bulk Agricultural Products Quote India",
  description:
    "Request a bulk quote for Indian agricultural products with quantity, packing, destination, and shipping details. Anteena Eximp will respond.",
  path: "/get-a-quote",
  image: "/images/cta/commodities.webp",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        current="Get a Quote"
        title="A useful quotation starts with the right details."
        description="Complete the three short steps below. We will review product fit, specification, quantity, packing, destination, and shipping scope before responding."
      />
      <section className="page-section quote-page">
        <div className="container quote-layout">
          <Suspense fallback={<div className="form-card">Loading quote form...</div>}>
            <QuoteForm />
          </Suspense>
          <aside>
            <h2>What happens next?</h2>
            {[
              "Your requirement is reviewed for product and specification fit.",
              "Missing details are clarified before pricing.",
              "Available packing, documentation, and shipping scope are confirmed.",
              "A quotation or practical next step is shared by email.",
            ].map((item) => (
              <p key={item}>
                <CheckCircle2 />
                {item}
              </p>
            ))}
            <small>Product availability, price, lead time, and documentation are subject to written confirmation.</small>
          </aside>
        </div>
      </section>
    </>
  );
}
