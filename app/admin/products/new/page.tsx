import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "New Product",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell title="New Product" description="Add a CMS-managed product to the public catalog." adminEmail={admin.email}>
      <ProductForm />
    </AdminShell>
  );
}
