import { cache } from "react";
import type {
  GalleryImage,
  Product,
  ProductApplication,
  ProductBadge,
  ProductSpecification,
  ProductStatus,
} from "@/lib/cms/types";
import { products as fallbackProducts } from "@/lib/data/products";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function sortByDisplayOrder<T extends { displayOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapBadges(row: Record<string, unknown>): ProductBadge[] {
  return sortByDisplayOrder(
    asArray(row.cms_product_badges).map((item, index) => ({
      id: asNumber(item.id, index + 1),
      label: asString(item.label),
      displayOrder: asNumber(item.display_order, index + 1),
    })).filter((item) => item.label),
  );
}

function mapSpecifications(row: Record<string, unknown>): ProductSpecification[] {
  return sortByDisplayOrder(
    asArray(row.cms_product_specifications).map((item, index) => ({
      id: asNumber(item.id, index + 1),
      label: asString(item.label),
      value: asString(item.value),
      displayOrder: asNumber(item.display_order, index + 1),
    })).filter((item) => item.label && item.value),
  );
}

function mapApplications(row: Record<string, unknown>): ProductApplication[] {
  return sortByDisplayOrder(
    asArray(row.cms_product_applications).map((item, index) => ({
      id: asNumber(item.id, index + 1),
      value: asString(item.value),
      displayOrder: asNumber(item.display_order, index + 1),
    })).filter((item) => item.value),
  );
}

function mapGallery(row: Record<string, unknown>): GalleryImage[] {
  return sortByDisplayOrder(
    asArray(row.cms_product_gallery_images).map((item, index) => ({
      id: asNumber(item.id, index + 1),
      url: asString(item.url),
      alt: asString(item.alt),
      displayOrder: asNumber(item.display_order, index + 1),
    })).filter((item) => item.url),
  );
}

export function mapProductRow(rowInput: unknown): Product {
  const row = asRecord(rowInput);
  const id = asNumber(row.id);
  const title = asString(row.title);
  const shortDescription = asString(row.short_description);
  const fullDescription = asString(row.full_description, shortDescription);
  const mainImage = asString(row.main_image, "/images/cta/commodities.webp");
  const badges = mapBadges(row);
  const specifications = mapSpecifications(row);

  return {
    id: String(id),
    numericId: id,
    source: "cms",
    slug: asString(row.slug),
    name: title,
    title,
    category: asString(row.category),
    image: mainImage,
    mainImage,
    galleryImages: mapGallery(row),
    origin: asString(row.origin),
    grades: badges.map((badge) => badge.label),
    badges,
    packaging: asString(row.packaging),
    minimumOrder: asString(row.moq),
    moq: asString(row.moq),
    hsCode: asString(row.hs_code, "Confirmed during quotation"),
    description: shortDescription,
    shortDescription,
    fullDescription,
    specs: specifications,
    specifications,
    applications: mapApplications(row),
    seoTitle: asString(row.seo_title, title),
    seoDescription: asString(row.seo_description, shortDescription),
    featured: asBoolean(row.featured),
    status: asString(row.status, "draft") as ProductStatus,
    displayOrder: asNumber(row.display_order),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

const productSelect = `
  *,
  cms_product_badges(*),
  cms_product_specifications(*),
  cms_product_applications(*),
  cms_product_gallery_images(*)
`;

async function fetchCmsProducts({ publishedOnly }: { publishedOnly: boolean }) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  let query = supabase
    .from("cms_products")
    .select(productSelect)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (publishedOnly) query = query.eq("status", "published");

  const { data, error } = await query;
  if (error || !data?.length) return null;
  return (data as unknown[]).map(mapProductRow);
}

export const getPublishedProducts = cache(async (): Promise<Product[]> => {
  return (await fetchCmsProducts({ publishedOnly: true })) ?? fallbackProducts;
});

export const getAllProductsForAdmin = cache(async (): Promise<Product[] | null> => {
  return await fetchCmsProducts({ publishedOnly: false });
});

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getPublishedProducts();
  const featured = products.filter((product) => product.featured).slice(0, limit);
  return featured.length ? featured : products.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getPublishedProducts();
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(current: Product, allProducts: Product[]) {
  return allProducts.filter((item) => item.category === current.category && item.slug !== current.slug).slice(0, 3);
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("cms_products").select(productSelect).eq("id", id).single();
  if (error || !data) return null;
  return mapProductRow(data);
}

export type CmsProductPayload = {
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
};

export type ProductChildPayloads = {
  badges: ProductBadge[];
  specifications: ProductSpecification[];
  applications: ProductApplication[];
  galleryImages: GalleryImage[];
};

export async function createCmsProduct(row: CmsProductPayload, children: ProductChildPayloads) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");

  const { data, error } = await supabase.from("cms_products").insert(row).select("id").single();
  if (error) throw new Error(error.message);
  const productId = asNumber(asRecord(data).id);
  await replaceProductChildren(productId, children);
  return productId;
}

export async function updateCmsProduct(id: number, row: CmsProductPayload, children: ProductChildPayloads) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");

  const { error } = await supabase.from("cms_products").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  await replaceProductChildren(id, children);
}

export async function deleteCmsProduct(id: number) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateProductDisplayOrder(id: number, displayOrder: number) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_products").update({ display_order: displayOrder }).eq("id", id);
  if (error) throw new Error(error.message);
}

async function replaceProductChildren(productId: number, children: ProductChildPayloads) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");

  await Promise.all([
    supabase.from("cms_product_badges").delete().eq("product_id", productId),
    supabase.from("cms_product_specifications").delete().eq("product_id", productId),
    supabase.from("cms_product_applications").delete().eq("product_id", productId),
    supabase.from("cms_product_gallery_images").delete().eq("product_id", productId),
  ]);

  const badgeRows = children.badges.map((item, index) => ({ product_id: productId, label: item.label, display_order: index + 1 }));
  const specRows = children.specifications.map((item, index) => ({ product_id: productId, label: item.label, value: item.value, display_order: index + 1 }));
  const applicationRows = children.applications.map((item, index) => ({ product_id: productId, value: item.value, display_order: index + 1 }));
  const galleryRows = children.galleryImages.map((item, index) => ({ product_id: productId, url: item.url, alt: item.alt, display_order: index + 1 }));

  if (badgeRows.length) {
    const { error } = await supabase.from("cms_product_badges").insert(badgeRows);
    if (error) throw new Error(error.message);
  }
  if (specRows.length) {
    const { error } = await supabase.from("cms_product_specifications").insert(specRows);
    if (error) throw new Error(error.message);
  }
  if (applicationRows.length) {
    const { error } = await supabase.from("cms_product_applications").insert(applicationRows);
    if (error) throw new Error(error.message);
  }
  if (galleryRows.length) {
    const { error } = await supabase.from("cms_product_gallery_images").insert(galleryRows);
    if (error) throw new Error(error.message);
  }
}
