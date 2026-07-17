import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceSupabaseClient, hasSupabaseServiceConfig } from "@/lib/supabase/server";
import type { QuoteRequestRow } from "@/lib/database.types";
import QuotesClient from "./QuotesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quotes - Admin",
  robots: { index: false, follow: false },
};

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const initialId = params.id ? parseInt(params.id, 10) : null;
  let quotes: QuoteRequestRow[] = [];
  
  if (hasSupabaseServiceConfig()) {
    const supabase = createServiceSupabaseClient();
    if (supabase) {
      const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(50);
      quotes = (data || []) as QuoteRequestRow[];
    }
  }


  return (
    <AdminShell title="Quote Requests" description="Manage and respond to website product quotation requests." adminEmail={admin.email}>
      <div className="mt-8">
        <QuotesClient initialData={quotes} initialId={initialId} />
      </div>
    </AdminShell>
  );
}
