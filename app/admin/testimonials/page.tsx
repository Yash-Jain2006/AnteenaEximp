import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { AdminShell, AdminSetupNotice } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmDialog";
import { deleteTestimonialAction, reorderTestimonialAction, toggleTestimonialVisibilityAction } from "@/app/admin/testimonials/actions";
import { getAllTestimonialsForAdmin } from "@/lib/cms/testimonials";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Testimonials",
  robots: { index: false, follow: false },
};

function notice(searchParams: { saved?: string; deleted?: string; ordered?: string; updated?: string; error?: string }) {
  if (searchParams.error) return { type: "error", text: searchParams.error };
  if (searchParams.saved) return { type: "success", text: "Testimonial saved." };
  if (searchParams.deleted) return { type: "success", text: "Testimonial deleted." };
  if (searchParams.ordered) return { type: "success", text: "Testimonial order updated." };
  if (searchParams.updated) return { type: "success", text: "Testimonial visibility updated." };
  return null;
}

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string; deleted?: string; ordered?: string; updated?: string; error?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const testimonials = await getAllTestimonialsForAdmin();

  if (!testimonials) {
    return (
      <AdminSetupNotice
        title="Testimonials CMS needs Supabase service credentials"
        body="Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local and apply supabase/schema.sql to enable testimonial CRUD."
      />
    );
  }

  const query = (params.q || "").toLowerCase();
  const filtered = testimonials.filter((testimonial) =>
    !query || `${testimonial.customerName} ${testimonial.company} ${testimonial.country} ${testimonial.product}`.toLowerCase().includes(query),
  );
  const flash = notice(params);

  return (
    <AdminShell
      title="Testimonials CMS"
      description="Manage customer testimonials displayed above the quote CTA on the home page."
      adminEmail={admin.email}
      actions={
        <Link className="button button--primary button--small" href="/admin/testimonials/new">
          <Plus size={16} /> New Testimonial
        </Link>
      }
    >
      {flash ? <p className={`form-notice form-notice--${flash.type}`}>{flash.text}</p> : null}
      <form className="admin-filter-bar">
        <input name="q" defaultValue={params.q || ""} placeholder="Search testimonials" />
        <button className="button button--outline button--small">Search</button>
      </form>

      <AdminTable>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Country</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((testimonial) => (
            <tr key={testimonial.id}>
              <td>
                <form action={reorderTestimonialAction} className="admin-order-form">
                  <input type="hidden" name="id" value={testimonial.numericId} />
                  <button name="displayOrder" value={Math.max(0, testimonial.displayOrder - 1)} aria-label={`Move ${testimonial.customerName} up`}>
                    <ArrowUp size={15} />
                  </button>
                  <span>{testimonial.displayOrder}</span>
                  <button name="displayOrder" value={testimonial.displayOrder + 1} aria-label={`Move ${testimonial.customerName} down`}>
                    <ArrowDown size={15} />
                  </button>
                </form>
              </td>
              <td>
                <strong>{testimonial.customerName}</strong>
                <small>{testimonial.company}</small>
              </td>
              <td>{testimonial.country}</td>
              <td>{testimonial.product}</td>
              <td>{"★".repeat(testimonial.rating)}</td>
              <td>
                <span className={`admin-pill ${testimonial.visible ? "admin-pill--published" : "admin-pill--draft"}`}>
                  {testimonial.visible ? "visible" : "hidden"}
                </span>
              </td>
              <td>
                <div className="admin-row-actions">
                  <Link className="button button--outline button--small" href={`/admin/testimonials/${testimonial.numericId}/edit`}>
                    <Edit3 size={15} /> Edit
                  </Link>
                  <form action={toggleTestimonialVisibilityAction}>
                    <input type="hidden" name="id" value={testimonial.numericId} />
                    <button className="button button--outline button--small">
                      {testimonial.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                      {testimonial.visible ? "Hide" : "Show"}
                    </button>
                  </form>
                  <form action={deleteTestimonialAction}>
                    <input type="hidden" name="id" value={testimonial.numericId} />
                    <ConfirmSubmitButton className="button button--light button--small" message={`Delete testimonial from ${testimonial.customerName}? This cannot be undone.`}>
                      <Trash2 size={15} /> Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
      {!filtered.length ? <p className="admin-empty">No testimonials match the search.</p> : null}
    </AdminShell>
  );
}
