import { NextRequest, NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validations";
import { formatRecord, insertRow, isAllowedOrigin, jsonError, rateLimit, requestPayloadTooLarge, sendNotificationEmail, sendCustomerConfirmation, generateQuoteConfirmationTemplate, verifyTurnstile, getClientIp, generateHtmlTemplate } from "@/lib/api/forms";
import { SITE } from "@/lib/site";

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return jsonError("Invalid request origin.", 403);
  if (requestPayloadTooLarge(request)) return jsonError("Request is too large.", 413);

  const limit = rateLimit(request);
  if (!limit.ok) return jsonError("Too many requests. Please wait a minute and try again.", 429);

  const body = await request.json().catch(() => null);
  const turnstile = await verifyTurnstile(body?.turnstileToken, getClientIp(request));
  if (!turnstile.ok) return jsonError(turnstile.error || "CAPTCHA failed");

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return jsonError("Please check the quote fields and try again.");
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const values = parsed.data;
  const userAgent = request.headers.get("user-agent");

  try {
    const { id } = await insertRow("quote_requests", {
      name: values.name,
      company: values.company,
      email: values.email,
      phone: values.phone,
      country: values.country,
      product_category: values.productCategory,
      product_name: values.productName,
      grade: values.grade || null,
      quantity: values.quantity,
      unit: values.unit,
      destination_port: values.destinationPort || null,
      incoterm: values.incoterm || null,
      packaging: values.packaging || null,
      notes: values.notes || null,
      source: "website_quote_form",
      ip_hash: limit.ipHash,
      user_agent: userAgent,
    });

    const adminUrl = `${SITE.url}/admin/quotes?id=${id}`;
    const subjectTitle = `New Quote Request: ${values.productName} from ${values.company || values.name}`;

    const internalEmailPromise = sendNotificationEmail({
      subject: subjectTitle,
      replyTo: values.email,
      text: formatRecord("New website quote request", {
        Name: values.name,
        Company: values.company,
        Email: values.email,
        Phone: values.phone,
        Country: values.country,
        "Product category": values.productCategory,
        "Product name": values.productName,
        Grade: values.grade,
        Quantity: `${values.quantity} ${values.unit}`,
        "Destination port": values.destinationPort,
        Incoterm: values.incoterm,
        Packaging: values.packaging,
        Notes: values.notes,
      }),
      html: generateHtmlTemplate(subjectTitle, {
        Name: values.name,
        Company: values.company,
        Email: values.email,
        Phone: values.phone,
        Country: values.country,
        "Product category": values.productCategory,
        "Product name": values.productName,
        Grade: values.grade,
        Quantity: `${values.quantity} ${values.unit}`,
        "Destination port": values.destinationPort,
        Incoterm: values.incoterm,
        Packaging: values.packaging,
        Notes: values.notes,
      }, adminUrl)
    });

    const inquiryNumber = `AE-QUO-${String(id).padStart(6, '0')}`;
    const date = new Intl.DateTimeFormat("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    const confirmation = generateQuoteConfirmationTemplate(
      values.name, 
      inquiryNumber, 
      date, 
      values.productName, 
      `${values.quantity} ${values.unit}`, 
      values.destinationPort || null
    );

    const customerEmailPromise = sendCustomerConfirmation({
      to: values.email,
      subject: "Thank you for contacting Anteena Eximp",
      text: confirmation.text,
      html: confirmation.html,
    });

    await Promise.all([internalEmailPromise, customerEmailPromise]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("quote form failed", error);
    return jsonError("The quote request could not be sent. Please email us directly.", 500);
  }
}
