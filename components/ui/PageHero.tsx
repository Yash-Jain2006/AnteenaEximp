import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({ title, description, current }: { title: string; description: string; current: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={14} /><span>{current}</span></div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
