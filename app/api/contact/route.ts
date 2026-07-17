import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { formatRecord, insertRow, isAllowedOrigin, jsonError, rateLimit, requestPayloadTooLarge, sendNotificationEmail, sendCustomerConfirmation, generateContactConfirmationTemplate, verifyTurnstile, getClientIp, generateHtmlTemplate } from "@/lib/api/forms";
import { SITE } from "@/lib/site";

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return jsonError("Invalid request origin.", 403);
  if (requestPayloadTooLarge(request)) return jsonError("Request is too large.", 413);

  const limit = rateLimit(request);
  if (!limit.ok) return jsonError("Too many requests. Please wait a minute and try again.", 429);

  const body = await request.json().catch(() => null);
  const turnstile = await verifyTurnstile(body?.turnstileToken, getClientIp(request));
  if (!turnstile.ok) return jsonError(turnstile.error || "CAPTCHA failed");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError("Please check the form fields and try again.");
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const values = parsed.data;
  const userAgent = request.headers.get("user-agent");

  try {
    const { id } = await insertRow("contact_inquiries", {
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

    const adminUrl = `${SITE.url}/admin/inquiries?id=${id}`;

    const internalEmailPromise = sendNotificationEmail({
      subject: `New Contact Inquiry from ${values.name}`,
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
      html: generateHtmlTemplate(`New Contact Inquiry from ${values.name}`, {
        Name: values.name,
        Company: values.company,
        Email: values.email,
        Phone: values.phone,
        Country: values.country,
        Subject: values.subject,
        Message: values.message,
      }, adminUrl)
    });

    const inquiryNumber = `AE-INQ-${String(id).padStart(6, '0')}`;
    const date = new Intl.DateTimeFormat("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    const confirmation = generateContactConfirmationTemplate(values.name, inquiryNumber, date);

    const customerEmailPromise = sendCustomerConfirmation({
      to: values.email,
      subject: "Thank you for contacting Anteena Eximp",
      text: confirmation.text,
      html: confirmation.html,
    });

    await Promise.all([internalEmailPromise, customerEmailPromise]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact form failed", error);
    return jsonError("The inquiry could not be sent. Please email us directly.", 500);
  }
}
