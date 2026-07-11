import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { insights } from "@/lib/data/insights";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Insights", description: "Practical guidance for buyers sourcing agricultural products from India.", alternates: { canonical: "/insights" } };

export default function InsightsPage() {
  return <><PageHero current="Insights" title="Practical guidance for international buyers." description="Straightforward notes on supplier evaluation, specifications, packing, documentation, and agricultural trade planning." /><section className="page-section"><div className="container insight-list">{insights.map((item, index) => <article key={item.slug} className={index === 0 ? "is-featured" : undefined}><Link href={`/insights/${item.slug}`} className="insight-list__image"><Image src={item.image} alt="" fill sizes={index === 0 ? "70vw" : "40vw"} /></Link><div><span>{item.category} · {formatDate(item.date)} · {item.readTime}</span><h2><Link href={`/insights/${item.slug}`}>{item.title}</Link></h2><p>{item.excerpt}</p><Link className="text-link" href={`/insights/${item.slug}`}>Read the guide <ArrowRight size={16} /></Link></div></article>)}</div></section></>;
}
