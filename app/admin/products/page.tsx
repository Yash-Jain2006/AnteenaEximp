import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Edit3, Plus, Trash2 } from "lucide-react";
import { AdminShell, AdminSetupNotice } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmDialog";
import { deleteProductAction, reorderProductAction } from "@/app/admin/products/actions";
import { getAllProductsForAdmin } from "@/lib/cms/products";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Products",
  robots: { index: false, follow: false },
};

function notice(searchParams: { saved?: string; deleted?: string; ordered?: string; error?: string }) {
  if (searchParams.error) return { type: "error", text: searchParams.error };
  if (searchParams.saved) return { type: "success", text: "Product saved." };
  if (searchParams.deleted) return { type: "success", text: "Product deleted." };
  if (searchParams.ordered) return { type: "success", text: "Product order updated." };
  return null;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; saved?: string; deleted?: string; ordered?: string; error?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const products = await getAllProductsForAdmin();

  if (!products) {
    return (
      <AdminSetupNotice
        title="Product CMS needs Supabase service credentials"
        body="Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local and apply supabase/schema.sql to enable product CRUD."
      />
    );
  }

  const query = (params.q || "").toLowerCase();
  const status = params.status || "all";
  const category = params.category || "all";
  const categories = Array.from(new Set(products.map((product) => product.category))).sort();
  const filtered = products.filter((product) => {
    const matchesQuery = !query || `${product.title} ${product.category} ${product.origin} ${product.status}`.toLowerCase().includes(query);
    const matchesStatus = status === "all" || product.status === status;
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });
  const flash = notice(params);

  return (
    <AdminShell
      title="Products CMS"
      description="Create, edit, reorder, and publish products shown on the public website."
      adminEmail={admin.email}
      actions={
        <Link className="button button--primary button--small" href="/admin/products/new">
          <Plus size={16} /> New Product
        </Link>
      }
    >
      {flash ? <p className={`form-notice form-notice--${flash.type}`}>{flash.text}</p> : null}
      <form className="admin-filter-bar">
        <input name="q" defaultValue={params.q || ""} placeholder="Search products" />
        <select name="status" defaultValue={status}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select name="category" defaultValue={category}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="button button--outline button--small">Filter</button>
      </form>

      <AdminTable>
        <thead>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Category</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product.id}>
              <td>
                <form action={reorderProductAction} className="admin-order-form">
                  <input type="hidden" name="id" value={product.numericId} />
                  <button name="displayOrder" value={Math.max(0, product.displayOrder - 1)} aria-label={`Move ${product.title} up`}>
                    <ArrowUp size={15} />
                  </button>
                  <span>{product.displayOrder}</span>
                  <button name="displayOrder" value={product.displayOrder + 1} aria-label={`Move ${product.title} down`}>
                    <ArrowDown size={15} />
                  </button>
                </form>
              </td>
              <td>
                <strong>{product.title}</strong>
                <small>{product.slug}</small>
              </td>
              <td>{product.category}</td>
              <td>
                <span className={`admin-pill admin-pill--${product.status}`}>{product.status}</span>
              </td>
              <td>{product.featured ? "Yes" : "No"}</td>
              <td>
                <div className="admin-row-actions">
                  <Link className="button button--outline button--small" href={`/admin/products/${product.numericId}/edit`}>
                    <Edit3 size={15} /> Edit
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.numericId} />
                    <ConfirmSubmitButton className="button button--light button--small" message={`Delete ${product.title}? This cannot be undone.`}>
                      <Trash2 size={15} /> Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
      {!filtered.length ? <p className="admin-empty">No products match the selected filters.</p> : null}
    </AdminShell>
  );
}
