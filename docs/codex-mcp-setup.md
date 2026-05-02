# Codex MCP Setup

Use development projects and least-privilege access. Do not paste secrets, service role keys, cookies or production personal data into prompts.

## 1. Context7

Purpose:
- up-to-date docs for Next.js, Supabase, Tailwind, shadcn/ui, Zod, React Hook Form, Recharts.

Status: recommended.

Required login/token: usually none for basic usage.

Safety notes: use for documentation only; do not send secrets.

Command:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

## 2. Playwright

Purpose:
- browser verification for CRM flows.

Status: recommended.

Required login/token: none for local browser verification.

Safety notes: use local/dev URLs; avoid production data.

Command:

```bash
codex mcp add playwright -- npx @playwright/mcp@latest
```

## 3. Chrome DevTools

Purpose:
- console errors, network debugging, layout/performance debugging.

Status: recommended.

Required login/token: none for local browser debugging.

Safety notes: avoid inspecting production sessions with real client data.

Command:

```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

## 4. Figma

Purpose:
- implement CRM UI from design accurately.

Status: needs login if a Figma design is used.

Required login/token: Figma OAuth/account access.

Safety notes: grant only needed files; do not expose private client data in designs.

Command:

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

## 5. Supabase MCP

Purpose:
- inspect Supabase project, schema, migrations, policies, and database context.

Status: needs login/project authorization.

Required login/token: Supabase OAuth or configured MCP authorization. Do not paste keys into prompts.

Safety:
- prefer development project only;
- do not expose production data;
- do not give unnecessary write access;
- do not share private server keys in prompts;
- use read-only or explicit approval where possible.

Command:

```bash
codex mcp add supabase --url https://mcp.supabase.com/mcp
```

## 6. GitHub MCP

Purpose:
- issues, PR review, branches, code review.

Status: recommended after GitHub repo is created.

Required login/token: GitHub OAuth/token through MCP flow.

Safety:
- prefer explicit approval for write operations;
- do not push or merge without explicit user instruction.

Command: use the current official GitHub MCP setup for Codex once the repo exists.

## 7. Sentry MCP

Purpose:
- staging/production error debugging.

Status: add after deployment and Sentry setup.

Required login/token: Sentry OAuth/token through MCP flow.

Safety notes: avoid copying sensitive event payloads into prompts.

Command: use the current official Sentry MCP setup after Sentry is configured.

## 8. OpenAI Developer Docs MCP

Purpose:
- only if CRM uses AI features.

Status: skipped for MVP unless AI features are added.

Required login/token: depends on official OpenAI docs MCP setup.

Safety notes: documentation only; never paste API keys.
