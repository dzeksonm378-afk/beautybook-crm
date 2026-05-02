---
name: crm-client-feature
description: Use when implementing clients, client profile, client search, notes, visit history, duplicate handling, or client data privacy.
---

# CRM Client Feature

## Check

- Validate client inputs.
- Normalize Russian phone numbers toward `+7`.
- Warn on duplicate normalized phone inside the same salon when implemented.
- Keep notes private and never log them.
- Show visit history with salon-scoped appointments.
- Block unauthorized access and IDOR.
- RLS policies cover client reads/writes.
- Tests cover validation, search and access control.
- UI includes loading, error, empty, success and disabled states.
