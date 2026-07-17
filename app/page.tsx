import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  FileCheck2,
  Leaf,
  MessageSquareText,
  SearchCheck,
  Ship,
  SlidersHorizontal,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueeTestimonials } from "@/components/testimonials/MarqueeTestimonials";
import { getFeaturedProducts } from "@/lib/cms/products";
import { getPublishedTestimonials } from "@/lib/cms/testimonials";
import { insights } from "@/lib/data/insights";
import { PRODUCT_CATEGORIES, SITE, categoryImage, whatsappUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

// force homepage hot-reload
const services = [
  ["01", "Direct sourcing", Leaf],
  ["02", "Quality & specification", SearchCheck],
  ["03", "Packing & labelling", Box],
  ["04", "Documentation", FileCheck2],
  ["05", "Freight coordination", Ship],
  ["06", "Responsive trade desk", MessageSquareText],
] as const;

const steps = ["Share requirement", "Confirm specification", "Sampling & quotation", "Inspection & packing", "Documentation & dispatch"];

export default async function Home() {
  const [featured, testimonials] = await Promise.all([getFeaturedProducts(3), getPublishedTestimonials()]);
  const trust = [
    ["Product specifications", "Detailed specifications shared and clarified upfront.", SlidersHorizontal],
    ["Quality documentation", "Required quality and compliance documents discussed before shipment.", FileCheck2],
    ["Packing options", "Bulk and buyer-defined packing solutions aligned to your needs.", Box],
    ["Shipping terms", "Freight scope, Incoterms, and delivery responsibilities explained clearly.", Ship],
  ] as const;

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1>India&apos;s finest agricultural products. Delivered with confidence.</h1>
          <p>
            Export-ready onion powder, garlic powder, chia seeds, spices, and requirement-based agricultural products sourced
            across India and coordinated for international trade.
          </p>
          <div className="button-row">
            <ButtonLink href="/products">Explore Products</ButtonLink>
            <ButtonLink href="/get-a-quote" variant="outline">
              Request a Quote
            </ButtonLink>
          </div>
          <div className="hero-proof">
            <span>
              <Leaf />
              Specification-led sourcing
            </span>
            <span>
              <FileCheck2 />
              Export documentation support
            </span>
            <span>
              <Box />
              Flexible packing & logistics
            </span>
          </div>
        </div>
        <div className="home-hero__media">
          <Image
            src="/images/hero/warehouse.webp"
            alt="Agricultural commodities arranged at an export warehouse"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="origin-strip">
        <div className="container origin-strip__inner">
          <h2>Sourced across India.</h2>
          <div>
            <span>Onion & garlic powders</span>
            <span>Chia seeds</span>
            <span>Indian spices</span>
            <span>Custom exports</span>
          </div>
        </div>
      </section>

      <section className="section product-feature">
        <div className="container">
          <Reveal className="section-heading section-heading--split">
            <div>
              <h2>
                Products selected
                <br />
                for global trade.
              </h2>
              <span className="gold-rule" />
            </div>
            <p>Explore our core export lines across dehydrated powders, chia seeds, Indian spices, and custom requirement-based sourcing.</p>
          </Reveal>
          <div className="product-feature__layout">
            <aside className="category-rail">
              {PRODUCT_CATEGORIES.map((category, index) => (
                <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className={index === 0 ? "is-active" : undefined}>
                  {category}
                  <ArrowRight size={16} />
                </Link>
              ))}
              <Link href="/products" className="category-rail__all">
                View all products <ArrowRight size={17} />
              </Link>
            </aside>
            <div className="editorial-products">
              {featured.map((item, index) => (
                <Reveal key={item.slug} className={`editorial-product editorial-product--${index + 1}`} delay={index * 0.08}>
                  <Link href={`/products/${item.slug}`}>
                    <div className="editorial-product__image">
                      <Image src={item.mainImage || categoryImage(item.category)} alt={`${item.name} ${item.category} for export from India`} fill sizes="(max-width: 800px) 100vw, 40vw" />
                    </div>
                    <span>
                      {item.name}
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <div className="featured-spec">
              <span>{featured[0].category}</span>
              <h3>{featured[0].name}</h3>
              <p>{featured[0].description}</p>
              <dl>
                <div>
                  <dt>Origin</dt>
                  <dd>{featured[0].origin}</dd>
                </div>
                <div>
                  <dt>Grades</dt>
                  <dd>{featured[0].grades.slice(0, 2).join(" / ")}</dd>
                </div>
                <div>
                  <dt>Packing</dt>
                  <dd>{featured[0].packaging}</dd>
                </div>
                <div>
                  <dt>Minimum order</dt>
                  <dd>{featured[0].minimumOrder}</dd>
                </div>
              </dl>
              <Link href={`/products/${featured[0].slug}`} className="text-link">
                View specifications <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services-showcase">
        <div className="services-showcase__content">
          <Reveal>
            <h2>From source to shipment, every detail coordinated.</h2>
            <p>We align product selection, quality checks, packing, documentation, and freight planning around your buying requirements.</p>
          </Reveal>
          <div className="service-list">
            {services.map(([number, title, Icon]) => (
              <div key={title}>
                <span>{number}</span>
                <Icon />
                <strong>{title}</strong>
              </div>
            ))}
          </div>
          <ButtonLink href="/services" variant="outline">
            Explore our services
          </ButtonLink>
        </div>
        <div className="services-showcase__media">
          <Image src="/images/about/sourcing-team.webp" alt="Export quality staff inspecting agricultural products" fill sizes="(max-width: 900px) 100vw, 52vw" />
        </div>
      </section>

      <section className="process-band">
        <div className="container">
          <h2>A clear route from inquiry to dispatch.</h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section trust-section">
        <div className="trust-section__media">
          <Image src="/images/about/quality-inspection.webp" alt="Quality specialist inspecting agricultural commodity samples" fill sizes="(max-width: 900px) 100vw, 42vw" />
        </div>
        <div className="trust-section__content">
          <Reveal>
            <h2>Trade decisions need clear information.</h2>
            <span className="gold-rule" />
            <p>Specifications, documentation, packing options, and destination requirements are discussed before order confirmation.</p>
          </Reveal>
          <div className="trust-list">
            {trust.map(([title, body, Icon]) => (
              <div key={title}>
                <Icon />
                <span>
                  <strong>{title}</strong>
                  <small>{body}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section insights-home">
        <div className="container">
          <div className="section-heading section-heading--split">
            <h2>
              Useful guidance for
              <br />
              international buyers.
            </h2>
            <ButtonLink href="/insights" variant="outline">
              Browse all insights
            </ButtonLink>
          </div>
          <div className="insights-home__grid">
            {insights.map((item, index) => (
              <article key={item.slug} className={index === 0 ? "insight-feature" : "insight-compact"}>
                <Link href={`/insights/${item.slug}`} className="insight-image">
                  <Image src={item.image} alt={item.title} fill sizes={index === 0 ? "60vw" : "30vw"} />
                </Link>
                <div>
                  <span>
                    {item.category} • {formatDate(item.date)}
                  </span>
                  <h3>
                    <Link href={`/insights/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.excerpt}</p>
                  <Link className="text-link" href={`/insights/${item.slug}`}>
                    Read guide <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTestimonials testimonials={testimonials} />

      <section className="quote-cta">
        <div className="quote-cta__content">
          <h2>
            Tell us what you
            <br />
            need to source.
          </h2>
          <p>Share the product, grade, quantity, destination, and packing requirements. We&apos;ll review the details and respond with the next steps.</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote">Request a Quote</ButtonLink>
            <a className="button button--light" href={whatsappUrl()} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </div>
        <div className="quote-cta__media">
          <Image src="/images/cta/commodities.webp" alt="Indian agricultural commodities and spices" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
      </section>
    </>
  );
}
