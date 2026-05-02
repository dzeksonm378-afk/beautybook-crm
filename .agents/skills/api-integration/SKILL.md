---
name: api-integration
description: Use when connecting frontend CRM features to Server Actions, Supabase queries, API clients, auth/session handling, and request state.
---

# API Integration

## Check

- Request and response shapes are explicit.
- Inputs are validated with Zod.
- Auth/session is checked on the server.
- RLS is the enforcement layer, not only frontend filters.
- Loading, success and error states are represented.
- Errors are safe and do not expose personal data.
- Tests or mocks are updated when present.
- Browser network verification is done for UI flows.
