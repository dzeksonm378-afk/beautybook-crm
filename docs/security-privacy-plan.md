# Security and Privacy Plan

This is not legal advice, but the CRM handles personal client data and must be designed carefully.

## Personal data inventory

- client full name;
- client phone;
- client email;
- birthday;
- notes;
- visit history;
- appointment comments;
- staff contact info;
- salon business data;
- auth/session data.

## Sensitive data rules

Risk: accidental exposure of personal or business data.

What to check:
- no personal data in logs;
- no secrets in repo;
- no private server key in client;
- safe error messages;
- protected exports;
- auth required;
- role-based access;
- RLS required.

Likely files: `src/actions`, `src/lib/supabase`, `middleware.ts`, `supabase/migrations`, API routes if added.

Suggested tests: log scan, invalid input errors, unauthorized requests, cross-salon access attempts.

Suggested Codex skill: `privacy-security-check`.

Priority: P0.

## Supabase security

Risk: tenant data leakage between salons.

What to check:
- RLS on all public tables;
- policies scoped by `salon_id`;
- no cross-salon reads;
- no cross-salon writes;
- safe profile/salon creation;
- test policies with different users.

Likely files: `supabase/migrations`, `src/lib/supabase`, `src/actions`.

Suggested tests: two users with two salons, SELECT/INSERT/UPDATE/DELETE isolation checks.

Suggested Codex skill: `supabase-rls-review`.

Priority: P0.

## Auth/session review

Risk: private pages or actions work without a valid session.

What to check: middleware, server action user lookup, redirects, session restore, logout, expired sessions.

Likely files: `middleware.ts`, `src/app/(auth)`, `src/app/(dashboard)`, `src/actions`.

Suggested tests: direct private URL, refresh, expired session, logout then back button.

Suggested Codex skill: `privacy-security-check`.

Priority: P0.

## Role-based access control

Risk: a master or admin performs owner-only actions.

What to check: role source of truth, permission checks in server actions, settings access, delete operations.

Likely files: `src/constants`, `src/actions`, dashboard layout, settings pages.

Suggested tests: role matrix for owner/admin/master.

Suggested Codex skill: `privacy-security-check`.

Priority: P1 for MVP if only owner exists; P0 once multiple roles are active.

Current MVP implementation:
- permissions are defined in `src/lib/admin/permissions.ts`;
- role is read from the server-side `profiles` row through `getAdminContext()`;
- client-provided roles are not trusted;
- owner has full access;
- admin can operate CRM sections but cannot access salon settings;
- master has no full CRM access and sees a limited-mode screen on `/admin`;
- server actions for clients, services, masters, appointments and settings enforce permissions before writes;
- `salon_id` still comes from `getAdminContext()` and RLS remains the database boundary.

## IDOR prevention

Risk: changing an id in the URL exposes another salon's data.

What to check: every read/write scopes by current user's salon and RLS policy.

Likely files: `[id]` pages, server actions, Supabase queries.

Suggested tests: request another salon's client/appointment/service/master id.

Suggested Codex skill: `privacy-security-check`.

Priority: P0.

## Client data privacy

Risk: names, phones, notes and visit history are exposed or logged.

What to check: logs, errors, exports, table rendering, profile pages, search results.

Likely files: clients pages/components/actions.

Suggested tests: unauthorized client access, safe errors, log scan.

Suggested Codex skill: `crm-client-feature`.

Priority: P0.

## Appointment privacy

Risk: appointment comments and client history leak sensitive context.

What to check: appointment list, calendar views, comments, analytics source data.

Likely files: appointments pages/components/actions, dashboard, analytics.

Suggested tests: unauthorized appointment access, comment not logged, scoped analytics.

Suggested Codex skill: `crm-appointment-feature`.

Priority: P0.

## Audit logs later

Risk: no traceability for important changes once multiple staff roles exist.

What to check: future audit log model, event minimization, retention.

Likely files: future migrations/actions.

Suggested tests: change events recorded without sensitive notes unless required.

Suggested Codex skill: `data-model-review`.

Priority: P2.

## Input validation

Risk: invalid or unsafe data breaks scheduling, analytics or UI.

What to check: Zod schemas, server validation, phone normalization, date/time validation, numeric ranges.

Likely files: `src/lib/validations`, `src/actions`, forms.

Suggested tests: invalid phone/email/date/price/duration/status.

Suggested Codex skill: `api-integration`.

Priority: P0.

## CORS/CSRF/cookies depending on stack

Risk: unsafe session or cross-origin behavior.

What to check: Supabase auth helpers, middleware, cookie flags, server actions, any custom API routes.

Likely files: `middleware.ts`, `src/lib/supabase`, route handlers if added.

Suggested tests: auth redirects, logout, server action auth required.

Suggested Codex skill: `privacy-security-check`.

Priority: P0.

## File upload safety if uploads are added

Risk: malicious files or private files exposed.

What to check: bucket policies, file type/size limits, signed URLs, private buckets.

Likely files: future storage helpers and Supabase policies.

Suggested tests: wrong type, oversized file, cross-salon access.

Suggested Codex skill: `privacy-security-check`.

Priority: P2 until uploads exist.

## Data export/import safety

Risk: bulk personal data export leaks client base.

What to check: owner-only access, audit logs, safe formats, no public URLs.

Likely files: future export/import actions and routes.

Suggested tests: role checks, scoped exports, no sensitive errors.

Suggested Codex skill: `privacy-security-check`.

Priority: P2 until exports exist.

## Dependency/security audit

Risk: vulnerable or unnecessary packages increase attack surface.

What to check: dependency diffs, lockfile changes, package purpose, audit output.

Likely files: `package.json`, lock files.

Suggested tests: package manager audit when available, build/lint/typecheck.

Suggested Codex skill: `pre-merge-review`.

Priority: P1.

## Production readiness checklist

Risk: deploying with debug state, secrets, broken RLS or unsafe demo data.

What to check:
- tests/lint/typecheck/build pass;
- no secrets or real personal data;
- RLS reviewed;
- migrations reviewed;
- browser smoke completed;
- environment variables documented, not committed;
- Vercel deployment checked.

Likely files: whole repo, Vercel settings, Supabase dashboard.

Suggested tests: release checklist plus browser verification.

Suggested Codex skill: `pre-merge-review`.

Priority: P0 before deployment.
