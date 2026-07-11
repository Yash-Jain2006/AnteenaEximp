"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import { quoteSchema, type QuoteInput } from "@/lib/validations";

const fieldsByStep: (keyof QuoteInput)[][] = [
  ["name", "company", "email", "phone", "country"],
  ["productCategory", "productName", "quantity", "unit"],
  [],
];

export function QuoteForm() {
  const search = useSearchParams();
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      productCategory: search.get("category") || PRODUCT_CATEGORIES[0],
      productName: search.get("product") || "",
      unit: "MT",
      website: "",
    },
  });

  const next = async () => {
    if (await trigger(fieldsByStep[step])) setStep((value) => Math.min(2, value + 1));
  };

  const submit = async (values: QuoteInput) => {
    setResult(null);
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setResult({ ok: false, message: data.error || "The quote request could not be sent." });
      return;
    }

    setResult({ ok: true, message: "Your quote request has been received. We will review the details and reply by email." });
    reset();
    setStep(0);
  };

  return (
    <form className="quote-form business-form" onSubmit={handleSubmit(submit)} noValidate>
      <ol className="form-steps">
        {["Your details", "Product requirements", "Shipping & extras"].map((label, index) => (
          <li key={label} className={index <= step ? "is-active" : undefined}>
            <span>{index < step ? <Check size={15} /> : index + 1}</span>{label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="form-panel">
          <h2>Tell us about your business</h2>
          <div className="form-grid">
            <Field label="Name" error={errors.name?.message}><input {...register("name")} autoComplete="name" /></Field>
            <Field label="Company" error={errors.company?.message}><input {...register("company")} autoComplete="organization" /></Field>
            <Field label="Business email" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" /></Field>
            <Field label="Phone / WhatsApp" error={errors.phone?.message}><input {...register("phone")} autoComplete="tel" /></Field>
            <Field label="Country" error={errors.country?.message}><input {...register("country")} autoComplete="country-name" /></Field>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="form-panel">
          <h2>Define the product requirement</h2>
          <div className="form-grid">
            <Field label="Product category" error={errors.productCategory?.message}>
              <select {...register("productCategory")}>{PRODUCT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <Field label="Product name" error={errors.productName?.message}><input {...register("productName")} /></Field>
            <Field label="Grade / specification" error={errors.grade?.message}><input {...register("grade")} /></Field>
            <Field label="Quantity" error={errors.quantity?.message}><input {...register("quantity")} inputMode="decimal" /></Field>
            <Field label="Unit" error={errors.unit?.message}>
              <select {...register("unit")}><option>MT</option><option>KG</option><option>Tons</option><option>Bags</option><option>Containers</option></select>
            </Field>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="form-panel">
          <h2>Shipping and additional details</h2>
          <div className="form-grid">
            <Field label="Destination port" error={errors.destinationPort?.message}><input {...register("destinationPort")} /></Field>
            <Field label="Preferred Incoterm" error={errors.incoterm?.message}>
              <select {...register("incoterm")}><option value="">Not decided</option><option>FOB</option><option>CIF</option><option>CFR</option><option>EXW</option><option>Other</option></select>
            </Field>
          </div>
          <Field label="Packing requirements" error={errors.packaging?.message}><textarea {...register("packaging")} rows={3} /></Field>
          <Field label="Additional notes" error={errors.notes?.message}><textarea {...register("notes")} rows={5} /></Field>
        </div>
      ) : null}

      <div className="honeypot" aria-hidden="true">
        <label>Website<input {...register("website")} tabIndex={-1} autoComplete="off" /></label>
      </div>
      {result ? <p className={result.ok ? "form-notice form-notice--success" : "form-notice form-notice--error"} role="status">{result.message}</p> : null}
      <div className="form-actions">
        {step > 0 ? <button type="button" className="button button--outline" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={17} />Back</button> : <span />}
        {step < 2 ? (
          <button type="button" className="button button--primary" onClick={next}>Continue<ArrowRight size={17} /></button>
        ) : (
          <button className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit quote request"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>;
}
