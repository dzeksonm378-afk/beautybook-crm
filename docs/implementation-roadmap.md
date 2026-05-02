# Implementation Roadmap

Each stage should be delivered as a small reviewable diff with tests and verification appropriate to the risk.

## Stage 0 — Project setup

Goal: create a clean Next.js foundation.

Tasks:
- create Next.js project;
- TypeScript;
- ESLint;
- Tailwind;
- `src` directory;
- App Router;
- alias `@/*`;
- install shadcn/ui;
- connect Supabase;
- create GitHub repo.

Suggested skills: `project-bootstrap`, `ui-feature`.

Tests needed: initial lint/typecheck/build once scripts exist.

Browser verification: open `/`, verify the app renders, console is clean, mobile viewport is not broken.

Security/RLS checks: no secrets committed, `.env.example` only, Supabase client keys documented safely.

Done criteria: app runs locally, README has setup commands, no unapproved dependencies beyond the chosen stack.

## Stage 1 — Database

Goal: create salon-scoped schema with RLS.

Tasks: profiles, salons, clients, services, masters, appointments, constraints, indexes, RLS, seed data.

Suggested skills: `data-model-review`, `supabase-rls-review`.

Tests needed: migration dry-run/manual SQL checks, RLS isolation checks for two users/salons.

Browser verification: not required unless UI is also touched.

Security/RLS checks: all public tables have RLS enabled and policies are salon-scoped.

Done criteria: migrations are deterministic, seed data is fake, cross-salon access is blocked.

## Stage 2 — Auth

Goal: users can register, login and get a first salon.

Tasks: `/register`, `/login`, logout, middleware protection, create profile after registration, create first salon after registration.

Suggested skills: `feature-implementation`, `api-integration`, `privacy-security-check`.

Tests needed: validation, protected route behavior, profile/salon creation, unauthorized access.

Browser verification: register, login, logout, refresh/session restore, protected route redirects.

Security/RLS checks: safe auth errors, no session/token logs, no profile takeover.

Done criteria: private routes require auth and owner onboarding is reliable.

## Stage 3 — Public landing + CRM layout foundation

Goal: create a clear public entry point and a usable SaaS shell without connecting all CRM logic yet.

Tasks: public landing, public navigation, booking CTA, sidebar, header, mobile nav, dashboard route group, navigation links, responsive layout.

Suggested skills: `ui-feature`, `browser-qa`.

Tests needed: basic render tests if test framework exists.

Browser verification: public homepage CTAs, desktop/tablet/mobile navigation, long Russian labels, active CRM links.

Security/RLS checks: private layout must not render CRM data before auth is confirmed.

Done criteria: public landing explains the salon/booking entry, CRM navigation feels stable and all planned routes have placeholders.

## Stage 4 — Clients CRUD

Goal: manage client records safely.

Tasks: client table, search by name/phone, add/edit/delete, client profile page, visit history.

Suggested skills: `crm-client-feature`, `privacy-security-check`, `api-integration`.

Tests needed: validation, phone normalization, duplicate warning, unauthorized access, RLS.

Browser verification: list/search/create/edit/delete/profile/empty/error/mobile states.

Security/RLS checks: no client names/phones/notes in logs; salon isolation enforced.

Done criteria: client workflow is fast and does not leak personal data.

## Stage 5 — Services CRUD

Goal: manage the service catalog.

Tasks: table, add/edit, active/inactive, categories, price/duration validation.

Suggested skills: `crm-service-master-feature`, `ui-feature`.

Tests needed: validation, active filtering, appointment dependency behavior.

Browser verification: create/edit/disable, long titles, ₽ formatting, mobile table.

Security/RLS checks: services are salon-scoped.

Done criteria: services can safely feed appointments with price and duration.

## Stage 6 — Masters CRUD

Goal: manage staff shown in scheduling.

Tasks: table, add/edit, active/inactive, filter active masters.

Suggested skills: `crm-service-master-feature`, `privacy-security-check`.

Tests needed: validation, active filtering, salon isolation.

Browser verification: create/edit/disable, contact fields, long names, mobile layout.

Security/RLS checks: staff contacts are not logged or exposed cross-salon.

Done criteria: only active masters are selectable for new appointments.

## Stage 7 — Appointments

Goal: create reliable booking workflow.

Tasks: create appointment, select client, select service, copy price and duration, select master, select date/time, calculate `end_time`, list appointments, filters by date/master/status, change status, prevent conflicts.

Suggested skills: `crm-appointment-feature`, `supabase-rls-review`, `browser-qa`, `regression-test`.

Tests needed: overlap detection, status behavior, price snapshot, duration/end_time, working hours, authorization.

Browser verification: create, conflict, reschedule, cancel, status changes, filters, mobile.

Security/RLS checks: appointments are salon-scoped; comments are not logged.

Done criteria: active appointments cannot double-book the same master.

## Stage 7.5 — Public online booking MVP

Goal: let a client create a scheduled appointment through `/booking` while reusing the same appointment rules as CRM.

Tasks: service selection, optional service details placeholder, master selection or "любой подходящий", date/time slot selection, client name/phone, confirmation, final conflict recheck.

Suggested skills: `crm-appointment-feature`, `crm-client-feature`, `privacy-security-check`, `browser-qa`.

Tests needed: service active filtering, master active filtering, phone validation, price snapshot, duration/end_time, overlap prevention, final slot conflict.

Browser verification: complete booking, empty services, empty slots, invalid phone, conflict after selected slot, mobile flow.

Security/RLS checks: public booking must not expose client data, internal IDs, appointment comments or other clients' slots; all created data must be salon-scoped.

Done criteria: online booking creates a `scheduled` appointment, copies service price, calculates `end_time` and cannot double-book an active master.

## Stage 8 — Dashboard

Goal: show daily operating summary.

Tasks: appointments today, total clients, revenue this month, upcoming appointments, popular services, mini revenue chart.

Suggested skills: `ui-feature`, `api-integration`.

Tests needed: analytics calculations from completed appointments only.

Browser verification: empty/data states, chart render, mobile cards.

Security/RLS checks: dashboard queries are scoped by salon.

Done criteria: owner/admin can understand today and month quickly.

## Stage 9 — Analytics

Goal: provide basic business insight.

Tasks: monthly revenue, completed appointments, popular services, best masters, new clients, repeat clients.

Suggested skills: `data-model-review`, `ui-feature`.

Tests needed: date range calculations, status filters, salon isolation.

Browser verification: charts/tables render, date filter works, empty state is useful.

Security/RLS checks: all analytics data is salon-scoped.

Done criteria: numbers are explainable and based on completed appointments.

## Stage 10 — Polish and deployment

Goal: prepare MVP for portfolio/demo deployment.

Tasks: empty states, loading states, error states, mobile check, seed data, README, screenshots, Vercel deploy, portfolio case.

Suggested skills: `pre-merge-review`, `browser-qa`, `privacy-security-check`.

Tests needed: full regression suite and build.

Browser verification: main flows, mobile, console/network, deployed URL smoke test.

Security/RLS checks: no secrets, no real personal data, RLS policies reviewed.

Done criteria: release checklist is green and README explains setup.
