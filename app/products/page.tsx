import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getPublishedProducts } from "@/lib/cms/products";

export const metadata: Metadata = {
  title: "Agricultural Products",
  description: "Explore onion powder, garlic powder, chia seeds, Indian spices, and custom requirement agricultural exports from Anteena Eximp.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = await getPublishedProducts();

  return (
    <>
      <PageHero current="Products" title="Agricultural products prepared around your requirements." description="Browse onion powder, garlic powder, chia seeds, and Indian spices. Final availability and specifications are confirmed during quotation." />
      <section className="page-section"><div className="container"><ProductCatalog products={products} initialCategory={category || "All"} /></div></section>
    </>
  );
}
