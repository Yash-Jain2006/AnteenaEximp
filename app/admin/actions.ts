"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient, hasSupabaseServiceConfig } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { InquiryStatus } from "@/lib/database.types";

export async function updateInquiryStatus(table: "contact_inquiries" | "quote_requests", id: number, status: InquiryStatus) {
  await requireAdmin();

  if (!hasSupabaseServiceConfig()) {
    return { error: "Supabase service not configured" };
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase!.from(table).update({ status }).eq("id", id);

  if (error) {
    console.error(`Failed to update ${table} status:`, error);
    return { error: error.message };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");

  return { success: true };
}
