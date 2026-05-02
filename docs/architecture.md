# Architecture

## Target structure

```text
mini-beauty-crm/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── masters/
│   │   │   │   └── page.tsx
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── services/
│   │   ├── masters/
│   │   ├── appointments/
│   │   └── analytics/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validations/
│   │   ├── utils.ts
│   │   └── format.ts
│   ├── actions/
│   ├── types/
│   └── constants/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── public/
├── middleware.ts
├── package.json
└── README.md
```

## Responsibilities

- `src/app`: routes, pages, layouts, metadata, route groups and server-first data loading.
- `src/components`: reusable UI. Keep CRM-specific widgets grouped by domain.
- `src/components/ui`: shadcn/ui primitives only, with minimal local changes.
- `src/lib/supabase`: browser, server and middleware Supabase helpers.
- `src/lib/validations`: Zod schemas shared by forms and server actions.
- `src/lib/utils.ts`: small generic helpers such as `cn`.
- `src/lib/format.ts`: Russian date, time, price and phone formatters.
- `src/actions`: Server Actions for mutations and business workflows.
- `src/types`: shared TypeScript types, including generated Supabase database types later.
- `src/constants`: appointment statuses, navigation links, service categories and roles.
- `supabase/migrations`: deterministic SQL schema, indexes, constraints and RLS.
- `supabase/seed.sql`: safe demo data only, with no real client personal data.

## Server Components vs Client Components

- Prefer Server Components for pages that read data.
- Use Client Components for forms, dialogs, menus, tabs, date pickers, filters and interactive tables.
- Keep Client Components small and pass already-scoped data from the server where practical.
- Do not import server-only Supabase helpers into Client Components.
- Avoid moving whole pages to `"use client"` just to support one widget.

## Server Actions

- Put mutations in `src/actions`.
- Validate inputs with Zod before touching Supabase.
- Resolve the current user and salon on the server.
- Return safe error shapes that do not expose internals or personal data.
- Revalidate affected routes after successful mutations.
- Keep business rules close to the write path, especially appointments.

## Supabase usage

- Use server Supabase client for private page reads and Server Actions.
- Use browser Supabase client only for auth UI/session-aware client behavior.
- Never expose private server keys to the browser.
- Treat RLS as mandatory for every public table.
- Scope salon-owned queries by `salon_id` and rely on RLS as the final enforcement layer.

## Form validation

- Use Zod schemas in `src/lib/validations`.
- Use React Hook Form for complex forms and shadcn/ui form components.
- Validate on client for UX and on server for trust.
- Normalize phones before duplicate checks.
- Keep date/time validation timezone-aware for `Europe/Moscow`.

## shadcn/ui rules

- Use shadcn/ui primitives for buttons, inputs, dialogs, dropdowns, tables, badges and forms.
- Do not create a second design system.
- Keep cards restrained and utilitarian for CRM workflows.
- Prefer dense, scannable layouts over marketing-style hero sections inside the app.
- Add new shadcn components only with explicit approval if the command will modify many files.

## Russian formatting

- Dates: format with `ru-RU` and `Europe/Moscow`.
- Times: use 24-hour format, for example `14:30`.
- Prices: show RUB with `₽`, for example `2 500 ₽`.
- Phones: normalize toward `+7` where possible; preserve user input only when normalization fails safely.
- UI copy: use clear Russian text for empty, error, loading and success states.
