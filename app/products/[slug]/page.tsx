import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getProductBySlug, getPublishedProducts, getRelatedProducts } from "@/lib/cms/products";
import { SITE, whatsappUrl } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [product.image] },
  };
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http") ? product.image : `${SITE.url}${product.image}`,
    category: product.category,
    brand: { "@type": "Brand", name: SITE.name },
  };
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
              <Image src={product.image} alt={`${product.name} product category`} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
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
                  <Image src={image.url} alt={image.alt || product.name} fill sizes="(max-width: 800px) 100vw, 33vw" />
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
