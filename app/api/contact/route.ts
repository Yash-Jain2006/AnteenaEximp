import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { formatRecord, insertRow, jsonError, rateLimit, sendNotificationEmail } from "@/lib/api/forms";

export async function POST(request: NextRequest) {
  const limit = rateLimit(request);
  if (!limit.ok) return jsonError("Too many requests. Please wait a minute and try again.", 429);

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError("Please check the form fields and try again.");
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const values = parsed.data;
  const userAgent = request.headers.get("user-agent");

  try {
    await insertRow("contact_inquiries", {
      name: values.name,
      company: values.company || null,
      email: values.email,
      phone: values.phone,
      country: values.country,
      subject: values.subject,
      message: values.message,
      source: "website_contact_form",
      ip_hash: limit.ipHash,
      user_agent: userAgent,
    });

    await sendNotificationEmail({
      subject: `Website inquiry: ${values.subject}`,
      replyTo: values.email,
      text: formatRecord("New website contact inquiry", {
        Name: values.name,
        Company: values.company,
        Email: values.email,
        Phone: values.phone,
        Country: values.country,
        Subject: values.subject,
        Message: values.message,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact form failed", error);
    return jsonError("The inquiry could not be sent. Please email us directly.", 500);
  }
}
