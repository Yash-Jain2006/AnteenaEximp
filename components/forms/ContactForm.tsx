"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { contactSchema, type ContactInput } from "@/lib/validations";

const subjects = ["Product Inquiry", "Quote Request", "Documentation", "Partnership", "Other"] as const;

export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "Product Inquiry", website: "" },
  });

  const submit = async (values: ContactInput) => {
    setResult(null);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, turnstileToken }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setResult({ ok: false, message: data.error || "The inquiry could not be sent. Please email us directly." });
      return;
    }

    setResult({ ok: true, message: "Your inquiry has been received. We will review it and respond by email." });
    reset();
  };

  return (
    <form className="business-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-grid">
        <Field label="Name" error={errors.name?.message}><input {...register("name")} autoComplete="name" /></Field>
        <Field label="Company (Optional)" error={errors.company?.message}><input {...register("company")} autoComplete="organization" /></Field>
        <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" /></Field>
        <Field label="Phone / WhatsApp" error={errors.phone?.message}><input {...register("phone")} autoComplete="tel" /></Field>
        <Field label="Country" error={errors.country?.message}><input {...register("country")} autoComplete="country-name" /></Field>
        <Field label="Subject" error={errors.subject?.message}>
          <select {...register("subject")}>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select>
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message}>
        <textarea {...register("message")} rows={6} placeholder="Tell us the product, quantity, destination, and any specification requirements." />
      </Field>
      <div className="honeypot" aria-hidden="true">
        <label>Website<input {...register("website")} tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />
      </div>
      {result ? <p className={result.ok ? "form-notice form-notice--success" : "form-notice form-notice--error"} role="status">{result.message}</p> : null}
      <button className="button button--primary" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="spin" /> : <Send size={17} />}
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>;
}
