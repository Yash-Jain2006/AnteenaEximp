import { redirect } from "next/navigation";
import type { AdminUser } from "@/lib/cms/types";
import { isAdminEmail } from "@/lib/admin";
import { createServerSupabaseClient, hasSupabasePublicConfig } from "@/lib/supabase/server";

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (!hasSupabasePublicConfig()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const email = data.user?.email;

  if (!email || !isAdminEmail(email)) {
    return null;
  }

  return { email, source: "supabase" };
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
