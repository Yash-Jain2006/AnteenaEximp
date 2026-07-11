# Anteena Eximp Website Deployment Notes

## Local run

```powershell
cd "C:\Users\yeash\OneDrive\Documents\New project"
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required production environment variables

Create `.env.local` locally and matching environment variables on your hosting platform:

```env
NEXT_PUBLIC_SITE_URL=https://anteenaeximp.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919302714134
CONTACT_TO_EMAIL=anteenaeximp@gmail.com,divyanshtotla18@gmail.com
ADMIN_EMAILS=anteenaeximp@gmail.com,divyanshtotla18@gmail.com
FORM_RATE_LIMIT_PER_MINUTE=10
IP_HASH_SALT=replace-with-a-long-random-secret

RESEND_API_KEY=
RESEND_FROM_EMAIL=Anteena Eximp <noreply@anteenaeximp.com>

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Do not commit `.env.local`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create an Auth user for the admin email.
4. Add that email to `ADMIN_EMAILS`.
5. Use the public anon key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
6. Use the service role key only for `SUPABASE_SECRET_KEY` on the server/host.

## Resend email setup

1. Verify the sending domain in Resend.
2. Set `RESEND_API_KEY`.
3. Use a verified sender in `RESEND_FROM_EMAIL`.

## Domain and business email

Point `anteenaeximp.com` to the deployed host using the hosting provider's DNS instructions. For business email, configure Google Workspace, Zoho Mail, or another mail provider and add the provider's MX/SPF/DKIM records in the domain DNS panel.
