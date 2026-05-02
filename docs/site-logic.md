# Site and CRM Logic

Mini Beauty CRM / BeautyBook CRM is a mini CRM and online booking site for a small beauty salon in Saint Petersburg. This document defines the product logic before implementation so the project can grow without mixing public marketing pages, booking flows and internal CRM workflows.

## Product concept

Mini Beauty CRM is a compact ecosystem:

- public salon website: presents the salon, services, masters, trust signals and contacts;
- online booking: lets a client choose a service, master/date/time and submit contact details;
- CRM panel: lets the administrator and owner manage clients, services, masters, appointments and analytics;
- analytics: helps the owner understand revenue, load, popular services, cancellations, no-shows and repeat visits;
- client booking without account: clients should book quickly with only the required contact details.

The MVP should not try to implement every part at once. Build the public site foundation, CRM foundation and booking logic in small steps, then connect them through the shared `appointments` model.

## User roles

| Role | Goals | What they see | MVP actions | Later actions |
| --- | --- | --- | --- | --- |
| Client | Understand the salon, choose a service and book a visit quickly. | Public pages, service catalog, masters, booking flow, contacts. | View landing/services/masters/contacts, submit online booking with name and phone, without creating an account. | Token-based reschedule/cancel, reviews, portfolio favorites, notifications, waitlist. |
| Master | See own day and client context. | CRM schedule, appointment details, client card if allowed. | View assigned appointments and client visit context. | Add visit notes, photos, result details, delay status, recommendations. |
| Administrator | Run daily operations and keep schedule clean. | CRM dashboard, appointments, clients, services, masters. | Create/edit clients, services, masters and appointments; reschedule/cancel/complete visits. | Advanced filters, reminders, exports, waitlist, communications. |
| Owner | Track business health and configure the salon. | CRM dashboard, analytics, settings, staff/service performance. | View revenue, master load, popular services, cancellations/no-shows, basic settings. | Marketing segments, promo codes, certificates, no-show risk, advanced reports. |

## Route strategy and conflicts

Public pages should own the simple top-level salon URLs:

- `/`
- `/services`
- `/masters`
- `/booking`
- `/contacts`

CRM pages should avoid conflicting with public `/services` and `/masters`. Current route decision:

- use `/admin` as the staff-only CRM root;
- use `/admin/services` and `/admin/masters` for CRM management of services and masters;
- keep `/dashboard` as a legacy redirect to `/admin`.

If the project already has older docs mentioning CRM `/services` and `/masters`, treat those as legacy placeholders and migrate implementation plans toward nested CRM routes before creating those pages.

## Public site structure

| Page | Purpose | Primary user | Main sections | Data needed | CTA | MVP status | Browser verification scenarios |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Salon landing page and entry into booking. | Client | hero, salon summary, services preview, masters preview, trust block, contacts. | salon profile, featured services, featured masters, contacts; static placeholder allowed first. | Записаться онлайн, Посмотреть услуги | P0 | opens, CTAs work, mobile layout, no console errors, no CRM-only complexity visible. |
| `/services` | Public service catalog. | Client | categories, service cards, price/duration, booking CTA. | active public services grouped by category. | Выбрать услугу, Записаться | P1 | empty catalog, long service names, ₽, duration, CTA to booking. |
| `/services/[slug]` | Category or service detail page. | Client | description, included details, price range, related services. | service/category by slug. | Записаться на услугу | Future | direct route, not found, long content, booking handoff. |
| `/masters` | Public list of masters. | Client | master cards, specialization, experience, booking CTA. | active public masters. | Выбрать мастера | P1 | empty masters, long names/specializations, mobile cards. |
| `/masters/[id]` | Master profile page. | Client | profile, specialization, services, schedule preview. | master, related services, available slots later. | Записаться к мастеру | Future | direct route, not found, booking handoff. |
| `/booking` | Online booking flow. | Client | stepper, service, master, time, client details, confirmation. | services, masters, availability, salon settings. | Подтвердить запись | P0 | complete happy path, validation, conflict, empty slots, mobile. |
| `/contacts` | Salon contact and location page. | Client | address, phone, working hours, map placeholder, messengers later. | salon profile, working hours. | Позвонить, Записаться онлайн | P1 | phone link, address, mobile layout. |
| `/portfolio` | Before/after works. | Client | categories, image gallery, result notes. | public portfolio items. | Хочу похожий результат | Future | image loading, filters, mobile gallery. |
| `/reviews` | Client reviews. | Client | review list, rating summary, review CTA later. | public reviews. | Записаться | Future | empty reviews, long text, moderation state. |
| `/booking/manage/[token]` | Client booking management. | Client | upcoming visit, reschedule/cancel later. | token-scoped appointment data. | Управлять записью | Future | token privacy, expiry, no CRM data exposure. |

## Homepage logic

The homepage should be compact and commercial, not a huge marketing site.

Required blocks:
- hero section;
- short description of the salon/product;
- CTA `Записаться онлайн`;
- CTA `Посмотреть услуги`;
- block `Для кого`;
- block `Что умеет`;
- nearest free windows if data is available;
- popular services;
- masters;
- trust block;
- contacts.

