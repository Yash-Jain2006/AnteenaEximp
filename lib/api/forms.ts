import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

const allowedOrigins = new Set([
  new URL(SITE.url).origin,
  `https://www.${SITE.domain}`,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

export function requestPayloadTooLarge(request: NextRequest, maxBytes = 100_000) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}

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

export async function verifyTurnstile(token: string | undefined | null, ip: string) {
  if (!token) return { ok: false, error: "Please complete the CAPTCHA." };
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? { ok: false, error: "CAPTCHA is not configured. Please email us directly." }
      : { ok: true };
  }
  
  try {
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);
    formData.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.success ? { ok: true } : { ok: false, error: "CAPTCHA verification failed." };
  } catch {
    return { ok: false, error: "CAPTCHA service error." };
  }
}

export function recipients() {
  const emails = (process.env.CONTACT_TO_EMAIL || `${SITE.businessEmail},${SITE.contactEmail}`)
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email && email !== "divyanshtotla18@gmail.com");

  // Ensure info@anteenaeximp.com is always included in the notification recipient list
  if (!emails.includes("info@anteenaeximp.com")) {
    emails.push("info@anteenaeximp.com");
  }

  return emails;
}

export async function sendNotificationEmail({
  subject,
  text,
  html,
  replyTo,
}: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || `Anteena Eximp <noreply@${SITE.domain}>`;
  const to = recipients();

  if (!key || !to.length) {
    return { skipped: true };
  }

  try {
    const resend = new Resend(key);
    const response = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      replyTo,
    });

    if (response.error) {
      console.error("Resend API Error:", response.error.message);
    }
  } catch (err) {
    console.error("Resend Exception:", err);
  }

  return { skipped: false };
}

export async function insertRow(table: "contact_inquiries" | "quote_requests", row: Record<string, unknown>) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { skipped: true, id: null };
  }

  const { data, error } = await supabase.from(table).insert(row).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  return { skipped: false, id: data.id };
}

export function formatRecord(title: string, values: Record<string, unknown>) {
  const body = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");

  return `${title}\n\n${body}`;
}

export function generateHtmlTemplate(title: string, values: Record<string, unknown>, adminUrl: string) {
  const body = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${escapeHtml(key)}</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(value)}</td></tr>`)
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${escapeHtml(title)}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        ${body}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Timestamp</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td></tr>
      </table>
      <a href="${escapeHtml(adminUrl)}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Panel</a>
    </div>
  `;
}

function escapeHtml(value: unknown) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

export async function sendCustomerConfirmation({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || `Anteena Eximp <info@${SITE.domain}>`;

  if (!key || !to) {
    return { skipped: true };
  }

  try {
    const resend = new Resend(key);
    const response = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    if (response.error) {
      console.error("Resend API Error (Customer Confirmation):", response.error.message);
    }
  } catch (err) {
    console.error("Resend Exception (Customer Confirmation):", err);
  }

  return { skipped: false };
}

export function generateContactConfirmationTemplate(name: string, inquiryNumber: string, date: string) {
  const text = `Dear ${name},

Thank you for your export inquiry.

We have successfully received your request.

Our export team will review your requirements and contact you shortly.

Inquiry Number: ${inquiryNumber}
Date: ${date}

Regards,
Anteena Eximp
Agricultural Export Company
www.anteenaeximp.com`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #000;">Anteena Eximp</h1>
      </div>
      <p>Dear ${escapeHtml(name)},</p>
      <p>Thank you for your export inquiry.</p>
      <p>We have successfully received your request.</p>
      <p>Our export team will review your requirements and contact you shortly.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Inquiry Number:</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${inquiryNumber}</td>
        </tr>
        <tr>
          <td style="padding: 12px;"><strong>Date:</strong></td>
          <td style="padding: 12px;">${date}</td>
        </tr>
      </table>
      
      <p style="color: #6b7280; font-size: 14px;">Our export team typically responds within 1–2 business days.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;"><strong>Anteena Eximp</strong><br>Agricultural Export Company<br><a href="https://www.anteenaeximp.com" style="color: #000; text-decoration: none;">www.anteenaeximp.com</a></p>
      </div>
    </div>
  `;
  
  return { text, html };
}

export function generateQuoteConfirmationTemplate(
  name: string, 
  inquiryNumber: string, 
  date: string, 
  product: string, 
  quantity: string, 
  port: string | null
) {
  const text = `Dear ${name},

Thank you for your export inquiry.

We have successfully received your request.

Our export team will review your requirements and contact you shortly.

Inquiry Number: ${inquiryNumber}
Date: ${date}

Submitted Details:
Product: ${product}
Quantity: ${quantity}
Destination Port: ${port || 'N/A'}

Regards,
Anteena Eximp
Agricultural Export Company
www.anteenaeximp.com`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #000;">Anteena Eximp</h1>
      </div>
      <p>Dear ${escapeHtml(name)},</p>
      <p>Thank you for your export inquiry.</p>
      <p>We have successfully received your request.</p>
      <p>Our export team will review your requirements and contact you shortly.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; width: 40%;"><strong>Inquiry Number:</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${inquiryNumber}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(product)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(quantity)}</td>
        </tr>
        <tr>
          <td style="padding: 12px;"><strong>Destination Port:</strong></td>
          <td style="padding: 12px;">${escapeHtml(port || "N/A")}</td>
        </tr>
      </table>
      
      <p style="color: #6b7280; font-size: 14px;">Our export team typically responds within 1–2 business days.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;"><strong>Anteena Eximp</strong><br>Agricultural Export Company<br><a href="https://www.anteenaeximp.com" style="color: #000; text-decoration: none;">www.anteenaeximp.com</a></p>
      </div>
    </div>
  `;
  
  return { text, html };
}
