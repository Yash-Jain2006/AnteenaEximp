import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/app/admin/LogoutButton";
import { createServiceSupabaseClient, hasSupabaseServiceConfig } from "@/lib/supabase/server";

interface NavLink {
  href: string;
  label: string;
  count?: number;
}

export async function AdminShell({
  title,
  description,
  adminEmail,
  actions,
  children,
}: {
  title: string;
  description?: string;
  adminEmail?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  let inquiriesCount = 0;
  let quotesCount = 0;

  if (hasSupabaseServiceConfig()) {
    const supabase = createServiceSupabaseClient();
    if (supabase) {
      const [inquiries, quotes] = await Promise.all([
        supabase.from("contact_inquiries").select("id", { count: "exact" }).eq("status", "new"),
        supabase.from("quote_requests").select("id", { count: "exact" }).eq("status", "new"),
      ]);
      inquiriesCount = inquiries.count || 0;
      quotesCount = quotes.count || 0;
    }
  }

  const adminLinks: NavLink[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/inquiries", label: "Inquiries", count: inquiriesCount },
    { href: "/admin/quotes", label: "Quotes", count: quotesCount },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/", label: "View Site" },
  ];

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header">
          <div>
            <span>Admin</span>
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
            {adminEmail ? <p>Signed in as {adminEmail}</p> : null}
          </div>
          <div className="admin-header-actions">
            {actions}
            <LogoutButton />
          </div>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2">
              {link.label}
              {link.count ? (
                <span style={{ background: "#e11d48", color: "white", padding: "2px 6px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" }}>
                  {link.count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </section>
  );
}

export function AdminSetupNotice({ title, body }: { title: string; body: string }) {
  return (
    <AdminShell title={title} description={body}>
      <div className="admin-setup">
        <p>{body}</p>
      </div>
    </AdminShell>
  );
}
