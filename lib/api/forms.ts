import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "anteena-eximp-local-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function rateLimit(request: NextRequest) {
  const limit = Number(process.env.FORM_RATE_LIMIT_PER_MINUTE || 10);
  const ip = getClientIp(request);
  const key = hashIp(ip);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true, ipHash: key };
  }

  if (bucket.count >= limit) {
    return { ok: false, ipHash: key };
  }

  bucket.count += 1;
  return { ok: true, ipHash: key };
}

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export function recipients() {
  return (process.env.CONTACT_TO_EMAIL || `${SITE.businessEmail},${SITE.contactEmail}`)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function sendNotificationEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || `Anteena Eximp <noreply@${SITE.domain}>`;
  const to = recipients();

  if (!key || !to.length) {
    return { skipped: true };
  }

  const resend = new Resend(key);
  const response = await resend.emails.send({
    from,
    to,
    subject,
    text,
    replyTo,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return { skipped: false };
}

export async function insertRow(table: "contact_inquiries" | "quote_requests", row: Record<string, unknown>) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { skipped: true };
  }

  const { error } = await supabase.from(table).insert(row);

  if (error) {
    throw new Error(error.message);
  }

  return { skipped: false };
}

export function formatRecord(title: string, values: Record<string, unknown>) {
  const body = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");

  return `${title}\n\n${body}`;
}
