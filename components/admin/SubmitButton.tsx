"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel = "Saving..." }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="button button--primary" disabled={pending}>
      {pending ? <LoaderCircle className="spin" size={17} /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}
