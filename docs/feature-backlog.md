# Feature Backlog

Priority: P0 = required MVP, P1 = important polish, P2 = later. Complexity: S/M/L.

## A. Auth & onboarding

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| login | P0 | S | medium | `feature-implementation` | valid/invalid login | login redirect | safe auth errors | user reaches correct salon | user can sign in |
| register | P0 | M | medium | `feature-implementation` | validation, profile creation | register flow | no token logs | owner role created | owner account works |
| logout | P0 | S | low | `api-integration` | session cleared | logout button | session cleared | user leaves private area | private routes blocked |
| protected routes | P0 | M | high | `privacy-security-check` | unauthorized redirect | direct URL refresh | auth bypass | no CRM data preauth | all private pages protected |
| create salon after registration | P0 | M | high | `supabase-rls-review` | owner/salon link | onboarding flow | safe insert policy | owner owns first salon | salon exists after register |
| owner profile | P0 | S | medium | `api-integration` | profile validation | settings/profile | role cannot be spoofed | owner role visible | profile is editable safely |

## B. Clients

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| client list | P0 | S | high | `crm-client-feature` | salon-scoped query | list/empty/mobile | no cross-salon reads | admin sees clients | list renders |
| add client | P0 | M | high | `crm-client-feature` | validation/RLS | create form | no sensitive logs | required contact data | client saved |
| edit client | P0 | M | high | `crm-client-feature` | validation/RLS | edit form | IDOR prevention | update history-safe fields | changes saved |
| delete client | P1 | M | high | `privacy-security-check` | dependency behavior | confirm dialog | destructive action guarded | appointments relation clear | safe delete/anonymize decision |
| search by name/phone | P0 | S | medium | `crm-client-feature` | search cases | search UI | search scoped by salon | phone normalization | relevant results |
| client profile | P0 | M | high | `crm-client-feature` | not found/forbidden | profile route | IDOR prevention | history correct | profile opens |
| visit history | P0 | M | medium | `api-integration` | status filtering | history table | scoped appointments | completed/cancelled labels | history accurate |
| notes | P1 | S | high | `privacy-security-check` | length/safe display | notes UI | no notes in logs | private notes clear | notes saved safely |
| duplicate phone warning | P1 | M | medium | `crm-client-feature` | normalized duplicates | warning appears | scoped duplicate query | avoids duplicate clients | warning works |
| birthday field | P2 | S | medium | `crm-client-feature` | date validation | form/profile | birthday sensitive | optional field | displays safely |

## C. Services

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| service list | P0 | S | medium | `crm-service-master-feature` | scoped query | list/empty | salon scope | active services visible | list renders |
| add service | P0 | M | medium | `crm-service-master-feature` | validation | create form | scoped insert | price/duration valid | service saved |
| edit service | P0 | M | medium | `crm-service-master-feature` | validation | edit form | scoped update | future bookings use new values | changes saved |
| activate/deactivate service | P0 | S | medium | `crm-service-master-feature` | selectable filter | status toggle | scoped update | inactive not selectable | status works |
| category | P1 | S | low | `ui-feature` | category validation | badges/filter | scoped data | useful grouping | category displayed |
| price validation | P0 | S | medium | `crm-service-master-feature` | negative/zero cases | form errors | safe errors | price snapshot source | invalid blocked |
| duration validation | P0 | S | high | `crm-service-master-feature` | zero/negative cases | form errors | safe errors | appointment end_time | invalid blocked |

## D. Masters

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| master list | P0 | S | medium | `crm-service-master-feature` | scoped query | list/empty | staff data scoped | active masters shown | list renders |
| add master | P0 | M | medium | `crm-service-master-feature` | validation | create form | no contact logs | master schedulable | master saved |
| edit master | P0 | M | medium | `crm-service-master-feature` | validation | edit form | IDOR prevention | schedule unaffected | changes saved |
| activate/deactivate master | P0 | S | high | `crm-appointment-feature` | selectable filter | status toggle | scoped update | inactive not bookable | status works |
| specialization | P1 | S | low | `ui-feature` | text validation | table/form | scoped data | helps selection | displayed |
| contact info | P1 | S | medium | `privacy-security-check` | phone/email validation | form | no contact logs | admin can contact | saved safely |
| active masters filter | P0 | S | medium | `crm-service-master-feature` | filter logic | appointment form | scoped query | prevents invalid booking | only active selectable |

