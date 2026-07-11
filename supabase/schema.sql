-- Anteena Eximp website inquiry schema
-- Run this in the Supabase SQL editor before enabling production form storage/admin dashboard.

create table if not exists public.contact_inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  country text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  source text not null default 'website_contact_form',
  ip_hash text,
  user_agent text,
  constraint contact_inquiries_status_check check (status in ('new', 'reviewing', 'replied', 'closed')),
  constraint contact_inquiries_email_check check (position('@' in email) > 1)
);

create table if not exists public.quote_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  country text not null,
  product_category text not null,
  product_name text not null,
  grade text,
  quantity text not null,
  unit text not null,
  destination_port text,
  incoterm text,
  packaging text,
  notes text,
  status text not null default 'new',
  source text not null default 'website_quote_form',
  ip_hash text,
  user_agent text,
  constraint quote_requests_status_check check (status in ('new', 'reviewing', 'replied', 'closed')),
  constraint quote_requests_email_check check (position('@' in email) > 1)
);

alter table public.contact_inquiries enable row level security;
alter table public.quote_requests enable row level security;

-- No public read/write policies are created intentionally.
-- Website API routes insert with the Supabase service role key on the server only.
-- The admin dashboard authenticates a Supabase user, checks ADMIN_EMAILS, then reads with the service role key on the server only.

create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status);
create index if not exists contact_inquiries_email_idx on public.contact_inquiries (email);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status);
create index if not exists quote_requests_email_idx on public.quote_requests (email);
create index if not exists quote_requests_product_category_idx on public.quote_requests (product_category);

create table if not exists public.cms_products (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null,
  category text not null,
  main_image text not null,
  short_description text not null,
  full_description text not null default '',
  origin text not null default '',
  moq text not null default '',
  packaging text not null default '',
  hs_code text not null default 'Confirmed during quotation',
  seo_title text not null default '',
  seo_description text not null default '',
  featured boolean not null default false,
  status text not null default 'published',
  display_order integer not null default 0,
  constraint cms_products_slug_unique unique (slug),
  constraint cms_products_status_check check (status in ('draft', 'published', 'archived')),
  constraint cms_products_rating_order_check check (display_order >= 0)
);

create table if not exists public.cms_product_badges (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.cms_products(id) on delete cascade,
  label text not null,
  display_order integer not null default 0
);

create table if not exists public.cms_product_specifications (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.cms_products(id) on delete cascade,
  label text not null,
  value text not null,
  display_order integer not null default 0
);

create table if not exists public.cms_product_applications (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.cms_products(id) on delete cascade,
  value text not null,
  display_order integer not null default 0
);

create table if not exists public.cms_product_gallery_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.cms_products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  display_order integer not null default 0
);

create table if not exists public.cms_testimonials (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  company text not null,
  country text not null,
  photo_url text,
  product text not null,
  review text not null,
  rating integer not null default 5,
  display_order integer not null default 0,
  visible boolean not null default true,
  featured boolean not null default false,
  constraint cms_testimonials_rating_check check (rating between 1 and 5),
  constraint cms_testimonials_display_order_check check (display_order >= 0)
);

alter table public.cms_products enable row level security;
alter table public.cms_product_badges enable row level security;
alter table public.cms_product_specifications enable row level security;
alter table public.cms_product_applications enable row level security;
alter table public.cms_product_gallery_images enable row level security;
alter table public.cms_testimonials enable row level security;

create index if not exists cms_products_slug_idx on public.cms_products (slug);
create index if not exists cms_products_status_idx on public.cms_products (status);
create index if not exists cms_products_featured_idx on public.cms_products (featured);
create index if not exists cms_products_display_order_idx on public.cms_products (display_order);
create index if not exists cms_products_category_idx on public.cms_products (category);
create index if not exists cms_product_badges_product_id_idx on public.cms_product_badges (product_id);
create index if not exists cms_product_specifications_product_id_idx on public.cms_product_specifications (product_id);
create index if not exists cms_product_applications_product_id_idx on public.cms_product_applications (product_id);
create index if not exists cms_product_gallery_images_product_id_idx on public.cms_product_gallery_images (product_id);
create index if not exists cms_testimonials_visible_idx on public.cms_testimonials (visible);
create index if not exists cms_testimonials_featured_idx on public.cms_testimonials (featured);
create index if not exists cms_testimonials_display_order_idx on public.cms_testimonials (display_order);

-- Optional storage setup for CMS image uploads:
-- 1. Create a public Supabase Storage bucket named `cms-images`.
-- 2. The Next.js server uploads through the service role key after admin authentication.
-- 3. Existing `/public/images/...` image paths remain valid and are not deleted by CMS edits.

insert into public.cms_products
  (title, slug, category, main_image, short_description, full_description, origin, moq, packaging, hs_code, seo_title, seo_description, featured, status, display_order)
