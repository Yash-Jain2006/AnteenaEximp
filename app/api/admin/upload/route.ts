import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 5 * 1024 * 1024;
const bucketName = "cms-images";

function extensionFor(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase service credentials are not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const scopeValue = formData.get("scope");
  const scope = scopeValue === "testimonials" ? "testimonials" : "products";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image file provided." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Only JPEG, PNG, and WEBP images are allowed." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ ok: false, error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  const path = `${scope}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(file.type)}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucketName).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
