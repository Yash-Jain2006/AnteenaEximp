import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Handshake, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: "About", description: "Learn how Anteena Eximp approaches agricultural sourcing and international trade from India.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <><PageHero current="About" title="Rooted in India. Built for clear, dependable trade." description="Anteena Eximp connects agricultural sourcing in India with the specifications, communication, and coordination international buyers expect." />
    <section className="page-section about-story"><div className="container about-story__grid"><div><h2>A practical approach to agricultural trade.</h2><p>Our role is to translate buyer requirements into a workable sourcing and shipment programme. That means asking the right questions about grade, quantity, packing, destination rules, documentation, and delivery terms before commitments are made.</p><p>We believe long-term trade relationships are built through accurate information, written specifications, realistic timelines, and responsive follow-up.</p><ButtonLink href="/contact" variant="outline">Speak with the trade desk</ButtonLink></div><div className="about-story__image"><Image src="/images/about/quality-inspection.webp" alt="Agricultural commodity quality inspection" fill sizes="(max-width: 900px) 100vw, 50vw" /></div></div></section>
    <section className="principles"><div className="container"><article><Target /><h3>Our mission</h3><p>Make agricultural sourcing from India clearer and more dependable for international buyers.</p></article><article><Eye /><h3>Our vision</h3><p>Build a trusted trade platform defined by product knowledge, transparency, and consistent execution.</p></article><article><Handshake /><h3>Our values</h3><p>Clear specifications, honest communication, responsible sourcing, and long-term commercial relationships.</p></article></div></section>
    <section className="about-note"><div className="container"><h2>Documentation and registrations</h2><p>Registration numbers, quality certificates, and product-specific documents should be provided and verified during commercial discussions. We do not publish certification claims on this website until they are formally confirmed.</p></div></section></>;
}
