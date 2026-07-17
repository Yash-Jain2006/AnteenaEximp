import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/admin/login/LoginForm";

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
        <LoginForm />
      </div>
    </section>
  );
}