## E. Appointments

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| create appointment | P0 | L | high | `crm-appointment-feature` | validation/conflicts | booking flow | scoped insert | all invariants | appointment saved |
| edit appointment | P0 | L | high | `crm-appointment-feature` | conflict on update | edit flow | IDOR prevention | price/duration rules | changes safe |
| reschedule | P0 | M | high | `crm-appointment-feature` | overlap/date checks | reschedule flow | scoped update | no double-booking | reschedule works |
| cancel | P0 | S | medium | `crm-appointment-feature` | status update | cancel flow | scoped update | frees time if decided | status cancelled |
| status changes | P0 | M | high | `crm-appointment-feature` | transition tests | status menu | role permissions | analytics status rules | statuses correct |
| auto price snapshot | P0 | M | high | `data-model-review` | service price change | create flow | safe read | historical analytics | price copied |
| auto duration/end_time | P0 | M | high | `crm-appointment-feature` | time math | create form | safe errors | end_time correct | calculated |
| conflict prevention | P0 | L | high | `crm-appointment-feature` | overlap matrix | conflict scenario | RLS plus constraint/function | no double-booking | conflict blocked |
| filter by date/master/status | P1 | M | medium | `ui-feature` | filter query | filters UI | scoped query | admin workflow | filters work |
| appointment comments | P1 | S | high | `privacy-security-check` | length/safe display | form/table | no comment logs | comments private | comments saved safely |

## E2. Public website

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| landing page | P0 | M | low | `ui-feature` | render/smoke | homepage/mobile/CTA | no private data | clear booking entry | branded public page works |
| services catalog | P1 | M | medium | `ui-feature` | active services only | catalog/empty/mobile | expose only public fields | price/duration accurate | active services shown |
| masters page | P1 | M | medium | `ui-feature` | active masters only | list/empty/mobile | no private contacts | only bookable masters shown | active masters shown |
| contacts page | P1 | S | low | `ui-feature` | render/smoke | address/phone/hours | public salon fields only | working hours match settings | contacts visible |

## E3. Online booking

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| booking flow | P0 | L | high | `crm-appointment-feature` | end-to-end booking | full flow/mobile | public insert must be safe | creates scheduled appointment | client can book |
| service selection | P0 | M | medium | `crm-service-master-feature` | active service filtering | service step/empty | expose only active services | duration/price source | service selected |
| master selection | P0 | M | high | `crm-appointment-feature` | active/available master | master step | no private staff contacts | supports "любой подходящий" | master resolved |
| available slots | P0 | L | high | `crm-appointment-feature` | overlap matrix | no slots/conflict | no client data leaks | no active overlap | valid slots shown |
| client info | P0 | M | high | `privacy-security-check` | phone/name validation | invalid/valid submit | client data sensitive | create/reuse client safely | data accepted safely |
| appointment confirmation | P0 | M | high | `crm-appointment-feature` | final conflict recheck | success/conflict | no internal IDs exposed | price snapshot/end_time | scheduled appointment created |
| conflict prevention | P0 | L | high | `supabase-rls-review` | concurrent booking checks | taken slot scenario | policies/constraints | no double-booking | conflict blocked |

## F. Dashboard

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| appointments today | P0 | M | medium | `api-integration` | date/timezone | dashboard | scoped query | Europe/Moscow day | correct list |
| clients count | P0 | S | low | `api-integration` | count query | stat card | scoped query | count active clients | correct count |
| revenue this month | P0 | M | medium | `data-model-review` | completed only | stat card | scoped query | historical price | correct revenue |
| upcoming appointments | P0 | S | medium | `ui-feature` | status/date filter | dashboard list | scoped query | excludes cancelled | list works |
| popular services | P1 | M | medium | `ui-feature` | aggregation | chart | scoped query | completed visits | chart works |
| mini chart | P1 | M | medium | `ui-feature` | data shape | chart render | scoped query | correct period | chart renders |

## G. Analytics

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| monthly revenue | P0 | M | medium | `data-model-review` | date ranges | analytics | scoped query | completed only | chart accurate |
| completed appointments | P0 | S | low | `api-integration` | status count | analytics | scoped query | status correct | count accurate |
| top services | P1 | M | medium | `ui-feature` | aggregation | chart/table | scoped query | service snapshot labels | ranking accurate |
| top masters | P1 | M | medium | `ui-feature` | aggregation | stats table | scoped query | completed visits | ranking accurate |
| new clients | P1 | S | medium | `api-integration` | created_at range | stats | scoped query | timezone range | count accurate |
| repeat clients | P2 | M | medium | `data-model-review` | repeated completed visits | stats | scoped query | definition clear | metric accurate |

