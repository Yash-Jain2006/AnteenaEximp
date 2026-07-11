export type ProductStatus = "draft" | "published" | "archived";

export interface ProductBadge {
  id?: number;
  label: string;
  displayOrder: number;
}

export interface ProductSpecification {
  id?: number;
  label: string;
  value: string;
  displayOrder: number;
}

export interface ProductApplication {
  id?: number;
  value: string;
  displayOrder: number;
}

export interface GalleryImage {
  id?: number;
  url: string;
  alt: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  numericId?: number;
  source: "fallback" | "cms";
  slug: string;
  name: string;
  title: string;
  category: string;
  image: string;
  mainImage: string;
  galleryImages: GalleryImage[];
  origin: string;
  grades: string[];
  badges: ProductBadge[];
  packaging: string;
  minimumOrder: string;
  moq: string;
  hsCode: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  specs: ProductSpecification[];
  specifications: ProductSpecification[];
  applications: ProductApplication[];
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: ProductStatus;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  numericId?: number;
  source: "fallback" | "cms";
  customerName: string;
  company: string;
  country: string;
  photoUrl: string | null;
  product: string;
  review: string;
  rating: number;
  displayOrder: number;
  visible: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  email: string;
  source: "mock" | "supabase";
}
