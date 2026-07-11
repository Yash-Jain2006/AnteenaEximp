"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveTestimonialAction } from "@/app/admin/testimonials/actions";
import type { AdminActionState } from "@/app/admin/products/actions";
import type { Testimonial } from "@/lib/cms/types";

const emptyState: AdminActionState = {};

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial | null }) {
  const action = saveTestimonialAction.bind(null, testimonial?.numericId ? String(testimonial.numericId) : null);
  const [state, formAction] = useActionState(action, emptyState);

  return (
    <form action={formAction} className="admin-form">
      {state.error ? <p className="form-notice form-notice--error">{state.error}</p> : null}
      <div className="admin-form-grid">
        <label className="form-field">
          <span>Customer Name</span>
          <input name="customerName" defaultValue={testimonial?.customerName || ""} required />
        </label>
        <label className="form-field">
          <span>Company</span>
          <input name="company" defaultValue={testimonial?.company || ""} required />
        </label>
        <label className="form-field">
          <span>Country</span>
          <input name="country" defaultValue={testimonial?.country || ""} required />
        </label>
        <label className="form-field">
          <span>Imported Product</span>
          <input name="product" defaultValue={testimonial?.product || ""} required />
        </label>
        <label className="form-field">
          <span>Rating</span>
          <select name="rating" defaultValue={testimonial?.rating || 5}>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </label>
        <label className="form-field">
          <span>Display Order</span>
          <input name="displayOrder" type="number" min="0" defaultValue={testimonial?.displayOrder ?? 0} required />
        </label>
      </div>

      <ImageUploader name="photoUrl" label="Customer Photo" currentUrl={testimonial?.photoUrl || ""} scope="testimonials" optional />

      <label className="form-field">
        <span>Review</span>
        <textarea name="review" rows={5} defaultValue={testimonial?.review || ""} required />
      </label>

      <div className="admin-checkbox-row">
        <label>
          <input name="visible" type="checkbox" defaultChecked={testimonial?.visible ?? true} /> Visible
        </label>
        <label>
          <input name="featured" type="checkbox" defaultChecked={Boolean(testimonial?.featured)} /> Featured
        </label>
      </div>

      <div className="admin-form-actions">
        <Link className="button button--outline" href="/admin/testimonials">
          Cancel
        </Link>
        <SubmitButton label={testimonial ? "Save Testimonial" : "Create Testimonial"} />
      </div>
    </form>
  );
}
