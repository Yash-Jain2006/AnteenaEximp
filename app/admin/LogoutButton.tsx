"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    document.cookie = "sb-mock-admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore Supabase errors during logout if not configured
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="button button--outline button--small" onClick={logout}>
      <LogOut size={16} /> Sign out
    </button>
  );
}
