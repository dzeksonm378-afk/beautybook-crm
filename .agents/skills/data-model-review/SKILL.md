---
name: data-model-review
description: Use when creating or changing CRM database models, SQL migrations, indexes, constraints, relations, or generated database types.
---

# Data Model Review

## Check

- Relations match CRM workflows.
- Salon-owned tables include `salon_id`.
- Useful indexes exist for filters and joins.
- Constraints protect business invariants.
- Appointment invariants are represented.
- Sensitive fields are identified.
- Deletion/anonymization implications are considered.
- Migrations are safe and reviewable.
- Seed data is fake and safe.
- Tests or manual checks are documented.
