import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Anteena Eximp | Indian Agricultural Products for Global Trade", template: "%s | Anteena Eximp" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_IN", url: SITE.url, siteName: SITE.name, title: "Anteena Eximp | Agricultural Trade from India", description: SITE.description, images: [{ url: "/images/hero/warehouse.webp", width: 1536, height: 1024, alt: "Agricultural commodities prepared for export" }] },
  twitter: { card: "summary_large_image", title: "Anteena Eximp | Agricultural Trade from India", description: SITE.description, images: ["/images/hero/warehouse.webp"] },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    description: SITE.description,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
