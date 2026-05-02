# Mini Beauty CRM Product Spec

## Product vision

Mini Beauty CRM helps small beauty salons in Saint Petersburg present a public salon website, accept online bookings and manage clients, services, masters, appointments, schedules, statuses and simple analytics in one clean CRM dashboard.

The MVP should feel like a real working SaaS for a small salon: calm interface, fast daily workflows, reliable appointments, safe handling of client data, and clear Russian localization.

The product includes three connected surfaces:
- public salon website;
- online booking;
- CRM dashboard.

## Target users

- Client: discovers the salon, chooses a service/master/time and submits an online booking.
- Owner: manages salon profile, services, staff, analytics, access and business settings.
- Administrator: creates clients, books and edits appointments, tracks daily schedule and visit statuses.
- Master: views own schedule, client context needed for the visit, and appointment status.

## MVP stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Supabase RLS
- React Hook Form
- Zod
- Recharts
- Vercel

## Core pages

Public:
- `/`
- `/services`
- `/masters`
- `/booking`
- `/contacts`
- `/login`
- `/register`
- `/portfolio` later
- `/reviews` later
- `/profile` later

Private:
- `/dashboard`
- `/clients`
- `/clients/[id]`
- `/dashboard/services`
- `/dashboard/masters`
- `/appointments`
- `/analytics`
- `/settings`

Route note:
- public `/services` and `/masters` are salon-facing pages;
- CRM management of services and masters should use `/dashboard/services` and `/dashboard/masters` to avoid route conflicts;
- `/admin` can be added later as a redirect to `/dashboard`, not as the primary MVP path.

## Core entities

- Profile
- Salon
- Client
- Service
- Master
- Appointment
- AppointmentStatus
- Settings
- ClientNote later
- Reminder later
- AuditLog later

## Core flows

1. Register.
2. Create profile.
3. Create first salon.
4. Login.
5. Open dashboard.
6. Client opens public site.
7. Client views services/masters/contacts.
8. Client starts online booking.
9. Client selects service.
10. Client selects master or "любой подходящий".
11. Client selects date/time.
12. Client enters name and phone.
13. Booking creates a scheduled appointment.
14. Administrator creates/searches client.
15. Administrator creates service.
16. Administrator creates master.
17. Administrator creates appointment.
18. Auto-copy price and duration.
19. Calculate end_time.
20. Prevent double-booking.
21. Change appointment status.
22. View client history.
23. View analytics.

## MVP definition

MVP is complete when:

- auth works;
- private routes are protected;
- public landing works;
- online booking MVP creates scheduled appointments;
- salon is created for owner;
- clients CRUD works;
- services CRUD works;
- masters CRUD works;
- appointments CRUD works;
- appointment status changes work;
- basic dashboard works;
- basic analytics works;
- RLS prevents cross-salon data access;
- UI has loading/error/empty states;
- project can be deployed to Vercel;
- README explains setup.

## Non-goals for MVP

- Prisma;
- TanStack Query;
- payroll;
- complex accounting;
- inventory;
- multi-branch enterprise logic;
- advanced marketing automation;
- complex SMS/WhatsApp integration;
- online payment;
- complex public client account;
- public portfolio/reviews unless explicitly requested for a later phase.