values
  ('Onion Powder', 'onion-powder', 'Dehydrated Powders', '/images/categories/processed.webp', 'Dehydrated onion powder for food processors, seasoning blends, snacks, sauces, and bulk ingredient buyers.', 'Dehydrated onion powder for food processors, seasoning blends, snacks, sauces, and bulk ingredient buyers.', 'India', 'As per order requirement', '10 kg / 20 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Onion Powder', 'Dehydrated onion powder for export sourcing from Anteena Eximp.', true, 'published', 1),
  ('Garlic Powder', 'garlic-powder', 'Dehydrated Powders', '/images/categories/processed.webp', 'Dehydrated garlic powder suitable for seasoning, sauces, processed food, spice mixes, and institutional bulk sourcing.', 'Dehydrated garlic powder suitable for seasoning, sauces, processed food, spice mixes, and institutional bulk sourcing.', 'India', 'As per order requirement', '10 kg / 20 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Garlic Powder', 'Dehydrated garlic powder for export sourcing from Anteena Eximp.', true, 'published', 2),
  ('Chia Seeds', 'chia-seeds', 'Seeds', '/images/categories/oil-seeds.webp', 'Chia seeds for importers, wholesalers, health food brands, and ingredient buyers, supplied against agreed purity and packing requirements.', 'Chia seeds for importers, wholesalers, health food brands, and ingredient buyers, supplied against agreed purity and packing requirements.', 'India and approved sourcing origins', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Chia Seeds', 'Chia seeds for export sourcing from Anteena Eximp.', true, 'published', 3),
  ('Red Chilli Powder', 'red-chilli-powder', 'Spices', '/images/categories/spices.webp', 'Indian red chilli powder sourced by colour, heat level, grind, moisture, and buyer specification.', 'Indian red chilli powder sourced by colour, heat level, grind, moisture, and buyer specification.', 'India', 'As per order requirement', '10 kg / 25 kg / 50 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Red Chilli Powder', 'Indian red chilli powder for export sourcing from Anteena Eximp.', true, 'published', 4),
  ('Cumin', 'cumin', 'Spices', '/images/categories/spices.webp', 'Cumin supplied as whole seeds or powder for spice distributors, processors, and wholesale buyers.', 'Cumin supplied as whole seeds or powder for spice distributors, processors, and wholesale buyers.', 'India', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Cumin', 'Cumin for export sourcing from Anteena Eximp.', false, 'published', 5),
  ('Turmeric', 'turmeric', 'Spices', '/images/categories/spices.webp', 'Turmeric options prepared around buyer-defined curcumin, colour, moisture, form, and packing requirements.', 'Turmeric options prepared around buyer-defined curcumin, colour, moisture, form, and packing requirements.', 'India', 'As per order requirement', '10 kg / 25 kg / 50 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Turmeric', 'Turmeric for export sourcing from Anteena Eximp.', false, 'published', 6),
  ('Coriander', 'coriander', 'Spices', '/images/categories/spices.webp', 'Coriander available as seeds or powder for spice blending, food service, wholesale, and ingredient sourcing.', 'Coriander available as seeds or powder for spice blending, food service, wholesale, and ingredient sourcing.', 'India', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Coriander', 'Coriander for export sourcing from Anteena Eximp.', false, 'published', 7),
  ('Black Pepper', 'black-pepper', 'Spices', '/images/categories/spices.webp', 'Black pepper supplied for food distributors, spice processors, and wholesale buyers against agreed grade and packing.', 'Black pepper supplied for food distributors, spice processors, and wholesale buyers against agreed grade and packing.', 'India', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Black Pepper', 'Black pepper for export sourcing from Anteena Eximp.', false, 'published', 8),
  ('Asafoetida', 'asafoetida', 'Spices', '/images/categories/spices.webp', 'Asafoetida options for spice brands, food manufacturers, and distributors, supplied against agreed blend and packing needs.', 'Asafoetida options for spice brands, food manufacturers, and distributors, supplied against agreed blend and packing needs.', 'India', 'As per order requirement', '1 kg / 5 kg / 10 kg cartons or buyer-defined packing', 'Confirmed during quotation', 'Asafoetida', 'Asafoetida for export sourcing from Anteena Eximp.', false, 'published', 9),
  ('Cardamom', 'cardamom', 'Spices', '/images/categories/spices.webp', 'Cardamom supplied by capsule size, colour, aroma, moisture, and destination-market packing expectations.', 'Cardamom supplied by capsule size, colour, aroma, moisture, and destination-market packing expectations.', 'India', 'As per order requirement', '5 kg / 10 kg cartons or buyer-defined packing', 'Confirmed during quotation', 'Cardamom', 'Cardamom for export sourcing from Anteena Eximp.', false, 'published', 10),
  ('Fennel Seeds', 'fennel-seeds', 'Spices', '/images/categories/spices.webp', 'Fennel seeds for spice distribution, food service, and processing, prepared around purity, aroma, and packing requirements.', 'Fennel seeds for spice distribution, food service, and processing, prepared around purity, aroma, and packing requirements.', 'India', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Fennel Seeds', 'Fennel seeds for export sourcing from Anteena Eximp.', false, 'published', 11),
  ('Fenugreek Seeds', 'fenugreek-seeds', 'Spices', '/images/categories/spices.webp', 'Fenugreek seeds supplied for spice buyers, processors, and distributors based on agreed purity, moisture, and packing.', 'Fenugreek seeds supplied for spice buyers, processors, and distributors based on agreed purity, moisture, and packing.', 'India', 'As per order requirement', '10 kg / 25 kg bags or buyer-defined packing', 'Confirmed during quotation', 'Fenugreek Seeds', 'Fenugreek seeds for export sourcing from Anteena Eximp.', false, 'published', 12),
  ('As Per Requirement Products', 'custom-requirement-products', 'Spices', '/images/cta/commodities.webp', 'If your required agricultural product is not listed, Anteena Eximp can review sourcing possibilities based on product, quantity, destination, and specification.', 'If your required agricultural product is not listed, Anteena Eximp can review sourcing possibilities based on product, quantity, destination, and specification.', 'India', 'As per order requirement', 'Buyer-defined packing', 'Confirmed during quotation', 'As Per Requirement Products', 'Custom agricultural product sourcing from Anteena Eximp.', false, 'published', 13)
on conflict (slug) do nothing;

insert into public.cms_testimonials
  (customer_name, company, country, photo_url, product, review, rating, display_order, visible, featured)
values
  ('Michael Anderson', 'NorthStar Foods', 'Canada', null, 'Garlic Powder', 'Excellent garlic powder quality. Export documentation was clear, communication was transparent, and the shipment arrived on schedule.', 5, 1, true, true),
  ('Aisha Rahman', 'Gulf Spice Trading', 'United Arab Emirates', null, 'Red Chilli Powder', 'Anteena Eximp handled our chilli powder requirement professionally. The colour, packing, and response time matched our buying expectations.', 5, 2, true, true),
  ('Daniel Weber', 'Euro Ingredient Supply', 'Germany', null, 'Chia Seeds', 'The chia seed lots were clean and well packed. Their team clarified specifications before quotation, which saved time for our procurement team.', 5, 3, true, true),
  ('Sofia Martinez', 'Andes Food Importers', 'Chile', null, 'Turmeric', 'Reliable follow-up and practical export support. We appreciated the written confirmations on packing, documents, and shipment scope.', 5, 4, true, false),
  ('James O''Connor', 'Pacific Wholesale Foods', 'Australia', null, 'Onion Powder', 'Our onion powder inquiry was handled with strong attention to mesh size, packing, and lead time. The process felt organised from the start.', 5, 5, true, false),
  ('Nadia Khan', 'Crescent Retail Group', 'United Kingdom', null, 'Cumin', 'Good communication and dependable documentation support. Anteena Eximp gave us the clarity we needed before placing our spice order.', 5, 6, true, false),
  ('Kenji Tanaka', 'Tokyo Food Partners', 'Japan', null, 'Black Pepper', 'The team was responsive on specification details and packing options. Their approach made supplier evaluation much easier.', 5, 7, true, false),
  ('Lucas Meyer', 'Continental Ingredients', 'Netherlands', null, 'Coriander', 'Professional service, clear product details, and timely communication. We would consider Anteena Eximp again for future spice sourcing.', 5, 8, true, false)
on conflict do nothing;

insert into public.cms_product_badges (product_id, label, display_order)
select id, 'Food Grade', 1 from public.cms_products
where not exists (select 1 from public.cms_product_badges where product_id = cms_products.id and label = 'Food Grade');

insert into public.cms_product_badges (product_id, label, display_order)
select id, 'Export Quality', 2 from public.cms_products
where not exists (select 1 from public.cms_product_badges where product_id = cms_products.id and label = 'Export Quality');

insert into public.cms_product_badges (product_id, label, display_order)
select id, 'Buyer Specification', 3 from public.cms_products
where not exists (select 1 from public.cms_product_badges where product_id = cms_products.id and label = 'Buyer Specification');

insert into public.cms_product_specifications (product_id, label, value, display_order)
select id, 'Origin', origin, 1 from public.cms_products
where not exists (select 1 from public.cms_product_specifications where product_id = cms_products.id and label = 'Origin');

insert into public.cms_product_specifications (product_id, label, value, display_order)
select id, 'Packing', packaging, 2 from public.cms_products
where not exists (select 1 from public.cms_product_specifications where product_id = cms_products.id and label = 'Packing');

insert into public.cms_product_specifications (product_id, label, value, display_order)
select id, 'MOQ', moq, 3 from public.cms_products
where not exists (select 1 from public.cms_product_specifications where product_id = cms_products.id and label = 'MOQ');

insert into public.cms_product_applications (product_id, value, display_order)
select id, 'Importers and wholesale buyers', 1 from public.cms_products
where not exists (select 1 from public.cms_product_applications where product_id = cms_products.id and value = 'Importers and wholesale buyers');

insert into public.cms_product_applications (product_id, value, display_order)
select id, 'Food processing and ingredient sourcing', 2 from public.cms_products
where not exists (select 1 from public.cms_product_applications where product_id = cms_products.id and value = 'Food processing and ingredient sourcing');
