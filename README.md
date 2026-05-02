# BeautyBook CRM

BeautyBook CRM is a mini CRM and online booking website for a beauty salon. It combines a public salon website, staff-only CRM, client management, service catalog, master management, appointment scheduling, salon settings and lightweight analytics.

## Overview

BeautyBook CRM is built for small beauty salons that need one practical system for daily operations: keeping a client base, managing services and masters, creating appointments, preventing double-booking and seeing basic revenue signals.

The product separates two user experiences:

- clients use the public website and future online booking without creating an account;
- salon staff use a protected CRM with Supabase Auth.

This keeps booking fast for clients while keeping CRM data private and staff-only.

## Demo Status

- The project runs locally.
- Supabase is connected.
- The database migration exists in `supabase/migrations/001_initial_schema.sql`.
- The owner account is created manually in Supabase Auth for the MVP.
- Public booking is currently a preview screen.
- Staff CRM CRUD workflows are implemented and manually verified.
- Mobile UX polish has been completed for the portfolio MVP.

## Preview

### CRM Dashboard

![CRM Dashboard](docs/screenshots/05-crm-dashboard-owner.png)

### Appointment Management

![Appointments](docs/screenshots/12-appointments.png)

### Client Profile

![Client Profile](docs/screenshots/09-client-profile.png)

### Mobile Experience

![Mobile Public Page](docs/screenshots/02-home-mobile.png)

![Mobile CRM Dashboard](docs/screenshots/14-crm-mobile-dashboard.png)

See the full screenshot inventory in [Screenshots guide](docs/screenshots-guide.md).

## Core Features

### Public Site

- Home page with salon/product positioning.
- Public services page.
- Public masters page.
- Booking preview page.
- Contacts page.
- Disabled public registration page.
- Client booking without account as the product concept.

### Staff CRM

- Staff-only login.
- Protected `/admin` area.
- Owner/admin/master role permissions.
- Owner dashboard with real Supabase data.
- Client list, search and create flow.
- Client profile with editable data, visit history and stats.
- Service catalog management with active/inactive status.
- Master management with active/inactive status.
- Appointment management.
- Create appointment from CRM.
- Edit scheduled appointments.
- Change appointment status.
- Client preselect/filter from client profile.
- Master/date/status/client filters.
- Appointment conflict detection by master/date/time.
- Salon working hours validation.
- Salon settings with profile and working hours.
- Revenue and dashboard analytics based on completed appointments.

### Security

- Supabase Auth for staff.
- Supabase RLS for salon-owned data.
- No service role key in the client.
- Server-side admin context from the current user/profile/salon.
- Salon-scoped reads and writes.
- Role-based permissions for owner, admin and master.
- Privacy-first UI and safe error messages.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase RLS
- Server Actions
- Zod
- npm

## Project Structure

- `src/app` - App Router pages and route-level UI.
- `src/app/admin` - protected staff CRM routes.
- `src/lib` - Supabase helpers, server actions, queries, validation and business utilities.
- `src/components` - public and CRM UI components.
- `supabase/migrations` - deterministic database migrations.
- `docs` - product, architecture, security and portfolio documentation.

## Documentation

- [Portfolio case](docs/portfolio-case.md)
- [Final MVP status](docs/final-mvp-status.md)
- [Manual QA checklist](docs/manual-qa-checklist.md)
- [Deploy notes](docs/deploy-notes.md)
- [Release checklist](docs/release-checklist.md)
- [Screenshots guide](docs/screenshots-guide.md)

## Routes

### Public

- `/`
- `/services`
- `/masters`
- `/booking`
- `/contacts`
- `/login`
- `/register` disabled

### Admin

- `/admin`
- `/admin/clients`
- `/admin/clients/[id]`
- `/admin/services`
- `/admin/masters`
- `/admin/appointments`
- `/admin/settings`
- `/admin/analytics`

### Legacy

- `/dashboard` redirects to `/admin`.

## Auth Model

Clients do not use Supabase Auth in the MVP. They should be able to book quickly without creating an account.

Staff uses Supabase Auth:

- `owner`
- `admin`
- `master`

Current MVP status:

- owner is fully supported;
- admin/master permission logic is implemented;
- admin can work with CRM operations but cannot manage salon settings;
- master sees a limited-mode screen until master schedule access is implemented;
- staff invites are future work.

## Database Model

Main tables:

- `profiles`
- `salons`
- `clients`
- `services`
- `masters`
- `appointments`

Important rules:

- every salon-owned table is scoped by `salon_id`;
- `appointments.price` stores a snapshot of the service price at booking time;
- `appointments.end_time` is calculated from `services.duration_minutes`;
- scheduled appointments block overlapping slots for the same master;
- cancelled, completed and no-show appointments do not block future slots;
- revenue metrics are based on completed appointments;
- RLS remains the database boundary and permissions complement it.

## Environment Variables

Create `.env.local` locally:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local`.

The MVP does not require a service role key. Do not expose private Supabase keys to the browser.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

Supabase must be created separately. Apply the SQL migration through the Supabase SQL editor or Supabase CLI if your local workflow supports it.

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL.
3. Copy the publishable/anon key.
4. Create `.env.local` with the public Supabase values.
5. Apply `supabase/migrations/001_initial_schema.sql`.
6. Create a staff user manually in Supabase Authentication.
7. Create a matching `profiles` row.
8. Create a `salons` row for the owner.
9. Log in through `/login`.

Never paste real keys, passwords, cookies, tokens or client data into documentation.

## Manual QA Checklist

- Login and logout.
- Logged-out `/admin` redirects to `/login?reason=staff_only`.
- Clients list, search and create.
- Client profile, edit, visit history and appointment links.
- Services create and active/inactive toggle.
- Masters create and active/inactive toggle.
- Appointments create, edit scheduled appointment and change status.
- Appointment conflict detection.
- Working hours validation.
- Salon settings update by owner.
- Role permissions for owner/admin/master.
- Mobile mode for public pages and CRM pages.
- `npm run build`.

## Current MVP Limitations

- Public booking is preview only.
- No payments.
- No notifications.
- No staff invite system.
- No real master schedule.
- No database-level appointment conflict guard yet.
- No automated tests yet.
- Deployment is not configured yet.

## Future Improvements

- Public booking server action.
- Booking success page.
- Token-based booking management.
- Telegram/email reminders.
- Database-level appointment conflict guard.
- Staff invites.
- Master schedule and availability.
- Calendar view.
- Payments or prepayments.
- Analytics charts.
- Automated tests.
- Production deploy.

## Portfolio Notes

BeautyBook CRM demonstrates:

- full-stack Next.js App Router development;
- Supabase Auth and RLS;
- secure CRM architecture;
- role-based permissions;
- server-side validation;
- appointment business logic;
- salon-scoped data access;
- privacy-aware product decisions;
- mobile responsive UI;
- practical SaaS product thinking.
