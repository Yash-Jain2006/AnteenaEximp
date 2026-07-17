import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { jsonLd, organizationJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";
// force layout and globals.css rebuild


const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Agricultural Products Exporter India | Anteena Eximp", template: "%s | Anteena Eximp" },
  description:
    "Source onion powder, garlic powder, chia seeds, and Indian spices from Anteena Eximp. Explore export-ready agricultural products and request a quote.",
  keywords: ["agriculture exporter India", "spices exporter", "bulk grain supplier", "Anteena Eximp", "agricultural products", "global trade"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: "Agricultural Products Exporter India | Anteena Eximp",
    description:
      "Source onion powder, garlic powder, chia seeds, and Indian spices from Anteena Eximp. Explore export-ready agricultural products and request a quote.",
    images: [{ url: "/images/hero/warehouse.webp", width: 1536, height: 1024, alt: "Agricultural commodities prepared for export" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agricultural Products Exporter India | Anteena Eximp",
    description:
      "Source onion powder, garlic powder, chia seeds, and Indian spices from Anteena Eximp. Explore export-ready agricultural products and request a quote.",
    images: ["/images/hero/warehouse.webp"],
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd()) }} />
      </body>
    </html>
  );
}
