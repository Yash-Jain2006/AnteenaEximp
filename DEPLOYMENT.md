# Anteena Eximp Website Deployment Notes

## Local run

npm install
npm run dev
Open `http://localhost:3000`.

## Required production environment variables

Create `.env.local` locally and matching environment variables on your hosting platform:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
CONTACT_TO_EMAIL=
ADMIN_EMAILS=
FORM_RATE_LIMIT_PER_MINUTE=
IP_HASH_SALT=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

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

