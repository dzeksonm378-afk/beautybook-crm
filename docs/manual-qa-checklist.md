# Manual QA Checklist

## Public pages

- `/` opens without console errors.
- `/services` opens without console errors.
- `/masters` opens without console errors.
- `/booking` opens without console errors.
- `/contacts` opens without console errors.
- `/login` opens and stays staff-only.
- `/register` opens as a disabled registration page.
- Booking remains a no-account preview/concept flow.

## Auth and protection

- Logged-out `/admin` redirects to `/login?reason=staff_only`.
- Owner login works.
- Logout works.
- `/dashboard` redirects to `/admin`.

## Role permissions

- Owner sees all CRM sections.
- Admin cannot access settings.
- Master sees limited mode.
- Return the tested profile role to `owner` after role checks.

## Clients

- Create client.
- Duplicate phone is blocked.
- Search clients.
- Open client profile.
- Edit client.
- Visit history renders.

## Services

- Create service.
- Duplicate title is blocked.
- Search and filter services.
- Active/inactive toggle works.

## Masters

- Create master.
- Duplicate name is blocked.
- Search masters.
- Active/inactive toggle works.

## Appointments

- Create appointment.
- Appointment price copies the service price snapshot.
- `end_time` is calculated from service duration.
- Conflict detection blocks overlapping scheduled appointments.
- Working hours validation works.
- Edit scheduled appointment.
- Completed, cancelled and no-show appointments are not editable.
- Status changes work.
- `clientId` filter and preselect work.

## Dashboard

- Real stats render from Supabase.
- Revenue includes only completed appointments in the current month.
- Popular services render.
- Status breakdown renders.
- Upcoming scheduled appointments render.

## Settings

- Update salon name.
- Update salon phone and address.
- Update working hours.
- Invalid hours are blocked.
- Closed day blocks appointment creation and editing.

## Mobile

- `/` is usable on mobile.
- `/login` is usable on mobile.
- `/admin` is usable on mobile.
- `/admin/clients` is usable on mobile.
- `/admin/appointments` is usable on mobile.
- `/admin/settings` is usable on mobile.
- No horizontal overflow.

## Final commands

- `npm run lint`
- `npm run typecheck`
- `npm run build`
