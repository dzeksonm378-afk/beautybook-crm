# Database Schema Plan

This document describes the MVP Supabase Postgres schema for Mini Beauty CRM.

Current implementation:
- migration: `supabase/migrations/001_initial_schema.sql`;
- seed: `supabase/seed.sql`;
- Supabase helpers: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`;
- placeholder generated types: `src/types/database.ts`.

The migration enables RLS on all public MVP tables and scopes salon-owned data through `salon_id` and `salons.owner_id = auth.uid()`.

## profiles

Fields:
- `id uuid primary key references auth.users(id)`
- `full_name text`
- `role text`
- `created_at timestamptz`

Roles:
- `owner`
- `admin`
- `master`

MVP:
- only `owner` is required.

## salons

Fields:
- `id uuid primary key`
- `owner_id uuid references profiles(id)`
- `name text`
- `phone text`
- `address text`
- `working_hours jsonb`
- `created_at timestamptz`
- `updated_at timestamptz`

`working_hours` example:

```json
{
  "monday": { "from": "10:00", "to": "20:00" },
  "tuesday": { "from": "10:00", "to": "20:00" },
  "wednesday": { "from": "10:00", "to": "20:00" },
  "thursday": { "from": "10:00", "to": "20:00" },
  "friday": { "from": "10:00", "to": "20:00" },
  "saturday": { "from": "10:00", "to": "18:00" },
  "sunday": null
}
```

## clients

Fields:
- `id uuid primary key`
- `salon_id uuid references salons(id)`
- `full_name text`
- `phone text`
- `email text`
- `birthday date`
- `notes text`
- `created_at timestamptz`
- `updated_at timestamptz`

## services

Fields:
- `id uuid primary key`
- `salon_id uuid references salons(id)`
- `title text`
- `description text`
- `price numeric`
- `duration_minutes integer`
- `category text`
- `is_active boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

Example categories:
- Маникюр
- Педикюр
- Волосы
- Брови
- Косметология
- Массаж

## masters

Fields:
- `id uuid primary key`
- `salon_id uuid references salons(id)`
- `full_name text`
- `specialization text`
- `phone text`
- `email text`
- `is_active boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

## appointments

Fields:
- `id uuid primary key`
- `salon_id uuid references salons(id)`
- `client_id uuid references clients(id)`
- `service_id uuid references services(id)`
- `master_id uuid references masters(id)`
- `date date`
- `start_time time`
- `end_time time`
- `status text`
- `price numeric`
- `comment text`
- `created_at timestamptz`
- `updated_at timestamptz`

Appointment statuses:
- `scheduled` = Запланирована
- `completed` = Завершена
- `cancelled` = Отменена
- `no_show` = Не пришёл

`appointments.price` stores a snapshot of service price at the time of booking. This is needed because service price can change later. Old appointments should keep their historical price for analytics.

## RLS principles

- Every salon-owned table must include `salon_id`.
- Users can access only rows for salons they own/belong to.
- Enable RLS on all public tables.
- Write SELECT/INSERT/UPDATE/DELETE policies carefully.
- Do not rely only on frontend checks.

## Indexes to consider

- `clients(salon_id)`
- `clients(salon_id, phone)`
- `clients(salon_id, full_name)`
- `services(salon_id)`
- `masters(salon_id)`
- `appointments(salon_id, date)`
- `appointments(salon_id, master_id, date)`
- `appointments(client_id)`
- `appointments(service_id)`

## Constraints to consider

- `price >= 0`
- `duration_minutes > 0`
- `status in ('scheduled', 'completed', 'cancelled', 'no_show')`
- `start_time < end_time`
- required fields not null where appropriate

## Appointment conflict rule

For active statuses like `scheduled`, a conflict exists when:
- same `salon_id`;
- same `master_id`;
- same `date`;
- overlapping time intervals.

The database and server action should prevent this. A typical overlap check is:

```sql
new_start < existing_end
and new_end > existing_start
```

Cancelled appointments should not block time unless the product decision changes. Completed and no-show appointments are historical; rescheduling should normally create a new active interval or update the existing appointment with a conflict check.
