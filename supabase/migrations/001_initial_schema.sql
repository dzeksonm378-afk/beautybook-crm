-- Mini Beauty CRM / BeautyBook CRM MVP schema.
-- This migration creates the first Supabase foundation only: no CRUD UI,
-- no auth UI, no production secrets, and no service_role usage.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('owner', 'admin', 'master'))
);

create table public.salons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text,
  address text,
  working_hours jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint salons_name_not_empty check (length(btrim(name)) > 0)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  birthday date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_id_salon_id_key unique (id, salon_id),
  constraint clients_full_name_not_empty check (length(btrim(full_name)) > 0),
  constraint clients_phone_not_empty check (length(btrim(phone)) > 0)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  duration_minutes integer not null,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_id_salon_id_key unique (id, salon_id),
  constraint services_title_not_empty check (length(btrim(title)) > 0),
  constraint services_price_non_negative check (price >= 0),
  constraint services_duration_positive check (duration_minutes > 0)
);

create table public.masters (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  full_name text not null,
  specialization text,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masters_id_salon_id_key unique (id, salon_id),
  constraint masters_full_name_not_empty check (length(btrim(full_name)) > 0)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  master_id uuid not null references public.masters(id) on delete restrict,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'scheduled',
  price numeric(10, 2) not null,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_client_salon_fk
    foreign key (client_id, salon_id)
    references public.clients(id, salon_id)
    on delete restrict,
  constraint appointments_service_salon_fk
    foreign key (service_id, salon_id)
    references public.services(id, salon_id)
    on delete restrict,
  constraint appointments_master_salon_fk
    foreign key (master_id, salon_id)
    references public.masters(id, salon_id)
    on delete restrict,
  constraint appointments_status_check
    check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  constraint appointments_price_non_negative check (price >= 0),
  constraint appointments_time_order check (start_time < end_time)
);

comment on table public.appointments is
  'TODO(conflict-prevention): active blocking status is scheduled. Cancelled does not block time. Product decision still needed for completed/no_show editability. Final overlap prevention should combine server action checks with a database constraint or trigger. A safe overlap rule is same salon_id, master_id, date where new_start < existing_end and new_end > existing_start.';

create index clients_salon_id_idx on public.clients(salon_id);
create index clients_salon_phone_idx on public.clients(salon_id, phone);
create index clients_salon_full_name_idx on public.clients(salon_id, full_name);
create index services_salon_id_idx on public.services(salon_id);
create index masters_salon_id_idx on public.masters(salon_id);
create index appointments_salon_date_idx on public.appointments(salon_id, date);
create index appointments_salon_master_date_idx on public.appointments(salon_id, master_id, date);
create index appointments_client_id_idx on public.appointments(client_id);
create index appointments_service_id_idx on public.appointments(service_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger salons_set_updated_at
before update on public.salons
for each row execute function public.set_updated_at();

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger masters_set_updated_at
before update on public.masters
for each row execute function public.set_updated_at();

create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.salons enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.masters enable row level security;
alter table public.appointments enable row level security;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy salons_select_owned
on public.salons
for select
to authenticated
using (owner_id = auth.uid());

create policy salons_insert_owned
on public.salons
for insert
to authenticated
with check (owner_id = auth.uid());

create policy salons_update_owned
on public.salons
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy salons_delete_owned
on public.salons
for delete
to authenticated
using (owner_id = auth.uid());

create policy clients_select_owned_salon
on public.clients
for select
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = clients.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy clients_insert_owned_salon
on public.clients
for insert
to authenticated
with check (
  exists (
    select 1
    from public.salons
    where salons.id = clients.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy clients_update_owned_salon
on public.clients
for update
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = clients.salon_id
      and salons.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.salons
    where salons.id = clients.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy clients_delete_owned_salon
on public.clients
for delete
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = clients.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy services_select_owned_salon
on public.services
for select
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = services.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy services_insert_owned_salon
on public.services
for insert
to authenticated
with check (
  exists (
    select 1
    from public.salons
    where salons.id = services.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy services_update_owned_salon
on public.services
for update
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = services.salon_id
      and salons.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.salons
    where salons.id = services.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy services_delete_owned_salon
on public.services
for delete
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = services.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy masters_select_owned_salon
on public.masters
for select
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = masters.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy masters_insert_owned_salon
on public.masters
for insert
to authenticated
with check (
  exists (
    select 1
    from public.salons
    where salons.id = masters.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy masters_update_owned_salon
on public.masters
for update
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = masters.salon_id
      and salons.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.salons
    where salons.id = masters.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy masters_delete_owned_salon
on public.masters
for delete
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = masters.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy appointments_select_owned_salon
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = appointments.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy appointments_insert_owned_salon
on public.appointments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.salons
    where salons.id = appointments.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy appointments_update_owned_salon
on public.appointments
for update
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = appointments.salon_id
      and salons.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.salons
    where salons.id = appointments.salon_id
      and salons.owner_id = auth.uid()
  )
);

create policy appointments_delete_owned_salon
on public.appointments
for delete
to authenticated
using (
  exists (
    select 1
    from public.salons
    where salons.id = appointments.salon_id
      and salons.owner_id = auth.uid()
  )
);
