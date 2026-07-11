"use client";

import { useRef, useState } from "react";
import { ImageIcon, LoaderCircle, Trash2, UploadCloud } from "lucide-react";

type UploadScope = "products" | "testimonials";

export async function uploadCmsImage(file: File, scope: UploadScope) {
  const body = new FormData();
  body.set("file", file);
  body.set("scope", scope);

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const payload: unknown = await response.json();

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid upload response.");
  }

  const data = payload as { ok?: boolean; url?: string; error?: string };
  if (!response.ok || !data.ok || !data.url) {
    throw new Error(data.error || "Image upload failed.");
  }

  return data.url;
}

export function ImageUploader({
  name,
  label,
  currentUrl = "",
  scope,
  optional = false,
  onChange,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  scope: UploadScope;
  optional?: boolean;
  onChange?: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(currentUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");

    try {
      const uploadedUrl = await uploadCmsImage(file, scope);
      setUrl(uploadedUrl);
      onChange?.(uploadedUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearImage() {
    setUrl("");
    onChange?.("");
  }

  return (
    <div className="image-uploader">
      <input type="hidden" name={name} value={url} />
      <div className="image-uploader__label">
        <span>{label}</span>
        {optional ? <small>Optional</small> : null}
      </div>
      <div className="image-uploader__preview">
        {url ? <span aria-hidden="true" style={{ backgroundImage: `url("${url}")` }} /> : <ImageIcon aria-hidden="true" />}
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <div className="image-uploader__actions">
        <button className="button button--outline button--small" type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <LoaderCircle className="spin" size={16} /> : <UploadCloud size={16} />}
          {busy ? "Uploading..." : "Upload / Replace"}
        </button>
        <button className="button button--light button--small" type="button" onClick={clearImage} disabled={busy || (!url && !optional)}>
          <Trash2 size={16} />
          Remove
        </button>
      </div>
      <label className="form-field">
        <span>Image URL/path</span>
        <input
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            onChange?.(event.target.value);
          }}
          placeholder="/images/categories/spices.webp"
          required={!optional}
        />
      </label>
      {error ? <p className="form-notice form-notice--error">{error}</p> : null}
    </div>
  );
}
