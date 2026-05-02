# Auth Plan

## Current auth status

Stage 1.2 pivots Mini Beauty CRM / BeautyBook CRM to staff-only CRM auth.

Implemented:
- `/login` is staff-only and uses Supabase Auth sign-in.
- `/register` is disabled as an open public registration page.
- `/admin` is the CRM area for staff.
- `/dashboard` is a legacy redirect to `/admin`.
- Public booking is designed for clients without accounts.

Not implemented yet:
- staff invite flow;
- role-based admin/master permissions in UI;
- public booking creation action;
- clients/services/masters/appointments CRUD.

## Required manual Supabase setup

Manual setup:

1. Create Supabase project.
2. Copy project URL and publishable/anon key.
3. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
# or, for older Supabase projects:
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Apply migration manually via Supabase SQL Editor or Supabase CLI only after review.
5. Do not add private server keys to frontend app.
6. Restart dev server after changing env.

## Staff account setup for MVP

Open public registration is disabled.

For MVP:
- create staff users manually in Supabase Auth;
- create matching `public.profiles` rows manually or through a controlled admin flow later;
- assign `role` as `owner`, `admin`, or `master`;
- create/select salon ownership according to RLS policy.

## Login flow

1. Staff member submits email and password at `/login`.
2. Supabase Auth creates the session.
3. Staff member is redirected to `/admin`.
4. `/admin` checks session and profile.

If profile is missing, `/admin` shows:
“Профиль сотрудника не настроен. Обратитесь к владельцу салона.”

## Logout flow

1. Staff member submits logout action in the CRM header.
2. Supabase Auth clears the session.
3. Staff member is redirected to `/login`.

## Client booking flow

Clients do not use Supabase Auth.

Public booking will later collect only the fields required for appointment creation, starting with name and phone, and must not expose CRM data.

## RLS assumptions

- `profiles.id` equals `auth.users.id`.
- `salons.owner_id` equals `auth.uid()` for owner access in the MVP schema.
- Salon-owned tables are scoped through `salon_id`.
- RLS policies are the enforcement layer.
- Frontend checks are convenience only, not security boundaries.

## Next step after auth pivot

Recommended next stage:
- create a staff setup checklist for manual Supabase Auth users and profiles;
- verify `/admin` access with one test staff user;
- then implement first protected CRM read-only data checks before CRUD.
