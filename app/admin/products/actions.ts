"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCmsProduct,
  deleteCmsProduct,
  getAdminProductById,
  updateCmsProduct,
  updateProductDisplayOrder,
  type CmsProductPayload,
  type ProductChildPayloads,
} from "@/lib/cms/products";
import { requireAdmin } from "@/lib/admin-auth";
import { productAdminSchema } from "@/lib/validations";

export type AdminActionState = {
  error?: string;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseId(value: FormDataEntryValue | null) {
  const id = typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid product id.");
  return id;
}

function validationError(error: { flatten: () => { formErrors: string[]; fieldErrors: Record<string, string[] | undefined> } }) {
  const flattened = error.flatten();
  const fieldError = Object.values(flattened.fieldErrors).flat().find(Boolean);
  return fieldError || flattened.formErrors[0] || "Check the form fields and try again.";
}

function revalidateProductPaths(...slugs: Array<string | undefined>) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  slugs.filter(Boolean).forEach((slug) => revalidatePath(`/products/${slug}`));
}

function productFormInput(formData: FormData) {
  return {
    title: text(formData, "title"),
    slug: text(formData, "slug"),
    category: text(formData, "category"),
    mainImage: text(formData, "mainImage"),
    shortDescription: text(formData, "shortDescription"),
    fullDescription: text(formData, "fullDescription"),
    origin: text(formData, "origin"),
    moq: text(formData, "moq"),
    packaging: text(formData, "packaging"),
    hsCode: text(formData, "hsCode"),
    seoTitle: text(formData, "seoTitle"),
    seoDescription: text(formData, "seoDescription"),
    featured: formData.get("featured") === "on",
    status: text(formData, "status"),
    displayOrder: text(formData, "displayOrder"),
    badges: text(formData, "badges") || "[]",
    specifications: text(formData, "specifications") || "[]",
    applications: text(formData, "applications") || "[]",
    galleryImages: text(formData, "galleryImages") || "[]",
  };
}

export async function saveProductAction(id: string | null, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = productAdminSchema.safeParse(productFormInput(formData));

  if (!parsed.success) {
    return { error: validationError(parsed.error) };
  }

  const input = parsed.data;
  const row: CmsProductPayload = {
    title: input.title,
    slug: input.slug,
    category: input.category,
    main_image: input.mainImage,
    short_description: input.shortDescription,
    full_description: input.fullDescription,
    origin: input.origin,
    moq: input.moq,
    packaging: input.packaging,
    hs_code: input.hsCode || "Confirmed during quotation",
    seo_title: input.seoTitle || input.title,
    seo_description: input.seoDescription || input.shortDescription,
    featured: input.featured,
    status: input.status,
    display_order: input.displayOrder,
  };
  const children: ProductChildPayloads = {
    badges: input.badges,
    specifications: input.specifications,
    applications: input.applications,
    galleryImages: input.galleryImages,
  };
  let oldSlug: string | undefined;

  try {
    if (id) {
      const productId = Number(id);
      if (!Number.isInteger(productId) || productId <= 0) return { error: "Invalid product id." };
      const existing = await getAdminProductById(id);
      oldSlug = existing?.slug;
      await updateCmsProduct(productId, row, children);
    } else {
      await createCmsProduct(row, children);
    }
  } catch (error) {
    console.error("Failed to save product:", error);
    return { error: "A database error occurred while saving the product." };
  }

  revalidateProductPaths(oldSlug, input.slug);
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  let slug: string | undefined;

  try {
    const id = parseId(formData.get("id"));
    const existing = await getAdminProductById(String(id));
    slug = existing?.slug;
    await deleteCmsProduct(id);
  } catch (error) {
    console.error("Failed to delete product:", error);
    redirect(`/admin/products?error=${encodeURIComponent("A database error occurred while deleting the product.")}`);
  }

  revalidateProductPaths(slug);
  redirect("/admin/products?deleted=1");
}

export async function reorderProductAction(formData: FormData) {
  await requireAdmin();

  try {
    const id = parseId(formData.get("id"));
    const displayOrder = Number(text(formData, "displayOrder"));
    if (!Number.isInteger(displayOrder) || displayOrder < 0) throw new Error("Invalid display order.");
    const existing = await getAdminProductById(String(id));
    await updateProductDisplayOrder(id, displayOrder);
    revalidateProductPaths(existing?.slug);
  } catch (error) {
    console.error("Failed to reorder product:", error);
    redirect(`/admin/products?error=${encodeURIComponent("A database error occurred while reordering the product.")}`);
  }

  redirect("/admin/products?ordered=1");
}
