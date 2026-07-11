import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <Link href="/" className="back-link">
          ← Back to website
        </Link>
        <h1>Admin Login</h1>
        <p>Sign in with a Supabase Auth user whose email is included in the `ADMIN_EMAILS` environment variable.</p>
        <LoginForm />
        <small>
          Business email: <a href={`mailto:${SITE.businessEmail}`}>{SITE.businessEmail}</a>
        </small>
      </div>
    </section>
  );
}
