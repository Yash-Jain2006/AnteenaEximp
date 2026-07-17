import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getInsight, insights } from "@/lib/data/insights";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return insights.map((item) => ({ slug: item.slug }));
}

function insightSeoTitle(slug: string, fallback: string) {
  const titles: Record<string, string> = {
    "evaluate-indian-agricultural-supplier": "Indian Agricultural Supplier Checklist",
    "grades-packing-minimum-orders": "Agricultural Grades and Packing Guide",
    "export-documentation-checklist": "Export Documentation Checklist India",
  };
  return titles[slug] ?? fallback;
}

function insightSeoDescription(slug: string) {
  const descriptions: Record<string, string> = {
    "evaluate-indian-agricultural-supplier": "Use this supplier evaluation checklist to review Indian agricultural specifications, documents, communication, and shipment readiness. Contact us today.",
    "grades-packing-minimum-orders": "Compare agricultural grades, packing options, and minimum orders before sourcing from India. Read the buyer guide and request a quote today.",
    "export-documentation-checklist": "Align commercial, origin, quality, and transport documents before an agricultural shipment from India. Read the checklist and contact us today.",
  };
  return descriptions[slug] ?? "Read Anteena Eximp guidance for agricultural export buyers and contact our trade desk for sourcing support today.";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getInsight((await params).slug);
  if (!item) return {};

  return pageMetadata({
    title: insightSeoTitle(item.slug, item.title),
    description: insightSeoDescription(item.slug),
    path: `/insights/${item.slug}`,
    image: item.image,
    type: "article",
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getInsight((await params).slug);
  if (!item) notFound();

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: item.title, path: `/insights/${item.slug}` },
  ]);

  return (
    <article className="article-page">
      <header className="article-header">
        <div className="container">
          <Link href="/insights" className="back-link">
            <ArrowLeft size={16} /> All insights
          </Link>
          <span>
            {item.category} · {formatDate(item.date)} · {item.readTime}
          </span>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
        </div>
      </header>
      <div className="article-cover container">
        <Image src={item.image} alt={`Agricultural export buyer guide: ${item.title}`} fill priority sizes="90vw" />
      </div>
      <div className="article-body">
        {item.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <aside>
          <strong>Planning a sourcing programme?</strong>
          <p>Share the product, specification, quantity, destination, and packing requirement with our trade desk.</p>
          <Link href="/get-a-quote">Request a quote</Link>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
    </article>
  );
}
