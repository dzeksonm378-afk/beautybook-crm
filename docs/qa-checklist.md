# QA Checklist

## Backend

- success case returns expected data or redirects;
- invalid input is rejected by server-side validation;
- unauthorized user is redirected or receives a safe error;
- forbidden cross-salon/role action is blocked;
- missing resource returns safe not-found behavior;
- duplicate/conflict case is handled clearly;
- database behavior matches constraints and RLS;
- error shape is safe and does not expose internals;
- no sensitive logging;
- RLS isolation works for two different salons.

## Frontend

- loading state;
- error state;
- empty state;
- success state;
- disabled state;
- long text;
- mobile layout;
- tablet layout;
- keyboard navigation if relevant;
- console errors;
- network errors;
- refresh/session restore.

## CRM-specific

- appointment conflict prevention works;
- service duration affects `end_time`;
- service price copies to appointment;
- master availability is respected;
- salon working hours are respected;
- appointment statuses are correct;
- reschedule/cancel flows work;
- client search works;
- duplicate phone warning works if implemented;
- role permissions work;
- client data is not exposed to unauthorized users;
- Russian dates/prices/phones render correctly.
