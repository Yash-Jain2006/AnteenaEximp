import type { Metadata } from "next";
import { AdminShell, AdminSetupNotice } from "@/components/admin/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getAdminTestimonialById } from "@/lib/cms/testimonials";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Testimonial",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const testimonial = await getAdminTestimonialById((await params).id);

  if (!testimonial) {
    return (
      <AdminSetupNotice
        title="Testimonial not found or Supabase is not configured"
        body="Check the testimonial id, SUPABASE_URL, SUPABASE_SECRET_KEY, and whether the CMS schema has been applied."
      />
    );
  }

  return (
    <AdminShell title={`Edit ${testimonial.customerName}`} description="Update review content, rating, photo, ordering, and visibility." adminEmail={admin.email}>
      <TestimonialForm testimonial={testimonial} />
    </AdminShell>
  );
}
