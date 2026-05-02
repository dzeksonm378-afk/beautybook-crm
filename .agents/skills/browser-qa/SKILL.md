---
name: browser-qa
description: Use when a frontend or full-stack CRM change needs browser verification through Playwright or Chrome DevTools.
---

# Browser QA

## Workflow

- Determine package manager and dev command.
- Start local server if needed.
- Open affected routes.
- Check happy path.
- Check loading, error and empty states where possible.
- Check form validation.
- Check console and network errors.
- Check mobile viewport.
- Check the main CRM flow affected by the change.
- Report exact observations, URL, viewport and failures.
