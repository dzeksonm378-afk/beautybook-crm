# Screenshots Guide

Screenshots are prepared and stored in `docs/screenshots`.

Use test data only. Do not show real phone numbers, real emails, passwords, cookies, tokens, Supabase keys or `.env.local`.

## Current files

- `01-home-desktop.png`
- `02-home-mobile.png`
- `03-home-mobile-booking-card.png`
- `04-staff-login.png`
- `05-crm-dashboard-owner.png`
- `06-role-admin-dashboard.png`
- `07-role-master-limited-mode.png`
- `08-clients-list.png`
- `09-client-profile.png`
- `10-services.png`
- `11-masters.png`
- `12-appointments.png`
- `13-settings-working-hours.png`
- `14-crm-mobile-dashboard.png`

## Public home page desktop

- Show the main public landing page in a desktop viewport.
- The salon/product positioning and primary navigation should be visible.
- Do not show real client personal data.

## Public home page mobile

- Show the public home page in a mobile viewport.
- The mobile header and first screen should be visible.
- Do not show real client personal data.

## Staff login

- Show the `/login` page.
- Staff-only positioning should be visible.
- Do not show real email/password values.

## CRM dashboard

- Show `/admin`.
- Salon name, role, key stats, upcoming appointments and analytics blocks should be visible.
- Use test data and avoid real client names or phone numbers.

## Clients list

- Show `/admin/clients`.
- Search, empty/list state and create client flow entry point should be visible.
- Use test names and masked or fake phone numbers.

## Client profile

- Show `/admin/clients/[id]`.
- Client details, stats, visit history and appointment links should be visible.
- Use test data only and avoid real notes.

## Services

- Show `/admin/services`.
- Service list, search/filter and active/inactive state should be visible.
- Use test service names and RUB prices.

## Masters

- Show `/admin/masters`.
- Master list, search and active/inactive state should be visible.
- Use test staff names and no real contacts.

## Appointments

- Show `/admin/appointments`.
- Appointment filters, list and create/edit controls should be visible.
- Use test clients and services only.

## Settings working hours

- Show `/admin/settings`.
- Salon profile and working hours controls should be visible.
- Do not show real phone/address values.

## Mobile CRM view

- Show a CRM page in a mobile viewport, preferably `/admin/appointments` or `/admin/clients`.
- Compact navigation and main workflow should be visible.
- Confirm there is no horizontal overflow.
