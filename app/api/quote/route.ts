import { NextRequest, NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validations";
import { formatRecord, insertRow, jsonError, rateLimit, sendNotificationEmail } from "@/lib/api/forms";

export async function POST(request: NextRequest) {
  const limit = rateLimit(request);
  if (!limit.ok) return jsonError("Too many requests. Please wait a minute and try again.", 429);

  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return jsonError("Please check the quote fields and try again.");
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const values = parsed.data;
  const userAgent = request.headers.get("user-agent");

  try {
    await insertRow("quote_requests", {
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

    await sendNotificationEmail({
      subject: `Quote request: ${values.productName}`,
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
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("quote form failed", error);
    return jsonError("The quote request could not be sent. Please email us directly.", 500);
  }
}
