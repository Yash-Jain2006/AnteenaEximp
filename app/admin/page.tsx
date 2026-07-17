import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inbox, Mail, MessageSquareQuote, Phone } from "lucide-react";
import { AdminSetupNotice, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import type { ContactInquiryRow, QuoteRequestRow } from "@/lib/database.types";
import { createServiceSupabaseClient, hasSupabaseServiceConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  let contacts: ContactInquiryRow[] = [];
  let quotes: QuoteRequestRow[] = [];

  if (hasSupabaseServiceConfig()) {
    const service = createServiceSupabaseClient();
    const [contactsResult, quotesResult] = await Promise.all([
      service!.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(25),
      service!.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(25),
    ]);

    if (!contactsResult.error && !quotesResult.error) {
      contacts = (contactsResult.data || []) as ContactInquiryRow[];
      quotes = (quotesResult.data || []) as QuoteRequestRow[];
    } else {
      return (
        <AdminSetupNotice
          title="Dashboard data could not load"
          body={contactsResult.error?.message || quotesResult.error?.message || "Check that the Supabase schema has been applied."}
        />
      );
    }
  } else {
    return (
      <AdminSetupNotice
        title="Dashboard data needs Supabase service credentials"
        body="Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local and restart the server."
      />
    );
  }



  return (
    <AdminShell title="Inquiry Dashboard" description="Review contact inquiries and quote requests from the website." adminEmail={admin.email}>
      <div className="admin-stats">
        <Stat icon={<Inbox />} label="Contact inquiries" value={contacts.length} />
        <Stat icon={<MessageSquareQuote />} label="Quote requests" value={quotes.length} />
        <Stat icon={<Mail />} label="Business email" value="anteenaeximp@gmail.com" />
        <Stat icon={<Phone />} label="WhatsApp" value="+91 93027 14134" />
      </div>

      <div className="admin-panels mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/admin/inquiries" className="admin-panel hover:border-black transition-colors block border p-6 rounded-lg bg-white shadow-sm cursor-pointer">
          <h2 className="text-xl font-bold mb-2">View Contact Inquiries &rarr;</h2>
          <p className="text-gray-600 mb-4">Manage and respond to general messages and questions from website visitors.</p>
          <div className="text-sm font-medium">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">{contacts.filter(c => c.status === 'new').length} New</span>
            <span className="text-gray-500">{contacts.length} Total</span>
          </div>
        </a>

        <a href="/admin/quotes" className="admin-panel hover:border-black transition-colors block border p-6 rounded-lg bg-white shadow-sm cursor-pointer">
          <h2 className="text-xl font-bold mb-2">View Quote Requests &rarr;</h2>
          <p className="text-gray-600 mb-4">Manage detailed product inquiries, quantity requirements, and shipping specs.</p>
          <div className="text-sm font-medium">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">{quotes.filter(q => q.status === 'new').length} New</span>
            <span className="text-gray-500">{quotes.length} Total</span>
          </div>
        </a>
      </div>
    </AdminShell>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="admin-stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

