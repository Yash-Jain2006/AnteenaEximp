import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getInsight, insights } from "@/lib/data/insights";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() { return insights.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getInsight((await params).slug); return item ? { title: item.title, description: item.excerpt, alternates: { canonical: `/insights/${item.slug}` }, openGraph: { images: [item.image] } } : {}; }

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getInsight((await params).slug); if (!item) notFound();
  return <article className="article-page"><header className="article-header"><div className="container"><Link href="/insights" className="back-link"><ArrowLeft size={16} /> All insights</Link><span>{item.category} · {formatDate(item.date)} · {item.readTime}</span><h1>{item.title}</h1><p>{item.excerpt}</p></div></header><div className="article-cover container"><Image src={item.image} alt="" fill priority sizes="90vw" /></div><div className="article-body">{item.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<aside><strong>Planning a sourcing programme?</strong><p>Share the product, specification, quantity, destination, and packing requirement with our trade desk.</p><Link href="/get-a-quote">Request a quote</Link></aside></div></article>;
}
