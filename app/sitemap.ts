import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/cms/products";
import { insights } from "@/lib/data/insights";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/products", "/services", "/about", "/insights", "/contact", "/get-a-quote", "/privacy", "/terms"];
  const now = new Date();
  const products = await getPublishedProducts();

  return [
    ...staticRoutes.map((route) => ({ url: `${SITE.url}${route}`, lastModified: now })),
    ...products.map((product) => ({ url: `${SITE.url}/products/${product.slug}`, lastModified: now })),
    ...insights.map((insight) => ({ url: `${SITE.url}/insights/${insight.slug}`, lastModified: new Date(insight.date) })),
  ];
}
