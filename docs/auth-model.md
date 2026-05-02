# Auth Model

## Final auth decision

- clients do not use Supabase Auth;
- staff uses Supabase Auth;
- CRM is staff-only;
- booking is public.

The product principle is simple:

- clients need speed;
- staff need security;
- owners need control.

## Public client flow

1. Choose service.
2. Choose master.
3. Choose date/time.
4. Enter name and phone.
5. Create appointment.

Clients do not create accounts in the MVP.

## Staff roles

- owner;
- admin;
- master.

## Role permissions matrix

owner:
- full access to CRM;
- manage clients;
- manage services;
- manage masters;
- manage appointments;
- view dashboard and analytics;
- view and manage salon settings.

admin:
- manage clients;
- manage services;
- manage masters;
- manage appointments;
- view dashboard and analytics;
- cannot view or manage salon settings in the current MVP.

master:
- future limited schedule access;
- no full CRM access yet;
- does not see clients, revenue, services, masters, appointments management, analytics or settings;
- `/admin` shows a safe limited-mode message.

## Current MVP limitation

- master mode requires a future mapping between `profiles` and the `masters` table;
- staff invite system is future work;
- current owner/admin actions are enforced in server actions;
- permissions complement Supabase RLS and do not replace it;
- RLS still protects salon-owned data.

## Routes

Public:
- `/`
- `/services`
- `/masters`
- `/booking`
- `/booking/success` later
- `/booking/manage/[token]` later
- `/contacts`

Auth:
- `/login`

Disabled:
- `/register`

CRM:
- `/admin`
- `/admin/appointments`
- `/admin/clients`
- `/admin/services`
- `/admin/masters`
- `/admin/analytics`
- `/admin/settings`

Legacy:
- `/dashboard` redirects to `/admin`.

## Staff account creation for MVP

MVP approach:
- staff accounts are created manually in Supabase Auth;
- profile rows are created manually or by controlled admin flow later;
- open public registration is disabled.

## Future invite system

Later:
- owner invites admin/master;
- invited user sets password;
- profile role is assigned.

## RLS principles

- clients cannot read CRM data;
- public booking must not expose all clients/appointments;
- staff data access is role-based;
- private server keys may be used only in server-only code later if needed;
- private server keys must never be exposed to browser.

## Stage 1.4 admin context

Implemented admin context foundation:
- `/admin` reads the current Supabase Auth user on the server;
- `/admin` reads the matching `profiles` row through RLS;
- `/admin` reads the current `salons` row through RLS;
- admin shell shows salon name and staff role;
- missing profile and missing salon states are safe, user-facing screens.

Next step:
- clients CRUD, starting with protected read/list patterns and validation.
