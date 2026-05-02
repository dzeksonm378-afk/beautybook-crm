# Mini Beauty CRM — Codex Instructions

## Project context

Product:
Mini Beauty CRM — мини-CRM для салонов красоты в Санкт-Петербурге.

Target users:
- owner;
- administrator;
- master.

Locale/business assumptions:
- language: Russian;
- locale: ru-RU;
- city: Санкт-Петербург;
- timezone: Europe/Moscow;
- currency: RUB / ₽;
- phone format: Russian phone numbers, preferably +7;
- date/time UI should be natural for Russian users.

Core product areas:
- clients;
- services;
- masters;
- appointments;
- calendar/schedule;
- dashboard;
- analytics;
- settings;
- auth;
- roles and permissions;
- salon profile;
- reminders later;
- reports later.

## Preferred stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Postgres
- Supabase Auth
- Supabase RLS
- React Hook Form
- Zod
- Recharts
- Vercel

Rules:
- Do not add Prisma in MVP unless explicitly requested.
- Do not add TanStack Query in MVP unless there is a clear need.
- Prefer server components, server actions, Supabase SDK, simple typed utilities and clear validation.

## Product priorities

1. Reliable appointment management.
2. No double-booking.
3. Clean CRM UI.
4. Fast administrator workflow.
5. Correct validation.
6. Safe personal data handling.
7. Clear Russian localization.
8. Mobile-friendly interface.
9. Small reviewable diffs.
10. Tests for business-critical logic.

## Engineering rules

- Do not redesign architecture without explicit instruction.
- Keep changes small and reviewable.
- Reuse existing components, utilities, server actions, schemas and patterns.
- Use TypeScript strictly and avoid `any` unless justified.
- Validate inputs with Zod.
- Use React Hook Form for complex forms.
- Use shadcn/ui components when suitable.
- Keep UI consistent with Tailwind and existing design tokens.
- Do not hardcode secrets, tokens, credentials or private URLs.
- Do not add dependencies casually.
- Do not duplicate data access patterns.
- Prefer clear boring code over clever abstractions.

## Supabase rules

- Use RLS for salon-owned data.
- Every main table must be scoped by salon_id where applicable.
- Users must only access data for their salon.
- Never expose service_role key to the client.
- Do not bypass RLS without explicit reason.
- Keep migrations deterministic and reviewable.
- For data changes, consider indexes and constraints.
- Avoid destructive migrations without confirmation.

## CRM business rules

Be careful with:

- appointment conflict detection;
- master availability;
- salon working hours;
- service duration;
- appointment end_time calculation;
- appointment status transitions;
- cancellation/reschedule behavior;
- client duplicate detection;
- phone normalization;
- price snapshot in appointments;
- analytics based on completed appointments;
- role permissions;
- timezone Europe/Moscow.

Appointment invariants:
- start_time must be before end_time;
- appointment must belong to salon_id;
- appointment must have client_id;
- appointment must have service_id;
- appointment must have master_id if master selection is required;
- appointment end_time should be calculated from service duration unless explicitly changed;
- active appointments for the same master must not overlap;
- cancelled appointments should not block time unless product decision says otherwise;
- appointment.price should copy the service price at the moment of booking.

## Privacy/security rules

Treat CRM data as sensitive personal/business data.

Never log:
- client phone numbers;
- client names;
- appointment comments;
- client notes;
- birthdays;
- session IDs;
- cookies;
- tokens;
- passwords;
- Supabase keys;
- payment details.

Check for:
- missing authorization;
- IDOR;
- unsafe RLS policies;
- exposed client data;
- exposed internal IDs;
- unsafe exports;
- unsafe search;
- unsafe file uploads if added;
- sensitive error messages;
- weak session handling;
- role permission bypass.

## UI rules

For frontend changes, check:

- loading state;
- error state;
- empty state;
- success state;
- disabled state;
- long client names;
- long service names;
- long master names;
- mobile layout;
- tablet layout;
- calendar layout;
- Russian text rendering;
- ₽ prices;
- date/time formatting;
- console errors;
- network errors;
- keyboard navigation where relevant.

## Done means

A task is done only when:

- intended behavior works;
- relevant tests are added/updated;
- lint/typecheck/build/tests pass if available;
- browser verification is completed for UI work;
- CRM business rules are checked;
- privacy/security risks are checked;
- regression risks are checked;
- final report is provided.

## Final response format

Every coding task must end with:

1. Summary.
2. Files changed.
3. Tests/checks run.
4. Browser verification, if frontend was touched.
5. CRM business rules checked.
6. Supabase/RLS/security checks, if data/auth was touched.
7. Regression risks.
8. Remaining TODOs/risks.

Also include real project commands if discovered:
- install;
- dev;
- test;
- lint;
- typecheck;
- build.

Current discovered commands:
- install: `npm install`
- dev: `npm run dev`
- lint: `npm run lint`
- typecheck: `npm run typecheck`
- build: `npm run build`
- test: отсутствует

If commands are missing, say they need to be added.
