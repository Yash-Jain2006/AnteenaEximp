"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Direct mock admin bypass for default credentials
      if (email.toLowerCase().trim() === "anteenaeximp@gmail.com" && password === "anteenaeximp") {
        document.cookie = "sb-mock-admin=true; path=/; max-age=86400; SameSite=Lax";
        router.push("/admin");
        router.refresh();
        return;
      }

      // Clear mock cookie if using real supabase auth
      document.cookie = "sb-mock-admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label>
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
      </label>
      <label>
        <span>Password</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="form-notice form-notice--error">{error}</p> : null}
      <button className="button button--primary" disabled={loading}>
        {loading ? <LoaderCircle className="spin" /> : <LockKeyhole size={17} />}
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
