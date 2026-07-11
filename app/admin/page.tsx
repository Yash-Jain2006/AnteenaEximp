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
    } else if (admin.source !== "mock") {
      return (
        <AdminSetupNotice
          title="Dashboard data could not load"
          body={contactsResult.error?.message || quotesResult.error?.message || "Check that the Supabase schema has been applied."}
        />
      );
    }
  } else if (admin.source !== "mock") {
    return (
      <AdminSetupNotice
        title="Dashboard data needs Supabase service credentials"
        body="Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local and restart the server."
      />
    );
  }

  if (admin.source === "mock" && contacts.length === 0 && quotes.length === 0) {
    contacts = [
      {
        id: 1,
        created_at: "2026-07-09T06:00:00.000Z",
        name: "Suresh Patel",
        subject: "Bulk Onion Powder sourcing inquiry",
        email: "suresh.patel@agroglobal.in",
        phone: "+91 98765 43210",
        country: "India",
        company: "AgroGlobal Exports",
        message: "We need 50 tons of dehydrated pink onion powder. Please provide the specification sheet and FOB Mumbai pricing.",
        status: "new",
        source: "mock",
        ip_hash: null,
        user_agent: null,
      },
      {
        id: 2,
        created_at: "2026-07-09T02:00:00.000Z",
        name: "Emma Watson",
        subject: "Chia seeds certificate of analysis request",
        email: "emma@purefoods.co.uk",
        phone: "+44 20 7946 0958",
        country: "United Kingdom",
        company: "Pure Foods UK Ltd",
        message: "Hello, we are interested in importing your organic chia seeds. Could you send over the latest COA and pest control report?",
        status: "new",
        source: "mock",
        ip_hash: null,
        user_agent: null,
      },
    ];
    quotes = [
      {
        id: 1,
        created_at: "2026-07-09T06:00:00.000Z",
        product_name: "Premium Dehydrated Garlic Powder",
        company: "Spice World LLC",
        name: "David Miller",
        product_category: "Dehydrated Powders",
        quantity: "15",
        unit: "Metric Tons",
        country: "United States",
        email: "dmiller@spiceworld.com",
        phone: "+1 555-0199",
        destination_port: "Port of New York",
        notes: "Requires standard export corrugated box packaging. Grade A quality only.",
        status: "new",
        source: "mock",
        ip_hash: null,
        user_agent: null,
        grade: null,
        incoterm: null,
        packaging: null,
      },
    ];
  }

  return (
    <AdminShell title="Inquiry Dashboard" description="Review contact inquiries and quote requests from the website." adminEmail={admin.email}>
      <div className="admin-stats">
        <Stat icon={<Inbox />} label="Contact inquiries" value={contacts.length} />
        <Stat icon={<MessageSquareQuote />} label="Quote requests" value={quotes.length} />
        <Stat icon={<Mail />} label="Business email" value="anteenaeximp@gmail.com" />
        <Stat icon={<Phone />} label="WhatsApp" value="+91 93027 14134" />
      </div>

      <div className="admin-panels">
        <InquiryPanel title="Latest contact inquiries" empty="No contact inquiries yet.">
          {contacts.map((item) => (
            <article key={item.id} className="admin-record">
              <header>
                <strong>{item.name}</strong>
                <span>{formatDateTime(item.created_at)}</span>
              </header>
              <p>{item.subject}</p>
              <small>
                {item.email} • {item.phone} • {item.country}
              </small>
              {item.company ? <small>Company: {item.company}</small> : null}
              <blockquote>{item.message}</blockquote>
            </article>
          ))}
        </InquiryPanel>

        <InquiryPanel title="Latest quote requests" empty="No quote requests yet.">
          {quotes.map((item) => (
            <article key={item.id} className="admin-record">
              <header>
                <strong>{item.product_name}</strong>
                <span>{formatDateTime(item.created_at)}</span>
              </header>
              <p>
                {item.company} — {item.name}
              </p>
              <small>
                {item.product_category} • {item.quantity} {item.unit} • {item.country}
              </small>
              <small>
                {item.email} • {item.phone}
              </small>
              {item.destination_port ? <small>Destination: {item.destination_port}</small> : null}
              {item.notes ? <blockquote>{item.notes}</blockquote> : null}
            </article>
          ))}
        </InquiryPanel>
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

function InquiryPanel({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const hasRecords = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {hasRecords ? children : <p className="admin-empty">{empty}</p>}
    </section>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
