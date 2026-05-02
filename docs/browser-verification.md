# Browser Verification Guide

## Determine dev command

1. Open `package.json`.
2. Check scripts in this order:
   - `dev`
   - `build`
   - `lint`
   - `typecheck`
   - `test`
3. Determine package manager from lock files:
   - `pnpm-lock.yaml` means pnpm;
   - `yarn.lock` means yarn;
   - `bun.lockb` or `bun.lock` means bun;
   - `package-lock.json` means npm;
   - no lock file usually means npm until decided.

## Start local dev server

Use the discovered dev script, for example:

```bash
npm run dev
```

If the default port is busy, use the framework-supported port flag or environment variable and report the actual URL.

## Determine local URL

Common URLs:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Use the terminal output from the dev server as the source of truth.

## MCP/browser tools

Playwright MCP:
- use it for route smoke tests, forms, navigation, mobile viewport and screenshots;
- check console and network when available.

Chrome DevTools MCP:
- use it for console errors, network debugging, layout issues and performance clues;
- inspect failed requests and JavaScript errors.

If MCP browser tools are not available, run the app locally and perform the manual steps below in a browser.

## Pages to check

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/clients`
- `/clients/[id]`
- `/services`
- `/masters`
- `/appointments`
- `/analytics`
- `/settings`

## Scenarios

- register;
- login;
- logout;
- create client;
- search client;
- create service;
- create master;
- create appointment;
- detect appointment conflict;
- change appointment status;
- reschedule appointment;
- cancel appointment;
- open dashboard;
- open analytics;
- mobile viewport;
- navigation.

## Check

- console errors;
- network errors;
- layout breaks;
- loading/error/empty/success states;
- long Russian text;
- ₽ formatting;
- dates/times;
- form validation messages.

## Manual notes template

Record:
- command used;
- local URL;
- viewport sizes;
- pages opened;
- scenarios passed/failed;
- console errors;
- network errors;
- screenshots if useful.
