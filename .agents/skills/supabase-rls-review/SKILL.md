---
name: supabase-rls-review
description: Use when creating or changing Supabase tables, migrations, RLS policies, auth, salon ownership, or data access logic.
---

# Supabase RLS Review

## Check

- RLS enabled on every public table.
- Policies scoped by `salon_id`.
- Owner can access own salon data.
- Users cannot access other salons.
- No `service_role` key in client code.
- INSERT policies prevent writing rows into another salon.
- UPDATE policies prevent changing `salon_id` into another salon.
- DELETE policies are explicit and safe.
- Indexes and constraints exist for business-critical queries.
- Migrations are deterministic and non-destructive unless approved.
- Tests or manual SQL checks are described.
