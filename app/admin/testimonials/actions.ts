"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCmsTestimonial,
  deleteCmsTestimonial,
  getAdminTestimonialById,
  updateCmsTestimonial,
  updateTestimonialDisplayOrder,
  type CmsTestimonialPayload,
} from "@/lib/cms/testimonials";
import { requireAdmin } from "@/lib/admin-auth";
import { testimonialAdminSchema } from "@/lib/validations";
import type { AdminActionState } from "@/app/admin/products/actions";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseId(value: FormDataEntryValue | null) {
  const id = typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid testimonial id.");
  return id;
}

function validationError(error: { flatten: () => { formErrors: string[]; fieldErrors: Record<string, string[] | undefined> } }) {
  const flattened = error.flatten();
  const fieldError = Object.values(flattened.fieldErrors).flat().find(Boolean);
  return fieldError || flattened.formErrors[0] || "Check the form fields and try again.";
}

function testimonialFormInput(formData: FormData) {
  return {
    customerName: text(formData, "customerName"),
    company: text(formData, "company"),
    country: text(formData, "country"),
    photoUrl: text(formData, "photoUrl"),
    product: text(formData, "product"),
    review: text(formData, "review"),
    rating: text(formData, "rating"),
    displayOrder: text(formData, "displayOrder"),
    visible: formData.get("visible") === "on",
    featured: formData.get("featured") === "on",
  };
}

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function saveTestimonialAction(id: string | null, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = testimonialAdminSchema.safeParse(testimonialFormInput(formData));

  if (!parsed.success) {
    return { error: validationError(parsed.error) };
  }

  const input = parsed.data;
  const row: CmsTestimonialPayload = {
    customer_name: input.customerName,
    company: input.company,
    country: input.country,
    photo_url: input.photoUrl || null,
    product: input.product,
    review: input.review,
    rating: input.rating,
    display_order: input.displayOrder,
    visible: input.visible,
    featured: input.featured,
  };

  try {
    if (id) {
      const testimonialId = Number(id);
      if (!Number.isInteger(testimonialId) || testimonialId <= 0) return { error: "Invalid testimonial id." };
      await updateCmsTestimonial(testimonialId, row);
    } else {
      await createCmsTestimonial(row);
    }
  } catch (error) {
    console.error("Failed to save testimonial:", error);
    return { error: "A database error occurred while saving the testimonial." };
  }

  revalidateTestimonials();
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();

  try {
    await deleteCmsTestimonial(parseId(formData.get("id")));
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    redirect(`/admin/testimonials?error=${encodeURIComponent("A database error occurred while deleting the testimonial.")}`);
  }

  revalidateTestimonials();
  redirect("/admin/testimonials?deleted=1");
}

export async function reorderTestimonialAction(formData: FormData) {
  await requireAdmin();

  try {
    const id = parseId(formData.get("id"));
    const displayOrder = Number(text(formData, "displayOrder"));
    if (!Number.isInteger(displayOrder) || displayOrder < 0) throw new Error("Invalid display order.");
    await updateTestimonialDisplayOrder(id, displayOrder);
  } catch (error) {
    console.error("Failed to reorder testimonial:", error);
    redirect(`/admin/testimonials?error=${encodeURIComponent("A database error occurred while reordering the testimonial.")}`);
  }

  revalidateTestimonials();
  redirect("/admin/testimonials?ordered=1");
}

export async function toggleTestimonialVisibilityAction(formData: FormData) {
  await requireAdmin();

  try {
    const id = parseId(formData.get("id"));
    const testimonial = await getAdminTestimonialById(String(id));
    if (!testimonial) throw new Error("Testimonial not found.");
    await updateCmsTestimonial(id, {
      customer_name: testimonial.customerName,
      company: testimonial.company,
      country: testimonial.country,
      photo_url: testimonial.photoUrl,
      product: testimonial.product,
      review: testimonial.review,
      rating: testimonial.rating,
      display_order: testimonial.displayOrder,
      visible: !testimonial.visible,
      featured: testimonial.featured,
    });
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    redirect(`/admin/testimonials?error=${encodeURIComponent("A database error occurred while updating the testimonial.")}`);
  }

  revalidateTestimonials();
  redirect("/admin/testimonials?updated=1");
}
