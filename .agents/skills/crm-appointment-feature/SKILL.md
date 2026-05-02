---
name: crm-appointment-feature
description: Use when implementing appointments, calendar, scheduling, master availability, service duration, status changes, reschedule, cancel, or conflict prevention.
---

# CRM Appointment Feature

## Check

- Service duration is used to calculate `end_time`.
- Appointment price stores a service price snapshot.
- `start_time` is before `end_time`.
- Master availability is respected.
- Salon working hours are respected.
- Active appointments for the same master do not overlap.
- Cancelled appointments do not block time unless product rules say otherwise.
- Status transitions are valid and clear.
- Date/time handling uses `Europe/Moscow`.
- Tests cover conflicts and edge cases.
- Browser verification covers calendar/list booking flows.
