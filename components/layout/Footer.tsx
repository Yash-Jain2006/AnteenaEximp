import Link from "next/link";
import { BrandMark } from "@/components/brand/Logo";
import { NAV_ITEMS, PRODUCT_CATEGORIES, SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  const socials = [
    ["LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL],
    ["Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL],
    ["Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const whatsappHref = whatsappUrl();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <BrandMark />
          <p>Indian agricultural products for international trade.</p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          {socials.length ? (
            <div className="social-links">
              {socials.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h3>Company</h3>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Products</h3>
          {PRODUCT_CATEGORIES.slice(0, 4).map((category) => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </div>
        <div>
          <h3>Trade Desk</h3>
          <Link href="/get-a-quote">Request a Quote</Link>
          <a href={whatsappHref} target={whatsappHref.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            WhatsApp
          </a>
          <Link href="/admin/login">Admin Login</Link>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} Anteena Eximp. All rights reserved.</span>
        <span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
