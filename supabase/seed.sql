-- Safe demo seed for Mini Beauty CRM / BeautyBook CRM.
--
-- This seed intentionally uses fake demo data only.
-- It requires a test auth user/profile. Replace demo_owner_id with the id of
-- a local test auth.users row after Supabase Auth is configured.
-- Do not paste UUIDs from a production Supabase project here.

do $$
declare
  demo_owner_id uuid := '00000000-0000-4000-8000-000000000001';
  demo_salon_id uuid := '00000000-0000-4000-8000-000000000101';
  demo_client_1_id uuid := '00000000-0000-4000-8000-000000000201';
  demo_client_2_id uuid := '00000000-0000-4000-8000-000000000202';
  demo_service_1_id uuid := '00000000-0000-4000-8000-000000000301';
  demo_service_2_id uuid := '00000000-0000-4000-8000-000000000302';
  demo_master_1_id uuid := '00000000-0000-4000-8000-000000000401';
  demo_appointment_1_id uuid := '00000000-0000-4000-8000-000000000501';
begin
  if not exists (select 1 from auth.users where id = demo_owner_id) then
    raise notice 'Skipping demo seed: create a local test auth user and set demo_owner_id first.';
    return;
  end if;

  insert into public.profiles (id, full_name, role)
  values (demo_owner_id, 'Demo Owner', 'owner')
  on conflict (id) do update
  set full_name = excluded.full_name,
      role = excluded.role;

  insert into public.salons (id, owner_id, name, phone, address, working_hours)
  values (
    demo_salon_id,
    demo_owner_id,
    'Demo Salon',
    '+70000000000',
    'Demo Address, Санкт-Петербург',
    '{
      "monday": { "from": "10:00", "to": "20:00" },
      "tuesday": { "from": "10:00", "to": "20:00" },
      "wednesday": { "from": "10:00", "to": "20:00" },
      "thursday": { "from": "10:00", "to": "20:00" },
      "friday": { "from": "10:00", "to": "20:00" },
      "saturday": { "from": "10:00", "to": "18:00" },
      "sunday": null
    }'::jsonb
  )
  on conflict (id) do update
  set name = excluded.name,
      phone = excluded.phone,
      address = excluded.address,
      working_hours = excluded.working_hours;

  insert into public.clients (id, salon_id, full_name, phone, email)
  values
    (demo_client_1_id, demo_salon_id, 'Client 1', '+70000000001', 'client1@example.test'),
    (demo_client_2_id, demo_salon_id, 'Client 2', '+70000000002', 'client2@example.test')
  on conflict (id) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      email = excluded.email;

  insert into public.services (id, salon_id, title, description, price, duration_minutes, category)
  values
    (demo_service_1_id, demo_salon_id, 'Demo Service 1', 'Demo service description', 2500, 90, 'Маникюр'),
    (demo_service_2_id, demo_salon_id, 'Demo Service 2', 'Demo service description', 3200, 120, 'Волосы')
  on conflict (id) do update
  set title = excluded.title,
      description = excluded.description,
      price = excluded.price,
      duration_minutes = excluded.duration_minutes,
      category = excluded.category;

  insert into public.masters (id, salon_id, full_name, specialization, phone, email)
  values (
    demo_master_1_id,
    demo_salon_id,
    'Demo Master 1',
    'Demo Specialization',
    '+70000000003',
    'master1@example.test'
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      specialization = excluded.specialization,
      phone = excluded.phone,
      email = excluded.email;

  insert into public.appointments (
    id,
    salon_id,
    client_id,
    service_id,
    master_id,
    date,
    start_time,
    end_time,
    status,
    price,
    comment
  )
  values (
    demo_appointment_1_id,
    demo_salon_id,
    demo_client_1_id,
    demo_service_1_id,
    demo_master_1_id,
    current_date + 1,
    '10:00',
    '11:30',
    'scheduled',
    2500,
    null
  )
  on conflict (id) do update
  set date = excluded.date,
      start_time = excluded.start_time,
      end_time = excluded.end_time,
      status = excluded.status,
      price = excluded.price,
      comment = excluded.comment;
end $$;
