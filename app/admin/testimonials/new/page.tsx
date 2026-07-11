import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "New Testimonial",
  robots: { index: false, follow: false },
};

export default async function NewTestimonialPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell title="New Testimonial" description="Add a buyer testimonial to the home page marquee." adminEmail={admin.email}>
      <TestimonialForm />
    </AdminShell>
  );
}
