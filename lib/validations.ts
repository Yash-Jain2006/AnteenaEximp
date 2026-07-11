import { z } from "zod";

const contactFields = {
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional(),
  email: z.email(),
  phone: z.string().trim().min(7).max(30),
  country: z.string().trim().min(2).max(80),
  website: z.string().max(0).optional(),
};

export const contactSchema = z.object({
  ...contactFields,
  subject: z.enum(["Product Inquiry", "Quote Request", "Documentation", "Partnership", "Other"]),
  message: z.string().trim().min(20).max(4000),
});

export const quoteSchema = z.object({
  ...contactFields,
  company: z.string().trim().min(2).max(150),
  productCategory: z.string().trim().min(2).max(80),
  productName: z.string().trim().min(2).max(120),
  grade: z.string().trim().max(120).optional(),
  quantity: z.string().trim().min(1).max(30),
  unit: z.enum(["MT", "KG", "Tons", "Bags", "Containers"]),
  destinationPort: z.string().trim().max(120).optional(),
  incoterm: z.enum(["FOB", "CIF", "CFR", "EXW", "Other"]).optional(),
  packaging: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(4000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

const jsonArrayString = z.string().trim().default("[]").transform((value, context) => {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    if (!Array.isArray(parsed)) {
      context.addIssue({ code: "custom", message: "Expected an array." });
      return z.NEVER;
    }
    return parsed;
  } catch {
    context.addIssue({ code: "custom", message: "Invalid JSON array." });
    return z.NEVER;
  }
});

const adminArrayItem = z.object({
  label: z.string().trim().optional(),
  value: z.string().trim().optional(),
  url: z.string().trim().optional(),
  alt: z.string().trim().optional(),
});

export const productAdminSchema = z.object({
  title: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  category: z.string().trim().min(2).max(100),
  mainImage: z.string().trim().min(1).max(500),
  shortDescription: z.string().trim().min(20).max(500),
  fullDescription: z.string().trim().min(20).max(3000),
  origin: z.string().trim().min(2).max(160),
  moq: z.string().trim().min(1).max(120),
  packaging: z.string().trim().min(1).max(500),
  hsCode: z.string().trim().max(80).default("Confirmed during quotation"),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(220).optional(),
  featured: z.coerce.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]),
  displayOrder: z.coerce.number().int().min(0).max(100000),
  badges: jsonArrayString.pipe(z.array(adminArrayItem)).transform((items) =>
    items.map((item) => item.label || item.value || "").filter(Boolean).map((label, index) => ({ label, displayOrder: index + 1 })),
  ),
  specifications: jsonArrayString.pipe(z.array(adminArrayItem)).transform((items) =>
    items
      .map((item, index) => ({ label: item.label || "", value: item.value || "", displayOrder: index + 1 }))
      .filter((item) => item.label && item.value),
  ),
  applications: jsonArrayString.pipe(z.array(adminArrayItem)).transform((items) =>
    items.map((item) => item.value || item.label || "").filter(Boolean).map((value, index) => ({ value, displayOrder: index + 1 })),
  ),
  galleryImages: jsonArrayString.pipe(z.array(adminArrayItem)).transform((items) =>
    items
      .map((item, index) => ({ url: item.url || "", alt: item.alt || "", displayOrder: index + 1 }))
      .filter((item) => item.url),
  ),
});

export const testimonialAdminSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  country: z.string().trim().min(2).max(100),
  photoUrl: z.string().trim().max(500).optional(),
  product: z.string().trim().min(2).max(140),
  review: z.string().trim().min(20).max(800),
  rating: z.coerce.number().int().min(1).max(5),
  displayOrder: z.coerce.number().int().min(0).max(100000),
  visible: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
});

export const imageUploadResponseSchema = z.object({
  ok: z.boolean(),
  url: z.string().optional(),
  error: z.string().optional(),
});

export type ProductAdminInput = z.infer<typeof productAdminSchema>;
export type TestimonialAdminInput = z.infer<typeof testimonialAdminSchema>;
