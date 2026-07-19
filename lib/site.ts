export const SITE = {
  name: "Anteena Eximp",
  legalName: "Anteena Eximp",
  domain: "anteenaeximp.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.anteenaeximp.com",
  email: "anteenaeximp@gmail.com",
  businessEmail: "anteenaeximp@gmail.com",
  contactEmail: "divyanshtotla18@gmail.com",
  phone: "+91 93027 14134",
  whatsappNumber: "919302714134",
  location: "India",
  description: "Indian agricultural products for international trade, including onion powder, garlic powder, chia seeds, and spices.",
  contacts: [
    { name: "Divyansh Totla", phone: "+91 93027 14134", email: "divyanshtotla18@gmail.com" },
    { name: "Anil Totla", phone: "+91 88390 35380" },
  ],
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const PRODUCT_CATEGORIES = [
  "Dehydrated Powders",
  "Seeds",
  "Spices",
  "Uncategorized",
] as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  "Dehydrated Powders": "/images/categories/processed.webp",
  "Seeds": "/images/categories/oil-seeds.webp",
  "Spices": "/images/categories/spices.webp",
  "Uncategorized": "/images/cta/commodities.webp",
};

export function categoryImage(category: string) {
  return CATEGORY_IMAGES[category] ?? "/images/cta/commodities.webp";
}

export function whatsappUrl(message = "Hello Anteena Eximp, I would like to discuss an agricultural product inquiry.") {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || SITE.whatsappNumber).replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : "/contact";
}
