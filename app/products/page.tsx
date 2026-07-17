import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getPublishedProducts } from "@/lib/cms/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Agricultural Products Exporter India",
  description:
    "Browse onion powder, garlic powder, chia seeds, Indian spices, and custom agricultural export products from Anteena Eximp. Request a quote today.",
  path: "/products",
  image: "/images/cta/commodities.webp",
});

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