## H. Settings

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| salon name | P0 | S | medium | `api-integration` | validation | settings form | owner scoped | shown in UI | saved |
| salon phone | P1 | S | medium | `privacy-security-check` | phone validation | settings form | no phone logs | contact data | saved |
| address | P1 | S | medium | `privacy-security-check` | text validation | settings form | scoped data | salon profile | saved |
| working hours | P0 | M | high | `crm-appointment-feature` | schedule validation | settings UI | scoped update | booking boundaries | hours affect booking |
| profile settings | P1 | S | medium | `privacy-security-check` | validation | profile form | own profile only | display name | saved |

## I. UI/UX polish

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| skeleton loading | P1 | S | low | `ui-feature` | render tests | slow state | none | workflow clarity | skeletons used |
| empty states | P0 | S | low | `ui-feature` | empty data | all pages | no leaked hints | next action clear | empty states useful |
| error toasts | P1 | S | medium | `privacy-security-check` | safe messages | failed actions | no sensitive errors | recovery clear | errors safe |
| confirm dialogs | P0 | S | medium | `ui-feature` | confirm/cancel | delete/cancel | destructive guard | avoids mistakes | dialogs work |
| mobile nav | P0 | M | medium | `ui-feature` | nav behavior | mobile viewport | no data leak | daily use | nav works |
| responsive tables | P0 | M | medium | `ui-feature` | layout checks | mobile/tablet | no hidden critical actions | admin workflow | tables usable |
| Russian formatting | P0 | S | low | `ui-feature` | formatter tests | UI scan | no issue | natural locale | dates/prices/phones correct |

## J. Security/RLS

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RLS policies | P0 | L | high | `supabase-rls-review` | two-salon checks | not required | core isolation | all data scoped | policies pass |
| cross-salon access tests | P0 | M | high | `supabase-rls-review` | manual SQL/tests | not required | IDOR/RLS | no tenant leaks | blocked |
| role permissions | P1 | L | high | `privacy-security-check` | role matrix | role UI | bypass risk | owner/admin/master rights | permissions enforced |
| safe errors | P0 | S | medium | `privacy-security-check` | error snapshots | failed flows | no sensitive data | admin understands | safe messages |
| no sensitive logs | P0 | S | high | `privacy-security-check` | log scan | not required | personal data leak | privacy | no unsafe logs |
| audit log later | P2 | L | medium | `data-model-review` | event tests | admin UI later | sensitive metadata | trace changes | planned only |

## K. Future features

| Feature | Priority | Complexity | Risk | Suggested skill | Tests needed | Browser verification | RLS/security concern | Business-rule concern | Done criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reminders | P2 | L | high | `crm-appointment-feature` | schedule/send tests | settings/appointment | contact consent | timing rules | safe reminder flow |
| Telegram notifications | P2 | L | high | `api-integration` | webhook tests | setup UI | token safety | notification timing | dev-only setup |
| SMS integration | P2 | L | high | `privacy-security-check` | provider mocks | settings | phone/privacy | delivery status | explicit approval |
| WhatsApp integration | P2 | L | high | `privacy-security-check` | provider mocks | settings | consent/privacy | message templates | explicit approval |
| advanced online booking UX | P2 | L | high | `crm-appointment-feature` | public booking tests | public flow | public data exposure | availability rules | richer booking after MVP |
| smart service picker | P2 | L | medium | `feature-backlog-planner` | recommendation rules | picker flow | avoid sensitive profiling | suggests suitable service | later-only spec |
| price calculator | P2 | L | medium | `data-model-review` | pricing variants | calculator UI | no hidden internal prices | price rules explicit | calculated estimate |
| before/after portfolio | P2 | L | medium | `ui-feature` | image states | gallery/mobile | upload/privacy later | visual trust | public gallery |
| waitlist | P2 | L | high | `crm-appointment-feature` | queue rules | no-slot flow | client contact sensitive | converts to appointment safely | waitlist works |
| delay control | P2 | M | medium | `crm-appointment-feature` | delay/status rules | master/admin UI | no client data leak | updates schedule expectations | delay visible |
| review request automation | P2 | L | high | `privacy-security-check` | consent/send rules | completed visit flow | contact consent | only after completed visits | safe request flow |
| deposits/prepayment | P2 | L | high | `privacy-security-check` | payment tests | checkout | payment security | cancellation policy | explicit scope |
| inventory | P2 | L | medium | `data-model-review` | stock rules | inventory UI | scoped data | stock usage | later module |
| multi-branch support | P2 | L | high | `data-model-review` | tenant/branch tests | branch UI | isolation complexity | branch schedules | later architecture |
