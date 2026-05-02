# Deploy Notes

## Current production

- Initial Vercel deploy: completed.
- Production URL: https://beautybook-crm.vercel.app/
- Supabase environment variables are configured in Vercel.
- Keep `.env.local` out of git and never paste private credentials into docs.

## Target

- Vercel for the Next.js app.
- Supabase hosted project for database and auth.

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase setup

- Create a Supabase project.
- Apply the migration.
- Configure Auth.
- Create the owner user manually.
- Create the matching profile row.
- Create the salon row.
- Verify RLS.
- Never expose private server keys.

## Vercel setup

- Import the repository.
- Add environment variables.
- Run build.
- Check deployment logs.
- Open the production URL.
- Verify `/login` and `/admin` protection.

Initial production deploy is completed. Keep these notes for future redeploys or environment checks.

## Production smoke

- Public pages.
- Login.
- `/admin`.
- Clients.
- Services.
- Masters.
- Appointments.
- Settings.
- Mobile viewport.

## Known MVP limitations

- Public booking preview only.
- No payments.
- No notifications.
- No staff invite flow.
- No automated tests.
- No DB-level conflict guard.
