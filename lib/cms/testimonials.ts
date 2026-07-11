import { cache } from "react";
import type { Testimonial } from "@/lib/cms/types";
import { fallbackTestimonials } from "@/lib/data/testimonials";
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

export function mapTestimonialRow(rowInput: unknown): Testimonial {
  const row = asRecord(rowInput);
  const id = asNumber(row.id);

  return {
    id: String(id),
    numericId: id,
    source: "cms",
    customerName: asString(row.customer_name),
    company: asString(row.company),
    country: asString(row.country),
    photoUrl: asString(row.photo_url) || null,
    product: asString(row.product),
    review: asString(row.review),
    rating: asNumber(row.rating, 5),
    displayOrder: asNumber(row.display_order),
    visible: asBoolean(row.visible, true),
    featured: asBoolean(row.featured),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

export const getPublishedTestimonials = cache(async (): Promise<Testimonial[]> => {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return fallbackTestimonials;

  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("*")
    .eq("visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data?.length) return fallbackTestimonials;
  return (data as unknown[]).map(mapTestimonialRow);
});

export async function getAllTestimonialsForAdmin(): Promise<Testimonial[] | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTestimonialRow);
}

export async function getAdminTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("cms_testimonials").select("*").eq("id", id).single();
  if (error || !data) return null;
  return mapTestimonialRow(data);
}

export type CmsTestimonialPayload = {
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
};

export async function createCmsTestimonial(row: CmsTestimonialPayload) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_testimonials").insert(row);
  if (error) throw new Error(error.message);
}

export async function updateCmsTestimonial(id: number, row: CmsTestimonialPayload) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_testimonials").update(row).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCmsTestimonial(id: number) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateTestimonialDisplayOrder(id: number, displayOrder: number) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Supabase service credentials are not configured.");
  const { error } = await supabase.from("cms_testimonials").update({ display_order: displayOrder }).eq("id", id);
  if (error) throw new Error(error.message);
}
