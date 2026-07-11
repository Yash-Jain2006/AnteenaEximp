export type InquiryStatus = "new" | "reviewing" | "replied" | "closed";

export interface ContactInquiryRow {
  id: number;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  source: string;
  ip_hash: string | null;
  user_agent: string | null;
}

export interface QuoteRequestRow {
  id: number;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  product_category: string;
  product_name: string;
  grade: string | null;
  quantity: string;
  unit: string;
  destination_port: string | null;
  incoterm: string | null;
  packaging: string | null;
  notes: string | null;
  status: InquiryStatus;
  source: string;
  ip_hash: string | null;
  user_agent: string | null;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface CmsProductRow {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: string;
  main_image: string;
  short_description: string;
  full_description: string;
  origin: string;
  moq: string;
  packaging: string;
  hs_code: string;
  seo_title: string;
  seo_description: string;
  featured: boolean;
  status: ProductStatus;
  display_order: number;
}

export interface CmsProductBadgeRow {
  id: number;
  product_id: number;
  label: string;
  display_order: number;
}

export interface CmsProductSpecificationRow {
  id: number;
  product_id: number;
  label: string;
  value: string;
  display_order: number;
}

export interface CmsProductApplicationRow {
  id: number;
  product_id: number;
  value: string;
  display_order: number;
}

export interface CmsProductGalleryImageRow {
  id: number;
  product_id: number;
  url: string;
  alt: string;
  display_order: number;
}

export interface CmsTestimonialRow {
  id: number;
  created_at: string;
  updated_at: string;
  customer_name: string;
  company: string;
  country: string;
  photo_url: string | null;
  product: string;
  review: string;
  rating: number;
  display_order: number;
  visible: boolean;
  featured: boolean;
}