MVP simplification:
- nearest free windows can be future/dynamic;
- first iteration can use static placeholders or omit the block;
- public content should not expose private CRM data;
- landing should focus on booking confidence and fast navigation.

## Online booking flow

### Step 1 — Выбор услуги

Required data: active services for the salon, category, price, duration.

Validation: service is required, service must be active and belong to the current salon.

Empty state: no public services yet; show contact CTA instead of a broken flow.

Error state: service list failed to load; show retry and phone/contact fallback.

Business rules: service duration is the source for appointment `end_time`; service price is copied to `appointment.price`.

Privacy/security concerns: public query must expose only public service fields.

MVP simplification: one salon, simple category list, no advanced service configurator.

### Step 2 — Выбор деталей услуги, если применимо

Required data: optional service variants/details.

Validation: selected option must be allowed for the chosen service.

Empty state: skip the step if the service has no details.

Error state: option unavailable; ask user to choose another option or contact salon.

Business rules: option can affect duration/price only if product explicitly supports it.

Privacy/security concerns: do not expose internal pricing notes.

MVP simplification: skip this step or keep it static until variants exist.

### Step 3 — Выбор мастера или "любой подходящий"

Required data: active masters, specialization, optional relation to services.

Validation: master must be active and able to perform the selected service when such relation exists.

Empty state: no active masters; allow contact fallback.

Error state: selected master became inactive/unavailable.

Business rules: `master_id` is required when a specific master is chosen; "любой подходящий" should resolve to an available master before creating the appointment.

Privacy/security concerns: public master cards should not expose private contact details unless intended.

MVP simplification: allow specific master selection; "любой подходящий" can choose any active available master by server-side availability check.

### Step 4 — Выбор даты и свободного времени

Required data: date, candidate time slots, salon working hours, service duration, master availability, existing active appointments.

Validation: date/time required, slot must still be available at submit time.

Empty state: no free slots; show another date/master/contact fallback.

Error state: slot was just taken; ask user to choose another slot.

Business rules: `start_time < end_time`; `end_time` is calculated by `duration_minutes`; active appointments for one master cannot overlap; cancelled appointments do not block a slot.

Privacy/security concerns: do not expose full internal schedule, client names or appointment comments to public users.

MVP simplification: simple day slots, one salon, no branches, no payments, no notifications.

### Step 5 — Данные клиента

Required data: client name and phone; optional comment only if product allows it.

Validation: name required, Russian phone normalized toward `+7`, comment length limited.

Empty state: not applicable; form has required fields.

Error state: invalid phone/name; safe validation messages.

Business rules: duplicate phone warning can be internal for admin; public booking should reuse or create client safely by phone within salon.

Privacy/security concerns: client name and phone are sensitive personal data; never log raw values, never expose them to other clients.

MVP simplification: no client account, no birthday, no file upload, no payment.

### Step 6 — Подтверждение

Required data: selected service, master, date/time, client contact, calculated price/end time.

Validation: re-check availability and salon ownership immediately before insert.

Empty state: not applicable after valid step sequence.

Error state: conflict, unavailable master/service, server validation failed.

Business rules: create `appointment` with status `scheduled`; copy service price; calculate `end_time`; prevent overlap for active statuses.

Privacy/security concerns: confirmation page should show only this user's submitted booking summary, not internal IDs or other appointments.

MVP simplification: confirmation on screen only; no SMS/Telegram/email until notifications are added.

## CRM panel logic

| Section | Purpose | Primary role | Main actions | MVP data | Business rules | Security/RLS concerns | Browser verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | Daily operating view. | Administrator/Owner | view today, upcoming visits, month revenue, quick links. | appointments today, clients count, completed revenue. | revenue from completed appointments unless labeled otherwise. | salon-scoped queries only. | data/empty states, mobile cards, no console errors. |
| Appointments | Manage bookings and statuses. | Administrator | create, edit, reschedule, cancel, complete, mark no-show. | clients, services, masters, appointments. | no active overlap, price snapshot, duration/end time, status rules. | IDOR protection, no comment logs, RLS by `salon_id`. | create/conflict/status/reschedule/cancel. |
| Clients | Manage client base. | Administrator/Owner | list, search, create, edit, profile, history. | clients, visit history. | phone normalization, duplicate warning later, safe delete/anonymize decision. | client data sensitive, no cross-salon access. | search, CRUD, not found/forbidden, long names. |
| Services | Manage service catalog. | Owner/Administrator | create, edit, activate/deactivate, categorize. | services with price/duration/category. | price >= 0, duration > 0, inactive not bookable. | salon-scoped reads/writes. | validation, inactive filtering, ₽ display. |
| Masters | Manage staff and schedule visibility. | Owner/Administrator | create, edit, activate/deactivate, specialization. | masters with public/private fields. | inactive not bookable, availability checked in appointments. | staff contacts are sensitive if stored. | active filter, long names, mobile. |
| Analytics | Understand business performance. | Owner | revenue, top services, top masters, new/repeat clients. | completed appointments, clients, services, masters. | completed-only analytics by default. | salon-scoped aggregates. | empty ranges, charts/tables, date filters. |
| Settings | Configure salon profile. | Owner | salon name, phone, address, working hours, profile. | salon profile, working hours. | working hours affect booking availability. | owner-only sensitive settings. | validation, save success/error, mobile. |

