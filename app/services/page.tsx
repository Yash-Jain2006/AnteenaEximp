import type { Metadata } from "next";
import Image from "next/image";
import { Box, FileCheck2, Leaf, MessageSquareText, SearchCheck, Ship } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: "Export Services", description: "Sourcing, specification alignment, packing, documentation, and freight coordination for agricultural trade from India.", alternates: { canonical: "/services" } };

const services = [
  [Leaf, "Direct sourcing", "Product options are matched to your grade, season, volume, and destination requirements."],
  [SearchCheck, "Quality and specification", "Inspection scope, measurable tolerances, sampling, and available reports are agreed before order confirmation."],
  [Box, "Packing and labelling", "Bulk formats, inner liners, cartons, private labels, and destination marking are coordinated around the approved programme."],
  [FileCheck2, "Export documentation", "Commercial, origin, product, and transport documents are prepared against the applicable shipment requirements."],
  [Ship, "Freight coordination", "FCL, LCL, and air-freight requirements can be coordinated across suitable Indian ports and agreed Incoterms."],
  [MessageSquareText, "Responsive trade desk", "One clear contact route for samples, quotations, order updates, documentation questions, and follow-up."],
] as const;

export default function ServicesPage() {
  return <><PageHero current="Services" title="From requirement to dispatch, the process stays clear." description="Anteena Eximp coordinates the commercial and operational details that international agricultural buying programmes depend on." />
    <section className="page-section services-page"><div className="container services-page__intro"><div><h2>Structured around the way buyers work.</h2><p>Every programme starts with the product specification and destination—not a generic catalogue promise.</p></div><div className="services-page__image"><Image src="/images/about/sourcing-team.webp" alt="Sourcing and quality team reviewing fresh produce" fill sizes="(max-width: 900px) 100vw, 54vw" /></div></div>
    <div className="container services-page__list">{services.map(([Icon, title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon /><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>
    <section className="process-detail"><div className="container"><h2>How an inquiry moves forward</h2><ol>{["Share the requirement", "Clarify product and destination specification", "Review sample and quotation", "Confirm order and inspection plan", "Pack, document, and dispatch"].map((item, index) => <li key={item}><span>{index + 1}</span><strong>{item}</strong></li>)}</ol><ButtonLink href="/get-a-quote">Start an inquiry</ButtonLink></div></section></>;
}
