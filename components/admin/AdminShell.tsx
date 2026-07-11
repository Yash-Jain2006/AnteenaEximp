import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/app/admin/LogoutButton";

const adminLinks = [
  { href: "/admin", label: "Inquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/", label: "View Site" },
];

export function AdminShell({
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
            <Link key={link.href} href={link.href}>
              {link.label}
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
