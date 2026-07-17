import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getProductBySlug, getPublishedProducts, getRelatedProducts } from "@/lib/cms/products";
import { absoluteUrl, breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { SITE, whatsappUrl } from "@/lib/site";
import type { Product } from "@/lib/cms/types";

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return pageMetadata({
    title: productSeoTitle(product),
    description: productSeoDescription(product),
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

function productSeoTitle(product: Product) {
  const compact = `${product.name} Exporter India`;
  const full = `${product.name} Supplier and Exporter India`;
  return full.length + " | Anteena Eximp".length > 60 ? compact : full;
}

function productSeoDescription(product: Product) {
  if (product.category === "Uncategorized") {
    return "Request custom agricultural export products from Anteena Eximp. Review packing, MOQ, HS code, and buyer specifications. Contact our trade desk today.";
  }
  const category = product.category.toLowerCase();
  return `Request ${product.name} export details from Anteena Eximp. Review origin, packing, MOQ, HS code, and ${category} specifications. Contact our trade desk today.`;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = await getPublishedProducts();
  const product = allProducts.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, allProducts);
  const specifications = product.specifications.length
    ? product.specifications
    : [
        { label: "Typical sourcing regions", value: product.origin, displayOrder: 1 },
        { label: "Available grades", value: product.grades.join(", "), displayOrder: 2 },
        { label: "Packing", value: product.packaging, displayOrder: 3 },
        { label: "Minimum order", value: product.minimumOrder, displayOrder: 4 },
        { label: "HS code", value: product.hsCode, displayOrder: 5 },
        { label: "Payment and shipping", value: "Confirmed with quotation", displayOrder: 6 },
      ];
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    category: product.category,
    sku: product.slug,
    url: productUrl,
    brand: { "@type": "Brand", name: SITE.name },
    manufacturer: { "@type": "Organization", name: SITE.name, url: SITE.url },
    identifier: [{ "@type": "PropertyValue", propertyID: "HS Code", value: product.hsCode }],
    additionalProperty: [
      { "@type": "PropertyValue", name: "HS code", value: product.hsCode },
      { "@type": "PropertyValue", name: "Category", value: product.category },
      { "@type": "PropertyValue", name: "Origin", value: product.origin },
      { "@type": "PropertyValue", name: "Minimum order", value: product.minimumOrder },
      { "@type": "PropertyValue", name: "Packaging", value: product.packaging },
      ...specifications.slice(0, 6).map((specification) => ({
        "@type": "PropertyValue",
        name: specification.label,
        value: specification.value,
      })),
    ],
  };
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);
  const message = `Hello Anteena Eximp, I would like to inquire about ${product.name}.`;
  const quoteHref = `/get-a-quote?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`;

  return (
    <>
      <section className="product-detail-hero">
        <div className="container">
          <Link href="/products" className="back-link">
            <ArrowLeft size={16} /> All products
          </Link>
          <div className="product-detail-hero__grid">
            <div className="product-detail-image">
              <Image src={product.image} alt={`${product.name} ${product.category} for export from India`} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
            <div className="product-detail-summary">
              <span>{product.category}</span>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <div className="grade-list">
                <strong>Available badges</strong>
                {product.grades.map((grade) => (
                  <span key={grade}>
                    <CheckCircle2 size={15} />
                    {grade}
                  </span>
                ))}
              </div>
              <div className="button-row">
                <ButtonLink href={quoteHref}>Request a Quote</ButtonLink>
                <a className="button button--outline" href={whatsappUrl(message)} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  Chat about this product
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section product-spec-section">
        <div className="container product-spec-layout">
          <div>
            <h2>Product overview</h2>
            <p>{product.fullDescription || product.description}</p>
            {product.applications.length ? (
              <div className="application-list">
                <strong>Applications</strong>
                <ul>
                  {product.applications.map((application) => (
                    <li key={application.value}>{application.value}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p>Specifications shown on this page are indicative. The final product, tolerance, packing, documentation, and inspection plan are agreed in writing for each order.</p>
            <Link className="text-link" href={quoteHref}>
              <Download size={17} /> Request a specification sheet
            </Link>
          </div>
          <div>
            <h2>Indicative specifications</h2>
            <dl>
              {specifications.map((specification) => (
                <div key={specification.label}>
                  <dt>{specification.label}</dt>
                  <dd>{specification.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {product.galleryImages.length ? (
        <section className="product-gallery-section">
          <div className="container">
            <h2>Gallery</h2>
            <div className="product-gallery-grid">
              {product.galleryImages.map((image) => (
                <div className="product-gallery-image" key={`${image.url}-${image.displayOrder}`}>
                  <Image src={image.url} alt={image.alt || `${product.name} export product gallery image`} fill sizes="(max-width: 800px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="related-products">
          <div className="container">
            <h2>Related products</h2>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
    </>
  );
}
