"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Trash2, UploadCloud } from "lucide-react";
import { uploadCmsImage } from "@/components/admin/ImageUploader";

type EditorMode = "badge" | "specification" | "application" | "image";
type DynamicItem = {
  label?: string;
  value?: string;
  url?: string;
  alt?: string;
};

function normalizeItems(items: DynamicItem[]) {
  return items.map((item) => ({
    label: item.label || "",
    value: item.value || "",
    url: item.url || "",
    alt: item.alt || "",
  }));
}

function isMeaningful(item: DynamicItem, mode: EditorMode) {
  if (mode === "specification") return Boolean(item.label?.trim() && item.value?.trim());
  if (mode === "image") return Boolean(item.url?.trim());
  return Boolean((item.value || item.label || "").trim());
}

export function DynamicListEditor({
  name,
  label,
  mode,
  initialItems,
}: {
  name: string;
  label: string;
  mode: EditorMode;
  initialItems: DynamicItem[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(() => normalizeItems(initialItems.length ? initialItems : [{}]));
  const jsonValue = useMemo(() => JSON.stringify(items.filter((item) => isMeaningful(item, mode))), [items, mode]);

  function updateItem(index: number, patch: DynamicItem) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) => [...current, { label: "", value: "", url: "", alt: "" }]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleGalleryUpload(file: File | undefined) {
    if (!file || uploadIndex === null) return;
    setBusyIndex(uploadIndex);
    setError("");

    try {
      const url = await uploadCmsImage(file, "products");
      updateItem(uploadIndex, { url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setBusyIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="dynamic-editor">
      <input type="hidden" name={name} value={jsonValue} />
      <div className="dynamic-editor__header">
        <strong>{label}</strong>
        <button type="button" className="button button--outline button--small" onClick={addItem}>
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="dynamic-editor__rows">
        {items.map((item, index) => (
          <div className="dynamic-editor__row" key={index}>
            {mode === "specification" ? (
              <>
                <input value={item.label} onChange={(event) => updateItem(index, { label: event.target.value })} placeholder="Specification label" />
                <input value={item.value} onChange={(event) => updateItem(index, { value: event.target.value })} placeholder="Specification value" />
              </>
            ) : null}
            {mode === "badge" || mode === "application" ? (
              <input
                value={mode === "badge" ? item.label : item.value}
                onChange={(event) => updateItem(index, mode === "badge" ? { label: event.target.value } : { value: event.target.value })}
                placeholder={mode === "badge" ? "Badge label" : "Application"}
              />
            ) : null}
            {mode === "image" ? (
              <>
                <div className="dynamic-editor__preview">{item.url ? <span aria-hidden="true" style={{ backgroundImage: `url("${item.url}")` }} /> : null}</div>
                <input value={item.url} onChange={(event) => updateItem(index, { url: event.target.value })} placeholder="Image URL/path" />
                <input value={item.alt} onChange={(event) => updateItem(index, { alt: event.target.value })} placeholder="Alt text" />
                <button
                  type="button"
                  className="button button--outline button--small"
                  onClick={() => {
                    setUploadIndex(index);
                    fileInputRef.current?.click();
                  }}
                  disabled={busyIndex === index}
                >
                  {busyIndex === index ? <LoaderCircle className="spin" size={16} /> : <UploadCloud size={16} />}
                  Upload
                </button>
              </>
            ) : null}
            <div className="dynamic-editor__controls">
              <button type="button" aria-label="Move up" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                <ArrowUp size={15} />
              </button>
              <button type="button" aria-label="Move down" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>
                <ArrowDown size={15} />
              </button>
              <button type="button" aria-label="Remove" onClick={() => removeItem(index)} disabled={items.length === 1}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {mode === "image" ? (
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => void handleGalleryUpload(event.target.files?.[0])}
        />
      ) : null}
      {error ? <p className="form-notice form-notice--error">{error}</p> : null}
    </div>
  );
}