## MVP scope

### MVP v1

- landing page;
- auth;
- dashboard;
- clients CRUD;
- services CRUD;
- masters CRUD;
- appointments CRUD;
- online booking MVP;
- appointment statuses;
- basic analytics;
- Vercel deploy.

### MVP v1.5

- service catalog page;
- masters public page;
- better booking UX;
- client visit history;
- duplicate phone warning;
- simple working hours.

### MVP v2

- client profile;
- reschedule/cancel from client side;
- reviews;
- before/after portfolio;
- notifications;
- waitlist.

### MVP v3

- smart service picker;
- price calculator;
- delay control;
- marketing segments;
- promo codes;
- certificates;
- no-show risk.

## Route map

| Route | Area | Purpose | MVP priority | Auth required | Main components | Data source |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | public | salon landing and booking entry. | P0 | no | PublicHeader, HeroSection, FeaturedServices, FeaturedMasters, BookingCTA, TrustBlock, ContactBlock | static first, then salon/services/masters |
| `/services` | public | public service catalog. | P1 | no | PublicHeader, ServiceCategoryGrid, FeaturedServices, BookingCTA | active services |
| `/services/[slug]` | public | service/category detail. | Future | no | service detail, related services, BookingCTA | service/category |
| `/masters` | public | public master list. | P1 | no | PublicHeader, FeaturedMasters, BookingCTA | active masters |
| `/masters/[id]` | public | master profile. | Future | no | master profile, service links, BookingCTA | master |
| `/booking` | public | online booking flow. | P0 | no | BookingFlow, BookingStepIndicator, ServiceStep, MasterStep, TimeSlotStep, ClientInfoStep, BookingConfirmation | services, masters, availability, appointments |
| `/contacts` | public | address, phone and hours. | P1 | no | ContactBlock, working hours, map placeholder | salon profile |
| `/portfolio` | public | before/after works. | Future | no | portfolio grid, filters | portfolio items |
| `/reviews` | public | public reviews. | Future | no | reviews list, rating summary | reviews |
| `/booking/manage/[token]` | client | token-based booking management later. | Future | no Supabase Auth | booking management page | token-scoped appointment data |
| `/login` | auth | staff CRM sign in. | P0 | no | LoginForm | Supabase Auth |
| `/register` | disabled | open registration disabled. | P0 | no | staff-only explainer | none |
| `/admin` | crm | daily operations overview. | P0 | yes | Dashboard cards/lists/charts | salon-scoped appointments/clients |
| `/admin/clients` | crm | client management. | P0 | yes | ClientsTable, ClientForm, ClientSearch | salon-scoped clients |
| `/admin/clients/[id]` | crm | client profile and visit history. | P0 | yes | ClientCard, ClientVisitHistory | salon-scoped client/appointments |
| `/admin/appointments` | crm | appointment management. | P0 | yes | AppointmentsTable, AppointmentForm, Filters | salon-scoped appointments |
| `/admin/analytics` | crm | owner analytics. | P0 | yes | RevenueChart, PopularServicesChart, MastersStats | completed appointments |
| `/admin/settings` | crm | salon/profile settings. | P0 | yes | settings forms, working hours | salon/profile |
| `/admin/services` | crm | service management, avoids public `/services` conflict. | P0 | yes | ServicesTable, ServiceForm | salon-scoped services |
| `/admin/masters` | crm | master management, avoids public `/masters` conflict. | P0 | yes | MastersTable, MasterForm | salon-scoped masters |
| `/dashboard` | legacy | redirect to `/admin`. | P0 | yes | redirect only | none |

## Business rules

- `start_time < end_time`.
- `end_time` is calculated from `services.duration_minutes`.
- `appointment.price` copies the service price at the moment of booking.
- Active appointments for the same master must not overlap.
- Cancelled appointments do not block a slot.
- Completed and no-show appointments are historical; define whether they remain immutable or editable only by owner/admin before implementation.
- Client data is sensitive personal data.
- A user can see only data for their salon.
- Analytics are based only on completed appointments unless a metric explicitly says otherwise.
- Public booking must re-check availability at confirmation time, not only when slots are displayed.

## UX principles

- Booking should be understandable in 60 seconds.
- The client should not see CRM complexity.
- The administrator should create or move an appointment quickly.
- UI language is Russian.
- Prices use `₽`.
- Phone format should guide toward `+7`.
- Dates/times use `ru-RU` and `Europe/Moscow`.
- Mobile adaptation is mandatory for public pages and booking.
- Empty states should offer a useful action.
- Error states should explain recovery without exposing internal data.

## Future WOW features

These are intentionally outside MVP:

- smart service picker;
- price calculator;
- real-time free windows;
- before/after photos;
- "хочу как на фото";
- master delay control;
- waitlist;
- automatic review request after completed visit;
- no-show risk;
- master recommendations.
