# Start Here

The current folder is not yet a Next.js project. Do not run project creation automatically without confirmation.

## Create the project

From the parent folder, run:

```bash
npx create-next-app@latest mini-beauty-crm
```

Recommended answers:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src` directory: Yes
- App Router: Yes
- Turbopack: Yes
- customize import alias: No

Then:

```bash
cd mini-beauty-crm
npm run dev
```

Open:

```text
http://localhost:3000
```

## Next setup steps

1. Initialize shadcn/ui.
2. Create a development Supabase project.
3. Set `.env.local` with public anon configuration only.
4. Add `.env.example` without secrets.
5. Add Supabase client/server/middleware helpers.
6. Create migrations for profiles, salons, clients, services, masters and appointments.
7. Enable RLS on all public tables.
8. Add fake seed data only.
9. Add README setup instructions.

Do not commit secrets, service role keys, cookies, session secrets or real client personal data.
