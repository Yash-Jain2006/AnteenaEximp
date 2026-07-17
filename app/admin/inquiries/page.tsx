import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceSupabaseClient, hasSupabaseServiceConfig } from "@/lib/supabase/server";
import type { ContactInquiryRow } from "@/lib/database.types";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries - Admin",
  robots: { index: false, follow: false },
};

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const initialId = params.id ? parseInt(params.id, 10) : null;
  let inquiries: ContactInquiryRow[] = [];
  
  if (hasSupabaseServiceConfig()) {
    const supabase = createServiceSupabaseClient();
    if (supabase) {
      const { data } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(50);
      inquiries = (data || []) as ContactInquiryRow[];
    }
  }


  return (
    <AdminShell title="Contact Inquiries" description="Manage and respond to website contact forms." adminEmail={admin.email}>
      <div className="mt-8">
        <InquiriesClient initialData={inquiries} initialId={initialId} />
      </div>
    </AdminShell>
  );
}
