---
name: crm-service-master-feature
description: Use when implementing service catalog, prices, durations, categories, masters, specializations, active/inactive status, or master-service relations.
---

# CRM Service and Master Feature

## Check

- Validate `price >= 0`.
- Validate `duration_minutes > 0`.
- Active/inactive behavior is explicit.
- Inactive services and masters are not selectable for new appointments.
- Categories are consistent and Russian-friendly.
- Master specialization helps appointment selection.
- Appointment dependencies are not broken.
- Tests cover validation and active filtering.
- UI states cover empty, loading, error, success and long names.
