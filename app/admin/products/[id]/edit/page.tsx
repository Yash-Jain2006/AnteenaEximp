import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell, AdminSetupNotice } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProductById } from "@/lib/cms/products";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const product = await getAdminProductById((await params).id);

  if (!product) {
    return (
      <AdminSetupNotice
        title="Product not found or Supabase is not configured"
        body="Check the product id, SUPABASE_URL, SUPABASE_SECRET_KEY, and whether the CMS schema has been applied."
      />
    );
  }

  if (!product.numericId) notFound();

  return (
    <AdminShell title={`Edit ${product.title}`} description="Update product content, specifications, images, SEO, and publish status." adminEmail={admin.email}>
      <ProductForm product={product} />
    </AdminShell>
  );
}
