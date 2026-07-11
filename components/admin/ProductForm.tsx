"use client";

import Link from "next/link";
import { useActionState } from "react";
import { DynamicListEditor } from "@/components/admin/DynamicListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveProductAction, type AdminActionState } from "@/app/admin/products/actions";
import type { Product } from "@/lib/cms/types";

const emptyState: AdminActionState = {};

export function ProductForm({ product }: { product?: Product | null }) {
  const action = saveProductAction.bind(null, product?.numericId ? String(product.numericId) : null);
  const [state, formAction] = useActionState(action, emptyState);

  return (
    <form action={formAction} className="admin-form">
      {state.error ? <p className="form-notice form-notice--error">{state.error}</p> : null}
      <div className="admin-form-grid">
        <label className="form-field">
          <span>Title</span>
          <input name="title" defaultValue={product?.title || ""} required />
        </label>
        <label className="form-field">
          <span>Slug</span>
          <input name="slug" defaultValue={product?.slug || ""} placeholder="onion-powder" required />
        </label>
        <label className="form-field">
          <span>Category</span>
          <input name="category" defaultValue={product?.category || ""} placeholder="Spices" required />
        </label>
        <label className="form-field">
          <span>Status</span>
          <select name="status" defaultValue={product?.status || "published"} required>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="form-field">
          <span>Origin</span>
          <input name="origin" defaultValue={product?.origin || "India"} required />
        </label>
        <label className="form-field">
          <span>MOQ</span>
          <input name="moq" defaultValue={product?.moq || "As per order requirement"} required />
        </label>
        <label className="form-field">
          <span>Display Order</span>
          <input name="displayOrder" type="number" min="0" defaultValue={product?.displayOrder ?? 0} required />
        </label>
        <label className="form-field">
          <span>HS Code</span>
          <input name="hsCode" defaultValue={product?.hsCode || "Confirmed during quotation"} />
        </label>
      </div>

      <ImageUploader name="mainImage" label="Main Image" currentUrl={product?.mainImage || "/images/cta/commodities.webp"} scope="products" />

      <label className="form-field">
        <span>Short Description</span>
        <textarea name="shortDescription" rows={3} defaultValue={product?.shortDescription || ""} required />
      </label>
      <label className="form-field">
        <span>Full Description</span>
        <textarea name="fullDescription" rows={6} defaultValue={product?.fullDescription || product?.shortDescription || ""} required />
      </label>
      <label className="form-field">
        <span>Packaging</span>
        <textarea name="packaging" rows={3} defaultValue={product?.packaging || ""} required />
      </label>

      <DynamicListEditor name="badges" label="Specification Badges" mode="badge" initialItems={product?.badges || []} />
      <DynamicListEditor name="specifications" label="Specifications" mode="specification" initialItems={product?.specifications || []} />
      <DynamicListEditor name="applications" label="Applications" mode="application" initialItems={product?.applications || []} />
      <DynamicListEditor name="galleryImages" label="Gallery Images" mode="image" initialItems={product?.galleryImages || []} />

      <div className="admin-form-grid">
        <label className="form-field">
          <span>SEO Title</span>
          <input name="seoTitle" defaultValue={product?.seoTitle || ""} />
        </label>
        <label className="form-field">
          <span>SEO Description</span>
          <input name="seoDescription" defaultValue={product?.seoDescription || ""} />
        </label>
      </div>

      <div className="admin-checkbox-row">
        <label>
          <input name="featured" type="checkbox" defaultChecked={Boolean(product?.featured)} /> Featured
        </label>
      </div>

      <div className="admin-form-actions">
        <Link className="button button--outline" href="/admin/products">
          Cancel
        </Link>
        <SubmitButton label={product ? "Save Product" : "Create Product"} />
      </div>
    </form>
  );
}
