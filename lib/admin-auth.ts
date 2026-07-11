import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminUser } from "@/lib/cms/types";
import { isAdminEmail } from "@/lib/admin";
import { createServerSupabaseClient, hasSupabasePublicConfig } from "@/lib/supabase/server";

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const isMockAdmin = cookieStore.get("sb-mock-admin")?.value === "true";

  if (isMockAdmin) {
    return { email: "anteenaeximp@gmail.com", source: "mock" };
  }

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
